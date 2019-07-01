/* eslint-disable */

export async function addEmail() {
  var info = prompt('email, firstname, lastname');
  if (!info) {
    return;
  }
  var infoarr = info.split(', ');

  var emailaddr = infoarr[0];
  var fname = infoarr[1];
  var lname = infoarr[2];

  const url = 'http://localhost:8080/v1/emailreg';
  var resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: emailaddr, firstname: fname, lastname: lname }),
  });
  var status = resp.status;
  var msg;
  if (status == 200) {
    msg = '-Added email ' + emailaddr;
  } else {
    msg = '-Email did not add';
  }
  return msg;
}

export function uploadCSV() {
  var formData = new FormData();
  var input = document.getElementById('upload');
  console.log(input.files[0]);
  formData.append('names', input.files[0]);
  var resp = fetch('http://localhost:8080/v1/employeeUpload', {
    method: 'PUT',
    body: formData,
  })
}

export async function viewEmail() {
  const url = 'http://localhost:8080/v1/employees';
  var resp = await fetch(url, {
  });
  var table = await resp.json();
  return table;
}

export async function userlogs() {
  var info = prompt('Enter name or email');
  if (info) {
    info = info.replace(' ', '-');
    const url = 'http://localhost:8080/v1/userlogs?' + info;
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

export async function writeCSV() {
  var info = prompt('Enter name or email (leave blank for all employees)')
  if (info) {
    info = info.replace(' ', '-');
  }
  const start = document.getElementById('startdate').value;
  const end = document.getElementById('enddate').value;
  if (start != '' && end != '') {
    window.open(`http://localhost:8080/v1/writeCSV?start=${start}&end=${end}&info=${info}`);
  } else {
    alert('Please Input Date Range');
  }
}

export async function writeEmployeeCSV() {
  window.open('http://localhost:8080/v1/writeEmployeeCSV');
}