/* eslint-disable */
import React from 'react';
import * as utils from './clientutils.js'; 
import title from './title.png';
import glogo from './g-logo.png';
import './client.css';
import Admin from './Admin'

function Client() {
  return (
    <div className='clientdiv'>
      <AetherasForm/>
      <a className='adminform' id='admin'>
        <Admin/>
      </a>
        {/* <img className='logo' src={title} alt='title'/>
        <button type="button" className="google-button" onClick={() => utils.googlelogin()} id='login'>
          <span className="google-icon">
            <img className='glogo' src={glogo} alt='glogo'/>
          </span>
          <span className="google-text">Sign in with Google</span>
        </button>
        <form className='checks' id='form'>
            <label>Optional: Input date and time if adding to backlog</label><br></br><br></br>
            <input className='datetime' type='date' defaultValue=''/><span> </span>
            <input className='datetime' type='time' defaultValue=''/><br></br><br></br>
            <input className='radio' type='radio' name='check' defaultValue='checkin'/> <span className='check'>Check in</span>
            <input className='radio' type='radio' name='check' defaultValue='checkout'/> <span className='check'>Check out</span><br></br>
            <input type='button' onClick={() => utils.myfunction()} defaultValue='Submit'/>
            <h3 id='text'> </h3>
        </form>
        <form className='adminform' id='admin'>
          <button className='nbutton' type="button" onClick={() => adminutils.addEmail()}>Add Email</button><br></br>
          <button className='nbutton' type="button" onClick={() => adminutils.viewEmail()}>View Email registry</button><br></br>
          <button className='nbutton' type="button" onClick={() => adminutils.userlogs()}>Check user logs</button><br></br>
          <br></br><label>Enter Range:</label><br></br>
          <span>from: </span>
          <input className='datetime' type='date' name='startdate' id='startdate'/>
          <span> to: </span>
          <input className='datetime' type='date' name='enddate' id='enddate'/><br></br>
          <button className='nbutton' type="button" onClick={() => adminutils.writeCSV()}>Get CSV</button><br></br>
        </form><br></br><br></br> */}
    </div>
    
  );
}
function DisplayLogo() {
  return (
    <img className='logo' src={title} alt='title'/>
  );
}
function GoogleButton() {
  return (
    <button type="button" className="google-button" onClick={() => utils.googlelogin()} id='login'>
      <span className="google-icon">
        <img className='glogo' src={glogo} alt='glogo'/>
      </span>
      <span className="google-text">Sign in with Google</span>
    </button>
  );
}
function OptionalLabel() {
  return (
    <label>
      Optional: Input date and time if adding to backlog
    </label>
  );
}
function Datebox(props) {
  return (
    <input className='datetime' type='date' value={props.value} onChange={ props.handleChange }/>
  );
}
function Timebox(props) {
  return (
    <input className='datetime' type='time' value={props.value} onChange={ props.handleChange }/>
  );
}
function CheckInButton(props) {
  return (
    <input type='button' className='cbuttons' onClick={props.onClick} defaultValue='Check In'/>
  )
}

function CheckOutButton(props) {
  return (
    <input type='button' className='cbuttons' onClick={props.onClick} defaultValue='Check Out'/>
  )
}
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      time: '',
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
  }
  handleDate(e) {
    let value = e.target.value;
    this.setState({ date: value });
  }
  handleTime(e) {
    let value = e.target.value;
    this.setState({ time: value });
  }
  handleClick(i) {
    if (i == 0)
      utils.checkin(this.state.date, this.state.time)
    else 
      utils.checkout(this.state.date, this.state.time)
  }

  render() {
    return (
      <div>
        <OptionalLabel/><br></br><br></br>
        <Datebox value={this.state.date} handleChange={this.handleDate}/>
        <Timebox value={this.state.time} handleChange={this.handleTime}/><br></br><br></br>
        <CheckInButton onClick={() => this.handleClick(0)}/>
        <CheckOutButton onClick={() => this.handleClick(1)}/>
      </div>
    );
  }
}

function AetherasForm() {
  return (
    <div>
      <DisplayLogo/>
      <a id='login'>
        <GoogleButton/>
      </a>
      <a className='checksform' id='form'>
        <Form/>
      </a>
      <h3 id='text'></h3>
    </div>
  );
}

export default Client;