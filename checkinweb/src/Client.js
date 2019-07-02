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
    <button type="button" className="google-button" onClick={() => utils.googleLogin()} id='login'>
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

function UserLogEntries(props) {
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.checkIn}</td>
      <td>{props.checkOut}</td>
    </tr>
  );
}
class UserLogTable extends React.Component {
  render() {
    var rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.checkdate}
        checkIn={entry.checkintime} checkOut={entry.checkouttime}/>);
    })
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In Time</th>
            <th>Check Out Time</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

function SelectedUserInfo(props) {
  return (
    <div>
      <label>{props.user[0].email} </label><br></br>
      <label>{props.user[0].firstname} </label>
      <label>{props.user[0].lastname}</label>
    </div>
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
      let stats = utils.checkIn(this.state.date, this.state.time);
      stats.then((stat) => {
          this.setState({value: stat[1]});
      });
    } else {
      let stats = utils.checkOut(this.state.date, this.state.time);
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

class UserLogBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          email: '',
          firstname: '',
          lastname: '',
        },
      ],
    }
    this.handleTable();
  }

  async handleTable() {
    let promise = utils.getUserLogs();
    await promise.then((x) => {if (x) {this.setState({ data: x })}});
  }

  render() {
    return (
      <div>
        <SelectedUserInfo user={this.state.data}/>
        <UserLogTable data={this.state.data}/>
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
          <Form/><br></br>
          <UserLogBox/>
        </a>
      </div>
    );
}

export default Client;