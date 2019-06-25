/* eslint-disable */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as client from './Client.js';

function App() {
  var flag = 0;
  return (
    <div className="App">
      {/* {render} */}

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          <button className='client' onClick={() => flag = 1}>BUTTON</button><br></br>
          Hello World
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
