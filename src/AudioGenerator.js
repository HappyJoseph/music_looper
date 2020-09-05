import React, {Component} from 'react';
import {
  OSC_STOP,
  OSC_START,
} from './Constant';
let NUM_OF_OSC = 7;
var WAVE_TYPE = ['sine', 'square', 'sawtooth', 'triangle', 'custom']
var TYPE_OF_WAVE = 2;

export default class AudioGenerator extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscList = [];
    this.oscStat = [];
    this.masterGainNode = null;
  
    this.noteFreq = null;
    this.customWaveform = null;
    this.sineTerms = null;
    this.cosineTerms = null;

    this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    this.cosineTerms = new Float32Array(this.sineTerms.length);
    this.customWaveform = this.audioContext.createPeriodicWave(this.cosineTerms, this.sineTerms);

    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.value = 10; //volumeControl.value;

    this.createNoteTable();

    this.createOscillator();
  
    // volumeControl.addEventListener("change", changeVolume, false);
 
    // Create the keys; skip any that are sharp or flat; for
    // our purposes we don't need them. Each octave is inserted
    // into a <div> of class "octave".
  
    // noteFreq.forEach(function(keys, idx) {
    //   let keyList = Object.entries(keys);
    //   let octaveElem = document.createElement("div");
    //   octaveElem.className = "octave";
      
    //   keyList.forEach(function(key) {
    //     if (key[0].length == 1) {
    //       octaveElem.appendChild(createKey(key[0], idx, key[1]));
    //     }
    //   });

    //   keyboard.appendChild(octaveElem);
    // });

    // document.querySelector("div[data-note='B'][data-octave='5']").scrollIntoView(false);
  
  }

  createNoteTable = () => {
    this.noteFreq = [];
    this.noteFreq.push(261.6); //"C"
    this.noteFreq.push(293.68); //"D"
    this.noteFreq.push(329.6);
    this.noteFreq.push(349.2);
    this.noteFreq.push(392);
    this.noteFreq.push(440);
    this.noteFreq.push(493);
  }

  createOscillator = () => {
    this.oscList = [];
    for (var i = 0; i < NUM_OF_OSC; i ++)  {
      let osc = this.audioContext.createOscillator();
      osc.connect(this.masterGainNode);
      
      if (WAVE_TYPE[TYPE_OF_WAVE] == "custom") {
        osc.setPeriodicWave(customWaveform);
      } else {
        osc.type = WAVE_TYPE[TYPE_OF_WAVE];
      }
    
      osc.frequency.value = this.noteFreq[i];
      this.oscList.push(osc);
      this.oscStat.push(OSC_STOP);
    }
  }

  notePressed = (type) => {
    if (oscStat[type] === OSC_STOP) {
      oscList[type].start();
      oscStat[type] = OSC_START;
    }

    return osc;
  }

  noteReleased = (type) => {
    if (oscStat[type] === OSC_START) {
      oscList[type].stop();
      oscStat[type] = OSC_STOP;
    }

    return osc;
  }

  render(){
    return (
      <div>
      </div>
    );
  }
}