import React, {useEffect} from 'react';
import * as THREE from 'three';
import { Object3D, Vector3 } from 'three';
import {
  NUM_OF_BIT_BUTTONS,
  WIDTH_OF_BIT_BUTTONS,
  HEIGHT_OF_BIT_BUTTONS,
  X_OF_BIT_BUTTONS,
  Z_OF_BIT_BUTTONS,
  GAP_OF_BIT_BUTTONS,
  COLOR_PALETTE
} from './Constant';

var center;
var btns = [];
var btnState = new Array(NUM_OF_BIT_BUTTONS);
var beats;

const Keyboards = (centerVec, _beats) => {
  center = centerVec;
  var keyboards = new Object3D();

  btns = [];
  beats = _beats;

  for (var i = 0; i < NUM_OF_BIT_BUTTONS; i++){
    var geometry = new THREE.BoxGeometry( WIDTH_OF_BIT_BUTTONS, 10, HEIGHT_OF_BIT_BUTTONS );
    var material = new THREE.MeshBasicMaterial( {color: COLOR_PALETTE[i]} );
    var btnBit = new THREE.Mesh( geometry, material );
    btnBit.objId = i;
    btnBit.position.setX(X_OF_BIT_BUTTONS + WIDTH_OF_BIT_BUTTONS * i + GAP_OF_BIT_BUTTONS * (i - 1));
    btnBit.position.setY(0);
    btnBit.position.setZ(Z_OF_BIT_BUTTONS);
    btnBit.position.addVectors(btnBit.position, centerVec);

    btnBit.cursor = 'pointer'
    btnBit.on('mousedown', mouseDown);
    btnBit.on('mouseout', mouseOut);
    btnBit.on('mouseup', mouseUp);

    btns.push(btnBit);
    keyboards.add(btnBit);
  }

  return keyboards;
}

export const render = () => {
  
}

const mouseDown = (e) => {
  e.data.target.position.setY(-30);
  beats.down(Date.now(), e.data.target.objId)
}

const mouseOut = (e) => {
  beats.up(Date.now(), e.data.target.objId)
  btns.map((v)=>{
    v.position.setY(0);
  })
}

const mouseUp = (e) => {
  e.data.target.position.setY(0);
  beats.up(Date.now(), e.data.target.objId)
}

export default Keyboards;