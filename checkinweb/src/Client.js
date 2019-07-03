/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable node/no-unsupported-features/es-syntax */

import React from 'react';

import './client.css';
import Admin from './Admin';
import title from './title.png';
import glogo from './g-logo.png';
import * as utils from './clientutils';

// complete page
function Client() {
  return (
    <div className='client-div'>
      <EmployeeForm />
      <div className='admin-form' id='admin'>
        <Admin />
      </div>
    </div>
  );
}

function DisplayLogo() {
  return (
    <img className='logo' src={title} alt='title' />
  );
}

function GoogleButton() {
  return (
    <button type="button" className="google-button" onClick={() => utils.googleLogin()} id='login'>
      <span className="google-icon">
        <img className='g-logo' src={glogo} alt='glogo' />
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
    <input className='date-time' type='date' value={props.value} onChange={props.handleChange} />
  );
}

function Timebox(props) {
  return (
    <input className='date-time' type='time' value={props.value} onChange={props.handleChange} />
  );
}

function CheckInButton(props) {
  return (
    <input type='button' className='checks-buttons' onClick={props.onClick}
      defaultValue='Check In' />
  );
}

function CheckOutButton(props) {
  return (
    <input type='button' className='checks-buttons' onClick={props.onClick}
      defaultValue='Check Out' />
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
    const value = e.target.value;
    this.setState({ date: value });
  }

  handleTime(e) {
    const value = e.target.value;
    this.setState({ time: value });
  }

  handleClick(i) {
    if (i === 0) {
      const stats = utils.checkIn(this.state.date, this.state.time);
      stats.then((stat) => {
        this.setState({
          value: stat[1],
          date: '',
          time: '',
        });
      });
    } else {
      const stats = utils.checkOut(this.state.date, this.state.time);
      stats.then((stat) => {
        this.setState({
          value: stat[1],
          date: '',
          time: '',
        });
      });
    }
  }

  render() {
    return (
      <div>
        <OptionalLabel/><br></br>
        <Datebox value={this.state.date} handleChange={this.handleDate} />
        <Timebox value={this.state.time} handleChange={this.handleTime} />
        <br></br><br></br>
        <CheckInButton onClick={() => this.handleClick(0)} />
        <CheckOutButton onClick={() => this.handleClick(1)} />
        <br></br>
        {this.state.value}
      </div>
    );
  }
}

function SelectedUserInfo(props) {
  return (
    <div>
      <label>{props.user[0].email} </label>
      <br></br>
      <label>{props.user[0].firstname} </label>
      <label>{props.user[0].lastname}</label>
    </div>
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
    const rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.checkdate}
        checkIn={entry.checkintime} checkOut={entry.checkouttime} />);
    });
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
    };
    this.handleTable();
  }

  async handleTable() {
    const promise = utils.getUserLogs();
    await promise.then((x) => { if (x) { this.setState({ data: x }); } });
  }

  render() {
    return (
      <div>
        <SelectedUserInfo user={this.state.data} />
        <UserLogTable data={this.state.data} />
      </div>
    );
  }
}

function EmployeeForm() {
  return (
    <div>
      <DisplayLogo />
      <div id='login'>
        <GoogleButton />
      </div>
      <div className='checks-form' id='form'>
        <Form />
        <br></br>
        <UserLogBox />
      </div>
    </div>
  );
}

export default Client;
