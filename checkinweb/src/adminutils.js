/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-alert */
/* eslint-disable node/no-unsupported-features/es-syntax */

export async function addAdmin() {
  const info = prompt('email, firstname, lastname');
  if (!info) {
    return;
  }
  const infoArray = info.split(', ');
  const emailAddress = infoArray[0];
  const firstName = infoArray[1];
  const lastName = infoArray[2];
  const url = 'http://localhost:8080/v1/addAdmin';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailAddress, firstname: firstName, lastname: lastName }),
  });

  return response.statusText;
}

export async function viewEmail() {
  const url = 'http://localhost:8080/v1/viewEmployees';
  const response = await fetch(url, {
  });
  const table = await response.json();
  return table;
}

export async function viewUserLogs() {
  let info = prompt('Enter name or email');
  if (info) {
    info = info.replace(' ', '-');
    const url = `http://localhost:8080/v1/viewUserLogs?${info}`;
    const response = await fetch(url, {
    });
    try {
      const table = await response.json();
      if (table.length === 0) {
        alert(`No Logs for ${info.replace('-', ' ')}`);
        return;
      }
      return table;
    } catch (err) {
      throw err;
    }
  }
}

export async function downloadUserLogsCSV() {
  let info = prompt('Enter name or email (leave blank for all employees)');
  if (info) {
    info = info.replace(' ', '-');
  }
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  if (start !== '' && end !== '') {
    window.open(`http://localhost:8080/v1/downloadUserLogsCSV?start=${start}&end=${end}&info=${info}`);
  } else {
    alert('Please Input Date Range');
  }
}

export async function uploadEmployeeCSV() {
  const formData = new FormData();
  const input = document.getElementById('upload');

  if (input.files[0]) {
    formData.append('names', input.files[0]);
    await fetch('http://localhost:8080/v1/uploadEmployeeCSV', {
      method: 'PUT',
      body: formData,
    });
    document.getElementById('upload').value = '';
  }
}

export async function downloadEmployeeCSV() {
  window.open('http://localhost:8080/v1/downloadEmployeeCSV');
}
