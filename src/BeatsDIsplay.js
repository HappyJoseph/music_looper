import React, {useEffect} from 'react';
import * as THREE from 'three';
import { Object3D } from 'three';
import {
  STATE_PAUSE,
  ACTION_DOWN,
  COLOR_PALETTE,
  MILI_PER_ONE_ROTATION,
  NUM_OF_SAMPLES,
  
} from './Constant';


var center;
var timeStart;
var curRad;
var beats;
var scene;
var PI2 = 6.283185307179586;
var PId2 = 1.570796326794897
var beatsTorus = [];
var recTorus = null;
var recStartTime = 0;
const BeatsDIsplay = (centerVec, _scene, _beats) => {
  center = centerVec;
  var beatDisplay = new Object3D();
  beats = _beats;
  scene = _scene;

  timeStart = Date.now();
  var initDuration = Date.now() - beats.getGlobalStartTime();
  curRad = ((initDuration % MILI_PER_ONE_ROTATION)/ MILI_PER_ONE_ROTATION) * PI2;

  return beatDisplay;
}

export const ClearDisply = () => {
  if (scene) {
    beatsTorus.map((v)=> {
      scene.remove(v)      
    })
  }
}

export const render = () => {
  if (!!beats && beats.state !== STATE_PAUSE) {
    if (beats.keyState === ACTION_DOWN) {
      if (recTorus === null) {
        recStartTime = Date.now();
        var geometry = new THREE.TorusGeometry( 100 + beats.beats.length * 40, 10, 16, 50, 0.0001);
        var material = new THREE.MeshBasicMaterial( { color: COLOR_PALETTE[beats.keyType] } );
        var torus  = new THREE.Mesh( geometry, material );
        torus.rotateX(PId2);
        torus.rotateZ(PId2);
        recTorus = torus;
        beatsTorus.push(torus);
        scene.add(torus);
      } else {
        var duration = Date.now() - recStartTime;
        var calcRad = ((duration % MILI_PER_ONE_ROTATION) / MILI_PER_ONE_ROTATION) * -PI2;
        recTorus.geometry = new THREE.TorusGeometry( 100 + beats.beats.length * 40, 10, 50, 50, calcRad);
      }
    } else {
      recStartTime = 0;
      recTorus = null;
    }
  } else {
    recStartTime = 0;
    recTorus = null;
  }

  var duration = Date.now() - beats.getGlobalStartTime();
  var calcRad2 = ((duration % MILI_PER_ONE_ROTATION)/ MILI_PER_ONE_ROTATION) * PI2 - curRad;
  curRad += calcRad2;
  beatsTorus.forEach((v)=>{
      v.rotateZ(calcRad2);
  })
}

export default BeatsDIsplay;