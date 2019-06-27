/* eslint-disable */
import React from 'react';
import * as autils from './adminutils';

function Admin() {
  return (
    <AdminForm/>
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

function ClearOutput(props) {
  return (
    <input type='button' className='nbutton' onClick={props.onClick} defaultValue='Clear Output'/>
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
      autils.addEmail();
    } else if (i == 1) {
      autils.viewEmail();
    } else if (i == 2) {
      autils.userlogs();
    } else if (i ==3) {
      autils.writeCSV();
    } else {
      autils.clearOutput();
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
        <WriteCSV onClick={() => this.handleClick(3)}/><br></br>
        <ClearOutput onClick={() => this.handleClick(4)}/>
        <h3 id='output'></h3>
      </div>
    );
  }

}

export default Admin;