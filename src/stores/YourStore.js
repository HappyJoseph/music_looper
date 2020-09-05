import React from 'react';
import { observable, action } from 'mobx';
import { useObserver,  } from 'mobx-react';
const size = 400;

class YourStore {
  @observable
  isRecording = false;

  @action
  setRecording = (b) => {
    this.isRecording = b;
  }

  useRecording = () => {
    return useObserver(() => ({ // useObserver를 사용해서 리턴하는 값의 업데이트를 계속 반영한다
      isRecording : this.isRecording,
    }))
  }
}

const yourStore = () => {
  return new YourStore();
}

export default yourStore;