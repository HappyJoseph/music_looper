import React from 'react';
import './App.css';
import AudioLooper from './AudioLooper';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h3>Mix music bit and make fun sound</h3>
        </div>
      </header>
      <AudioLooper></AudioLooper>
    </div>
  );
}

export default App;
