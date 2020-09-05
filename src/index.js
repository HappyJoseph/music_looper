import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "mobx-react";
import yourStore from "./stores/YourStore";

const store = yourStore();

ReactDOM.render(
  <React.StrictMode>
    <div className="App-header">Music Looper by Joseph Kim</div>
    <div className="App-header-contact"><a href="mailto:cassita0623@gmail.com" style={{color : 'white'}}>cassita0623@gmail.com</a></div>
    <Provider yourStore={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
