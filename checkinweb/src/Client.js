/* eslint-disable */
import React from 'react';
import * as utils from './clientutils.js'; 
import title from './title.png';
import glogo from './g-logo.png';
import './client.css';

function Client() {
  return (
    <div>
        <img className='logo' src={title} alt='title'/>
        <button type="button" className="google-button" onClick={() => utils.googlelogin()} id='login'>
                <span className="google-icon">
                  <img className='glogo' src={glogo} alt='glogo'/>
                </span>
                <span className="google-text">Sign in with Google</span>
              </button>
        <form id='form'>
            <label>Optional: Input date and time if adding to backlog</label><br></br><br></br>
            <input type='date' className='date' defaultValue=''/>
            <input type='time' className='time' defaultValue=''/><br></br><br></br>
            <input className='radio' type='radio' name='check' defaultValue='checkin'/> <span className='check'>Check in</span>
            <input className='radio' type='radio' name='check' defaultValue='checkout'/> <span className='check'>Check out</span><br></br>
            <input type='button' onClick={() => utils.myfunction()} defaultValue='Submit'/>
            <h3 id='text'> </h3>
        </form>
    </div>
  )
}
export default Client;