import * as THREE from 'three';
import { Object3D } from 'three';
import {
  NUM_OF_BIT_BUTTONS,
  NUM_OF_DRUM_BUTTONS,
  WIDTH_OF_BIT_BUTTONS,
  HEIGHT_OF_BIT_BUTTONS,
  RADIUS_OF_CIRCLE,
  X_OF_BIT_BUTTONS,
  Z_OF_BIT_BUTTONS,
  X1_OF_DRUM_BUTTONS,
  GAP_OF_BIT_BUTTONS,
  KEY_COLOR_PALETTE,
  DRUM_COLOR_PALETTE,
  GAP_OF_DRUM_BUTTONS,
} from './Constant';

var center;
var keyBtns = [];
var drumBtns = [];
var beats;

const Keyboards = (centerVec, _beats) => {
  center = centerVec;
  var keyboards = new Object3D();

  beats = _beats;

  for (var i = 0; i < NUM_OF_BIT_BUTTONS; i++){
    var keyGeo = new THREE.BoxGeometry( WIDTH_OF_BIT_BUTTONS, 10, HEIGHT_OF_BIT_BUTTONS );
    var keyMaterial = new THREE.MeshBasicMaterial( {color: KEY_COLOR_PALETTE[i]} );
    var keyBtn = new THREE.Mesh( keyGeo, keyMaterial );
    keyBtn.objId = i;
    keyBtn.position.setX(X_OF_BIT_BUTTONS + WIDTH_OF_BIT_BUTTONS * i + GAP_OF_BIT_BUTTONS * (i - 1));
    keyBtn.position.setY(0);
    keyBtn.position.setZ(Z_OF_BIT_BUTTONS);
    keyBtn.position.addVectors(keyBtn.position, centerVec);

    keyBtn.cursor = 'pointer'
    keyBtn.on('mousedown', keyDown);
    keyBtn.on('mouseout', keyOut);
    keyBtn.on('mouseup', keyUp);

    keyBtns.push(keyBtn);
    keyboards.add(keyBtn);
  }

  for (var j = 0; j < NUM_OF_DRUM_BUTTONS; j++){
    var drumGeo = new THREE.CircleBufferGeometry( RADIUS_OF_CIRCLE, 30 );
    var drumMaterial = new THREE.MeshBasicMaterial( {color: DRUM_COLOR_PALETTE[j]} );
    var drumBtn = new THREE.Mesh( drumGeo, drumMaterial );
    drumBtn.objId = j + NUM_OF_BIT_BUTTONS;
    drumBtn.position.setX(X1_OF_DRUM_BUTTONS + RADIUS_OF_CIRCLE * j + GAP_OF_DRUM_BUTTONS * (j - 1));
    drumBtn.position.setY(530);
    drumBtn.position.setZ(Z_OF_BIT_BUTTONS);
    drumBtn.position.addVectors(drumBtn.position, centerVec);

    drumBtn.cursor = 'pointer'
    drumBtn.on('mousedown', drumDown);

    drumBtns.push(drumBtn);
    keyboards.add(drumBtn);
  }

  return keyboards;
}

export const render = () => {
  
}

const keyDown = (e) => {
  e.data.target.position.setY(-30);
  beats.down(Date.now(), e.data.target.objId)
}

const keyOut = (e) => {
  beats.up(Date.now(), e.data.target.objId)
  keyBtns.map((v)=>{
    v.position.setY(0);
  })
}

const keyUp = (e) => {
  e.data.target.position.setY(0);
  beats.up(Date.now(), e.data.target.objId)
}


const drumDown = (e) => {
  e.data.target.position.setZ(Z_OF_BIT_BUTTONS - 30);
  beats.down(Date.now(), e.data.target.objId);
  setTimeout(()=> {drumOut(e)}, 50);
}

const drumOut = (e) => {
  beats.up(Date.now(), e.data.target.objId)
  drumBtns.map((v)=>{
    v.position.setZ(Z_OF_BIT_BUTTONS);
  })
}

export default Keyboards;