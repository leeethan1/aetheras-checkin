/* eslint-disable */
import React from 'react';
import * as adminutils from './adminutils';



function Admin() {
  return (
    <AdminForm/>
    // <button className='nbutton' type="button" onClick={() => adminutils.addEmail()}>Add Email</button><br></br>
    // <button className='nbutton' type="button" onClick={() => adminutils.viewEmail()}>View Email registry</button><br></br>
    // <button className='nbutton' type="button" onClick={() => adminutils.userlogs()}>Check user logs</button><br></br>
    // <br></br><label>Enter Range:</label><br></br>
    // <span>from: </span>
    // <input className='datetime' type='date' name='startdate' id='startdate'/>
    // <span> to: </span>
    // <input className='datetime' type='date' name='enddate' id='enddate'/><br></br>
    // <button className='nbutton' type="button" onClick={() => adminutils.writeCSV()}>Get CSV</button><br></br>
  );
}

function StartDate(props) {
  return (
    <input className='datetime' type='date' id='startdate' value={props.value} onChange={ props.handleChange }/>
  );
}
function EndDate(props) {
  return (
    <input className='datetime' type='date' id='enddate' value={props.value} onChange={ props.handleChange }/>
  );
}
function AddEmail(props) {
  return (
    <input type='button' className='nbutton' onClick={props.onClick} defaultValue='Add Email'/>
  )
}
function ViewEmail(props) {
  return (
    <input type='button' className='nbutton' onClick={props.onClick} defaultValue='View Email Registry'/>
  )
}
function UserLogs(props) {
  return (
    <input type='button' className='nbutton' onClick={props.onClick} defaultValue='Check User Logs'/>
  )
}
function WriteCSV(props) {
  return (
    <input type='button' className='nbutton' onClick={props.onClick} defaultValue='Download CSV'/>
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
  handleClick(i) {
    if (i == 0) {
      adminutils.addEmail();
    } else if (i == 1) {
      adminutils.viewEmail();
    } else if (i == 2) {
      adminutils.userlogs();
    } else {
      adminutils.writeCSV();
    }
  }

  render() {
    return (
      <div>
        <AddEmail onClick={() => this.handleClick(0)}/><br></br>
        <ViewEmail onClick={() => this.handleClick(1)}/><br></br>
        <UserLogs onClick={() => this.handleClick(2)}/><br></br><br></br>
        <StartDate value={this.state.sDate} handleChange={this.handlesDate}/>
        <EndDate value={this.state.eDate} handleChange={this.handleeDate}/><br></br>
        <WriteCSV onClick={() => this.handleClick(3)}/>
      </div>
    );
  }

}

export default Admin;