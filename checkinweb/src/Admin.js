/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable node/no-unsupported-features/es-syntax */

import React from 'react';

import * as autils from './adminutils';

// complete form
function Admin() {
  return (
    <AdminForm />
  );
}

function StartDate(props) {
  return (
    <div>
      <label>Start:</label>
      <input className='date-time' type='date' id='startDate'
        value={props.value} onChange={props.handleChange} />
    </div>
  );
}

function EndDate(props) {
  return (
    <div>
      <label>End:&nbsp;&nbsp;</label>
      <input className='date-time' type='date' id='endDate'
        value={props.value} onChange={props.handleChange} />
    </div>
  );
}

function DownloadUserLogsCSV(props) {
  return (
    <input type='button' className='admin-buttons' onClick={props.onClick}
      defaultValue='Download Logs CSV' />
  );
}

class UploadEmployeeCSV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Upload Employee CSV',
    };
    this.ref = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange() {
    const promise = autils.uploadEmployeeCSV(this.ref.current);
    promise.then(() => { this.setState({ label: 'File Uploaded' }); });
  }

  render() {
    return (
      <div>
        <label>{this.state.label} </label>
        <input type="file" id='upload' accept="text/csv" name="names"
          onChange={() => this.handleChange()} value='' ref={this.ref} />
        <br></br><br></br>
      </div>
    );
  }
}

function DownloadEmployeeCSV() {
  return (
    <div>
      <input type='button' className='admin-buttons' onClick={() => autils.downloadEmployeeCSV()}
      value='Download Employee List' />
      <br></br><br></br>
    </div>
  );
}

function AddAdmin(props) {
  return (
    <input type='button' className='admin-buttons'
    onClick={props.onClick} defaultValue='Add Admin' />
  );
}

function DisplayAddedAdmin(props) {
  return (
    <div>{props.data}</div>
  );
}

function ViewEmail(props) {
  return (
    <div>
      <input type='button' className='admin-buttons' onClick={props.onClick}
        defaultValue='View Email Registry' />
    </div>
  );
}

class DisplayEmail extends React.Component {
  render() {
    const rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.email}
        checkin={entry.firstname} checkout={entry.lastname} />);
    });
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

function ViewUserLogs(props) {
  return (
    <div>
    <input type='button' className='admin-buttons' onClick={props.onClick}
      defaultValue='View User Logs' />
    </div>
  );
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
      <td>{props.checkin}</td>
      <td>{props.checkout}</td>
    </tr>
  );
}

class UserLogTable extends React.Component {
  render() {
    const rows = [];
    this.props.data.forEach((entry, i) => {
      rows.push(<UserLogEntries key={i} date={entry.checkdate}
        checkin={entry.checkintime} checkout={entry.checkouttime} />);
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

class OutputBox extends React.Component {
  render() {
    let user;
    let emails;
    let info;
    let table;

    if (this.props.data && this.props.flag === 0) {
      user = <DisplayAddedAdmin data={this.props.value} />;
    } else if (this.props.data && this.props.flag === 1) {
      emails = <DisplayEmail data={this.props.data} />;
    } else if (this.props.data && this.props.flag === 2) {
      info = <SelectedUserInfo user={this.props.data} />;
      table = <UserLogTable data={this.props.data} />;
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
    const value = e.target.value;
    this.setState({ sDate: value });
  }

  handleeDate(e) {
    const value = e.target.value;
    this.setState({ eDate: value });
  }

  render() {
    return (
      <div>
        <StartDate value={this.state.sDate} handleChange={this.handlesDate} />
        <EndDate value={this.state.eDate} handleChange={this.handleeDate} />
        <br></br>
        <DownloadUserLogsCSV onClick={() => {
          autils.downloadUserLogsCSV(this.state.sDate, this.state.eDate);
        }} />
        <br></br><br></br>
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
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(i) {
    if (i === 0) {
      const promise = autils.addAdmin();
      await promise.then((x) => { if (x) this.setState({ value: x }); });
      this.setState({ flag: 0 });
    } else if (i === 1) {
      const promise = autils.viewEmail();
      await promise.then((x) => { this.setState({ data: x }); });
      this.setState({ flag: 1 });
    } else if (i === 2) {
      const promise = autils.viewUserLogs();
      await promise.then((x) => { if (x) this.setState({ data: x }); });
      this.setState({ flag: 2 });
    }
  }

  render() {
    return (
      <div>
        <FormCSV />
        <UploadEmployeeCSV />
        <DownloadEmployeeCSV />
        <AddAdmin onClick={() => this.handleClick(0)} />
        <ViewEmail onClick={() => this.handleClick(1)} />
        <ViewUserLogs onClick={() => this.handleClick(2)} />
        <OutputBox data={this.state.data} flag={this.state.flag} value={this.state.value} />
      </div>
    );
  }
}

export default Admin;
