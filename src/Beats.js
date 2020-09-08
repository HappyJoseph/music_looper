import AudioGenerator from './AudioGenerator';
import {
  STATE_PAUSE,
  STATE_PRE_RECORDING,
  STATE_RECORDING,
  ACTION_DOWN,
  ACTION_UP,
  NUM_OF_BIT_BUTTONS,
  GLOBAL_START_TIME,
  MILI_PER_ONE_ROTATION,
} from './Constant';


class Beat {
  data = [];
  down = (timeDown, type) => {
    if (MILI_PER_ONE_ROTATION >= timeDown){
      this.data.push(
        {
          time : timeDown,
          action : ACTION_DOWN,
          type : type
        }
      )
    }
  }

  up = (timeUp, type) => {
    if (this.data.length > 0 && this.data[this.data.length - 1].action === ACTION_DOWN){
      if (MILI_PER_ONE_ROTATION < timeUp) {
        this.data.splice(this.data.length - 1, 1);
      } else {
        this.data.push(
          {
            time : timeUp,
            action : ACTION_UP,
            type : type
          }
        )        
      }
    }
  }

  recordEnd = () => {
    if (this.data.length > 0 && this.data[this.data.length - 1].action === ACTION_DOWN){
      this.data.splice(this.data.length - 1, 1);
    }
  }
}

export default class Beats {
  constructor(props) {
    this.props = props;
    this.audioGenerator = new AudioGenerator();
    var {setRecording} = this.props.yourStore;
    this.setRecording = setRecording;

    this.init();
    this.genSignal();
  }

  init = () => {
    this.beat = NUM_OF_BIT_BUTTONS;
    this.beats = [];
    this.beatsPos = [];
    this.beatsEnd = [];
    this.tmpBeat = null;
    this.state = STATE_PAUSE;
    this.keyState = ACTION_UP;
    this.keyType = 0;
    this.timeStart = [];
    this.timeEnd = 0;
  }

  getGlobalStartTime = () => {
    return GLOBAL_START_TIME;
  }

  startRecording = () => {
    console.log('start');
    if (this.state === STATE_PAUSE) {
      this.state = STATE_PRE_RECORDING;
      this.tmpBeat = new Beat();
    } 
  }

  stopRecording = () => {
    console.log('stop');
    if (this.state !== STATE_PAUSE) {
      this.keyState = ACTION_UP;
      this.setRecording(false); 
      this.state = STATE_PAUSE;
      this.beatsPos.push(0);
      this.beatsEnd.push(false);
      this.timeStart.push(this.getGlobalStartTime());
      this.tmpBeat.recordEnd();
      this.beats.push(this.tmpBeat);
    }
  }

  recordingTimeout = () => {
    console.log('timeout');
    if (this.state !== STATE_PAUSE) {
      this.state = STATE_PAUSE;
      this.keyState = ACTION_UP;
      this.setRecording(false);
      this.beatsPos.push(0);
      this.beatsEnd.push(false);
      this.timeStart.push(this.getGlobalStartTime());
      this.tmpBeat.recordEnd();
      this.beats.push(this.tmpBeat);
    }
  }

  down = (timeDown, type) => {
    this.keyState = ACTION_DOWN;
    this.keyType = type;
    if (this.state === STATE_PRE_RECORDING) {
      setTimeout(this.recordingTimeout, MILI_PER_ONE_ROTATION);
      this.tmpBeat.down((timeDown - this.getGlobalStartTime()) % MILI_PER_ONE_ROTATION, type);
      this.state = STATE_RECORDING;
    } else if (this.state === STATE_RECORDING && this.tmpBeat){
      this.tmpBeat.down((timeDown - this.getGlobalStartTime()) % MILI_PER_ONE_ROTATION, type);
    }
    this.audioGenerator.notePressed(type);
  }

  up = (timeUp, type) => {
    this.keyState = ACTION_UP;
    this.keyType = type;
    if (this.state !== STATE_PAUSE && this.tmpBeat){
      this.tmpBeat.up((timeUp - this.getGlobalStartTime()) % MILI_PER_ONE_ROTATION, type);
    }
    this.audioGenerator.noteReleased(type);
  }

  reset = () => {
    this.init();
  }

  genSignal = () => {
    for (var i = 0; i < this.beats.length; i++) {
      var data = this.beats[i].data;
      var data2 = data[this.beatsPos[i]];
      if (this.beatsEnd[i] && Date.now() - this.timeStart[i] > MILI_PER_ONE_ROTATION) {
        this.timeStart[i] = Date.now();
        this.beatsEnd[i] = false;
      }

      if (!this.beatsEnd[i] && data2.time < (Date.now() - this.timeStart[i]) % MILI_PER_ONE_ROTATION) {
        if (data2.action === ACTION_UP) {
          this.audioGenerator.noteReleased(data2.type);
        } else {
          this.audioGenerator.notePressed(data2.type);
        }

        this.beatsPos[i] = (this.beatsPos[i] + 1) % data.length;
        var data3 = data[this.beatsPos[i]];
        if (data2.time > data3.time) this.beatsEnd[i] = true;
      } 
    }
    setTimeout(this.genSignal, 5);
  }  
}