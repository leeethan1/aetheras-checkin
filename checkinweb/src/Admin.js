/* eslint-disable */
import React from 'react';
import * as autils from './adminutils';

function Admin() {
  return (
    <AdminForm />
  );
}

function StartDate(props) {
  return (
    <div>
      <label>Start:</label>
      <input className='datetime' type='date' id='startdate' value={props.value} onChange={props.handleChange} />
    </div>
  );
}

function EndDate(props) {
  return (
    <div>
      <label>End:&nbsp;&nbsp;</label>
      <input className='datetime' type='date' id='enddate' value={props.value} onChange={props.handleChange} />
    </div>
  );
}

function AddEmail(props) {
  return (
    <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='Add Employee' />
  );
}

function AddedEmail(props) {
  return (
    <h4>{props.data}</h4>
  );
}
class AddEmailBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
    this.handleClick = this.handleClick.bind(this);
  }
  async handleClick() {
    let promise = autils.addEmail();
    await promise.then((x) => {if (x) this.setState({ value: x })});
  }

  render() {
    return(
      <div>
        <AddEmail onClick={() => this.handleClick()} />
        <AddedEmail data={this.state.value} />
      </div>
    );
  }
}

function ViewEmail(props) {
  return (
    <div>
      <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='View Email Registry' />
    </div>
  );
}

function DisplayEmail(props) {
  return(
    <div>{props.component}</div>
  )
}

class ViewEmailBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          email: '',
        },
      ],
    }
    this.handleClick = this.handleClick.bind(this);
  }
  async handleClick() {
    let promise = autils.viewEmail();
    await promise.then((x) => {this.setState({ data: x })});
  }

  render() {
    return(
      <div className='viewemail'>
        <ViewEmail onClick={() => this.handleClick()}/>
        {this.state.data.map((component, i) => <DisplayEmail key={i} component={component.email}/>)}
      </div>
    );
  }
}

function UserLogs(props) {
  return (
    <div>
    <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='View User Logs' />
    </div>
  );
}

function UserLogEntries(props) {
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.checkin}</td>
      <td>{props.checkout}</td>
    </tr>
  );
}
class UserLogTable extends React.Component {
  render() {
    var rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.checkdate}
        checkin={entry.checkintime} checkout={entry.checkouttime}/>);
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
      <label>{props.data[0].email} </label><br></br>
      <label>{props.data[0].firstname} </label>
      <label>{props.data[0].lastname}</label>
    </div>
  );
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
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    let promise = autils.userlogs();
    await promise.then((x) => {if (x) this.setState({ data: x })});
  }

  render() {
    return (
      <div className='userlogs'>
        <UserLogs onClick={() => this.handleClick()} data={this.state.data}/>
        <SelectedUserInfo data={this.state.data}/>
        <UserLogTable data={this.state.data}/>
      </div>
    );
  }
}

function WriteCSV(props) {
  return (
    <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='Download CSV' />
  )
}

class AdminForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sDate: '',
      eDate: '',
    };
    this.handlesDate = this.handlesDate.bind(this);
    this.handleeDate = this.handleeDate.bind(this);
  }

  handlesDate(e) {
    let value = e.target.value;
    this.setState({ sDate: value });
  }

  handleeDate(e) {
    let value = e.target.value;
    this.setState({ eDate: value });
  }

  handleClick() {
    autils.writeCSV();
  }

  render() {
    return (
      <div>
        <StartDate value={this.state.sDate} handleChange={this.handlesDate} />
        <EndDate value={this.state.eDate} handleChange={this.handleeDate} /><br></br>
        <WriteCSV onClick={() => this.handleClick()} /><br></br><br></br>
        <AddEmailBox/> 
        <ViewEmailBox/>
        <UserLogBox/>
      </div>
    );
  }
}

export default Admin;