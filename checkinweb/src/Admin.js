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
    <div>
      <label>Upload Employee CSV </label>
      <input type="file" id='upload' accept="text/csv" name="names" onChange={() => autils.uploadCSV(this)}/><br></br>
      <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='Add Admin' />
    
    </div>
  );
}

function AddedEmail(props) {
  return (
    <div>{props.data}</div>
  );
}

function ViewEmail(props) {
  return (
    <div>
      <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='View Email Registry' />
    </div>
  );
}

class DisplayEmail extends React.Component {
  render() {
    var rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.email}
        checkin={entry.firstname} checkout={entry.lastname}/>);
    })
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
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
      <label>{props.user[0].email} </label><br></br>
      <label>{props.user[0].firstname} </label>
      <label>{props.user[0].lastname}</label>
    </div>
  );
}

class OutputBox extends React.Component {
  render() {
    if (this.props.data && this.props.flag == 0) {
      var user = <AddedEmail data={this.props.value} />
    } else if (this.props.data && this.props.flag == 1) {
      // var emails = this.props.data.map((component, i) => <DisplayEmail key={i} component={component}/>)
      var emails = <DisplayEmail data={this.props.data}/>
    } else if (this.props.data && this.props.flag == 2) {
      var info = <SelectedUserInfo user={this.props.data}/>
      var table = <UserLogTable data={this.props.data}/>
    }

    return (
      <div>
        {user}
        {emails}
        {info}
        {table}
      </div>
    );
  }
  
}

function WriteCSV(props) {
  return (
    <input type='button' className='nbuttons' onClick={props.onClick} defaultValue='Download CSV' />
  )
}

class FormCSV extends React.Component {
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
        {/* <AddEmailBox/> */}
      </div>
    );
  }
}

class AdminForm extends React.Component {
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
      flag: 0,
      value: '',
    }
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(i) {
    if (i == 0) {
      let promise = autils.addEmail();
      await promise.then((x) => {if (x) this.setState({ value: x })});
      this.setState({flag: 0});
    } else if (i == 1) {
      let promise = autils.viewEmail();
      await promise.then((x) => {this.setState({ data: x })});
      this.setState({flag: 1});
    } else if (i == 2) {
      let promise = autils.userlogs();
      await promise.then((x) => {if (x) this.setState({ data: x })});this.setState({flag: 2});
    }
  }

  render() {
    return (
      <div>
        <FormCSV/>
        <AddEmail onClick={() => this.handleClick(0)}/>
        <ViewEmail onClick={() => this.handleClick(1)}/>
        <UserLogs onClick={() => this.handleClick(2)}/>
        <OutputBox data={this.state.data} flag={this.state.flag} value={this.state.value}/>
      </div>
    );
  }
}

export default Admin;