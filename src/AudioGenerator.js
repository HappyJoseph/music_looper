import React, {Component} from 'react';
import {
  OSC_STOP,
  OSC_START,
  NUM_OF_BIT_BUTTONS,
  NUM_OF_DRUM_BUTTONS
} from './Constant';
var WAVE_TYPE = ['sine', 'square', 'sawtooth', 'triangle', 'custom']
var DRUM_FILE = [
  '_drum_35_17_JCLive_sf2_file', 
  '_drum_40_1_JCLive_sf2_file', 
  '_drum_42_1_JCLive_sf2_file', 
  '_drum_51_1_JCLive_sf2_file', 
  '_drum_50_1_JCLive_sf2_file',
  '_drum_48_1_JCLive_sf2_file',
  '_drum_41_1_JCLive_sf2_file'
];

var TYPE_OF_WAVE = 3;
var webaudiofont = require('webaudiofont');

export default class AudioGenerator {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscList = [];
    this.oscStat = [];
    this.drumStat = [];
    this.masterGainNode = null;
  
    this.noteFreq = null;
    this.customWaveform = null;
    this.sineTerms = null;
    this.cosineTerms = null;

    this.instr = null;

    this.sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    this.cosineTerms = new Float32Array(this.sineTerms.length);
    this.customWaveform = this.audioContext.createPeriodicWave(this.cosineTerms, this.sineTerms);

    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.value = 0.3; //volumeControl.value;

    this.createNoteTable();

    this.createInstruments();

    this.player = new webaudiofont();
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12835_17_JCLive_sf2_file.js',DRUM_FILE[0]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12840_1_JCLive_sf2_file.js',DRUM_FILE[1]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12842_1_JCLive_sf2_file.js',DRUM_FILE[2]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12851_1_JCLive_sf2_file.js',DRUM_FILE[3]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12850_1_JCLive_sf2_file.js',DRUM_FILE[4]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12848_1_JCLive_sf2_file.js',DRUM_FILE[5]);
    this.changeInstrument('https://surikov.github.io/webaudiofontdata/sound/12841_1_JCLive_sf2_file.js',DRUM_FILE[6]);
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

  createInstruments = () => {
    this.oscList = [];
    for (var i = 0; i < NUM_OF_BIT_BUTTONS; i++)  {
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

    this.drumStat = [];
    for (var j = 0; j < NUM_OF_DRUM_BUTTONS; j++)  {
      this.drumStat.push(OSC_STOP);
    }
  }

  notePressed = (type) => {
    if (type < NUM_OF_BIT_BUTTONS) {
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
    } else {
      var i = type - NUM_OF_BIT_BUTTONS;
      if (this.drumStat[i] === OSC_STOP) {
        switch (i) {
          case 0:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_35_17_JCLive_sf2_file, 0, 35, 3);
            break;
          case 1:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_40_1_JCLive_sf2_file, 0, 40, 3);
            break;
          case 2:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_42_1_JCLive_sf2_file, 0, 42, 3);
            break;
          case 3:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_51_1_JCLive_sf2_file, 0, 51, 3);
            break;
          case 4:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_50_1_JCLive_sf2_file, 0, 50, 3);
            break;
          case 5:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_48_1_JCLive_sf2_file, 0, 48, 3);
            break;
          case 6:
            this.player.queueWaveTable(this.audioContext, this.audioContext.destination, _drum_41_1_JCLive_sf2_file, 0, 41, 3);
            break;
        }
        this.drumStat[i] = OSC_START;
      }
    }
  }

  noteReleased = (type) => {
    if (type < NUM_OF_BIT_BUTTONS) {
      if (this.oscStat[type] === OSC_START) {
        this.oscList[type].stop();
        this.oscList[type] = null;
        this.oscStat[type] = OSC_STOP;
      }
    } else {
      var i = type - NUM_OF_BIT_BUTTONS;
      if (this.drumStat[i] === OSC_START) {
        this.drumStat[i] = OSC_STOP;
      }
    }
  }

  changeInstrument = (path,name) => {
    var self = this;
    this.player.loader.startLoad(this.audioContext, path, name);
    this.player.loader.waitLoad(function () {
      self.instr = window[name];
    });
  }
}