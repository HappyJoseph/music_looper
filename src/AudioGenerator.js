import React, {Component} from 'react';
import {
  OSC_STOP,
  OSC_START,
  NUM_OF_BIT_BUTTONS
} from './Constant';
var WAVE_TYPE = ['sine', 'square', 'sawtooth', 'triangle', 'custom']
var TYPE_OF_WAVE = 3;

export default class AudioGenerator {
  constructor() {
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
    this.masterGainNode.gain.value = 0.3; //volumeControl.value;

    this.createNoteTable();

    this.createOscillator();
  }

  createNoteTable = () => {
    this.noteFreq = [];
    this.noteFreq.push(261.6);
    this.noteFreq.push(293.68);
    this.noteFreq.push(329.6);
    this.noteFreq.push(349.2);
    this.noteFreq.push(392);
    this.noteFreq.push(440);
    this.noteFreq.push(493);
  }

  createOscillator = () => {
    this.oscList = [];
    for (var i = 0; i < NUM_OF_BIT_BUTTONS; i ++)  {
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
    if (this.oscStat[type] === OSC_STOP) {
      let osc = this.audioContext.createOscillator();
      osc.connect(this.masterGainNode);
      
      if (WAVE_TYPE[TYPE_OF_WAVE] == "custom") {
        osc.setPeriodicWave(customWaveform);
      } else {
        osc.type = WAVE_TYPE[TYPE_OF_WAVE];
      }

      osc.frequency.value = this.noteFreq[type];
      this.oscList[type] = osc;

      this.oscList[type].start();
      this.oscStat[type] = OSC_START;
    }
  }

  noteReleased = (type) => {
    if (this.oscStat[type] === OSC_START) {
      this.oscList[type].stop();
      this.oscList[type] = null;
      this.oscStat[type] = OSC_STOP;
    }
  }
}