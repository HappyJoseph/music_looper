import React, {useEffect} from 'react';
import * as THREE from 'three';
import { Object3D, Vector3, LogLuvEncoding } from 'three';
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
}

export default class Beats {
  constructor(props) {
    this.props = props;
    var {setRecording} = props.yourStore;
    this.setRecording = setRecording;

    this.init();
  }

  init = () => {
    this.beat = NUM_OF_BIT_BUTTONS;
    this.beats = [];
    this.beatsPos = [];
    this.tmpBeat = null;
    this.state = STATE_PAUSE;
    this.keyState = ACTION_UP;
    this.keyType = 0;
    this.timeStart = 0;
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
      this.beats.push(this.tmpBeat);
      this.beatsPos.push(0);
    } 
  }

  stopRecording = () => {
    console.log('stop');
    this.state = STATE_PAUSE;
    this.keyState = ACTION_UP;
    this.setRecording(false); 
  }

  recordingTimeout = () => {
    console.log('timeout');
    this.state = STATE_PAUSE;
    this.keyState = ACTION_UP;
    this.setRecording(false);
    console.log(this.beats);
  }

  getAllBeatsState = () => {
  }

  down = (timeDown, type) => {
    this.keyState = ACTION_DOWN;
    this.keyType = type;
    if (this.state === STATE_PRE_RECORDING) {
      setTimeout(this.recordingTimeout, MILI_PER_ONE_ROTATION);
      this.tmpBeat.down((timeDown - this.timeStart) % MILI_PER_ONE_ROTATION, type);
      this.state = STATE_RECORDING;
    } else if (this.state === STATE_RECORDING && this.tmpBeat){
      this.tmpBeat.down((timeDown - this.timeStart) % MILI_PER_ONE_ROTATION - this.timeStart, type);
    }
  }

  up = (timeUp, type) => {
    this.keyState = ACTION_UP;
    this.keyType = type;
    if (this.state !== STATE_PAUSE && this.tmpBeat){
      this.tmpBeat.up((timeUp - this.timeStart) % MILI_PER_ONE_ROTATION, type);
    }
    console.log('ddddd', this.beats);
  }

  reset = () => {
    this.init();
  }
}