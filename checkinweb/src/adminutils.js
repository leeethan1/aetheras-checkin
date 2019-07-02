/* eslint-disable */

export async function addAdmin() {
  var info = prompt('email, firstname, lastname');
  if (!info) {
    return;
  }
  var infoarr = info.split(', ');

  var emailaddr = infoarr[0];
  var fname = infoarr[1];
  var lname = infoarr[2];

  const url = 'http://localhost:8080/v1/addAdmin';
  var resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: emailaddr, firstname: fname, lastname: lname }),
  });
  var message = resp.statusText;

  return message;
}

export function uploadEmployeeCSV() {
  var formData = new FormData();
  var input = document.getElementById('upload');
  console.log(input.files[0]);
  if (input.files[0]) {
    formData.append('names', input.files[0]);
    var resp = fetch('http://localhost:8080/v1/uploadEmployeeCSV', {
      method: 'PUT',
      body: formData,
    })
  } else {
    alert('No File Selected');
    return;
  }
  
}

export async function viewEmail() {
  const url = 'http://localhost:8080/v1/viewEmployees';
  var resp = await fetch(url, {
  });
  var table = await resp.json();
  return table;
}

export async function viewUserLogs() {
  var info = prompt('Enter name or email');
  if (info) {
    info = info.replace(' ', '-');
    const url = 'http://localhost:8080/v1/viewUserLogs?' + info;
    var resp = await fetch(url, {
    });
    try {
      var table = await resp.json();
      if (table.length === 0) {
        alert(`No Logs for ${info.replace('-', ' ')}`);
        return;
      }
      return table;
    } catch (err) {
      throw err;
    }
  } else {
    console.log('no input');
    return;
  }
}

export async function downloadUserLogsCSV() {
  var info = prompt('Enter name or email (leave blank for all employees)')
  if (info) {
    info = info.replace(' ', '-');
  }
  const start = document.getElementById('startdate').value;
  const end = document.getElementById('enddate').value;
  if (start != '' && end != '') {
    window.open(`http://localhost:8080/v1/downloadUserLogsCSV?start=${start}&end=${end}&info=${info}`);
  } else {
    alert('Please Input Date Range');
  }
}

export async function downloadEmployeeCSV() {
  window.open('http://localhost:8080/v1/downloadEmployeeCSV');
}