/* eslint-disable */
import React from 'react';
import './client.css';
import Admin from './Admin'
import title from './title.png';
import glogo from './g-logo.png';
import * as utils from './clientutils.js'; 


function Client() {
  return (
    <div className='clientdiv'>
      <AetherasForm/>
      <a className='adminform' id='admin'>
        <Admin/>
      </a>
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
  );
}

function CheckOutButton(props) {
  return (
    <input type='button' className='cbuttons' onClick={props.onClick} defaultValue='Check Out'/>
  );
}
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      time: '',
      value: '',
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    if (i == 0) {
      let stats = utils.checkin(this.state.date, this.state.time);
      stats.then((stat) => {
          this.setState({value: stat[1]});
      });
    } else {
      let stats = utils.checkout(this.state.date, this.state.time);
      stats.then((stat) => {
          this.setState({value: stat[1]});
      });
    }
  }

  render() {
    return (
      <div>
        <OptionalLabel/><br></br>
        <Datebox value={this.state.date} handleChange={this.handleDate}/>
        <Timebox value={this.state.time} handleChange={this.handleTime}/><br></br><br></br>
        <CheckInButton onClick={() => this.handleClick(0)}/>
        <CheckOutButton onClick={() => this.handleClick(1)}/>
        <br></br>{this.state.value}
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
    </div>
  );
}

export default Client;