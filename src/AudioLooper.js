import React, {useEffect, useState} from 'react';
import * as THREE from 'three';
import Keyboards,{render as keyboardsReander} from './Keyboards';
import BeatsDIsplay,{ClearDisply, render as beatsDisplayReander} from './BeatsDIsplay';
import Beats from './Beats';
import { Interaction } from 'three.interaction';
import { inject } from 'mobx-react';
import './AudioLooper.scss';
import AUdioGenerator from './AudioGenerator';
import {
  CANVAS_SIZE,
  CAMERA_POS_Y,
  CAMERA_POS_Z
} from './Constant';

var camera, scene, renderer, sunLight, interaction;
var beats;


const init = (props) => {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 90, 1, 0.1, 1500 );
  camera.position.y = CAMERA_POS_Y;
  camera.position.z = CAMERA_POS_Z;
  camera.lookAt(new THREE.Vector3(0,0,0));

  sunLight = new THREE.DirectionalLight(0xfff, 1);
  sunLight.position.set(0, 400);
  sunLight.castShadow = false;
  sunLight.lookAt( new THREE.Vector3(0,0,0) );
  scene.add( sunLight );

  beats = new Beats(props);


  scene.add(Keyboards(new THREE.Vector3(0,0,0), beats));
  BeatsDIsplay(new THREE.Vector3(0,0,0), scene, beats);
  
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha : true } );
  renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
  renderer.setClearColor( 0x000, 1);

  interaction = new Interaction(renderer, scene, camera);

  var p = document.createElement('div');
  p.appendChild(renderer.domElement);
  p.style.marginLeft = '50%';
  p.style.transform = 'translate(-450px)';//, background : 'red'};
  p.style.width = '800px';
  p.style.height = '800px';
  p.style.backgroundColor = 'black';

  document.body.appendChild(p);

  render();
}

const render = () => {
  keyboardsReander();
  beatsDisplayReander();

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

const AudioLooper = inject("yourStore")((props) => {
  var {isRecording} = props.yourStore.useRecording();
  var {setRecording} = props.yourStore;

  useEffect(() => {
    init(props);
  }, []);
  
  const onClick = () => {
    beats.startRecording();
    setRecording(!isRecording);
  }
  
  const onReset = () => {
    if (isRecording){
      beats.stopRecording();
      setRecording(!isRecording);
    } 
    beats.reset();
    ClearDisply();
  }

  return (
    <>
      {!isRecording?
        <button class="styled start" type="button" onClick={onClick}>
          Start Recording
        </button>
        :<></>
      }
      <button class="styled reset" type="button" onClick={onReset}>
        Reset
      </button>
      <AUdioGenerator/>
    </>
  )
})

export default AudioLooper;