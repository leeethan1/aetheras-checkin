/* eslint-disable */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './Client.js';

function App() {
  var flag = 0;
  return (
    <div className="App">
      <Client/>
      <button className='client' onClick={() => 'placeholder'}>BUTTON</button><br></br>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          
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
      </header> */}
    </div>
  );
}
export default App;
