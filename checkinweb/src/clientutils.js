/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-alert */
/* eslint-disable node/no-unsupported-features/es-syntax */

checkCookies();

async function checkCookies() {
  if (getCookie('id')) {
    const cookieCheck = await fetch('http://localhost:8080/v1/checkCookies', {
      method: 'GET',
      credentials: 'include',
    });
    if (cookieCheck.status === 200) {
      const login = document.getElementById('login');
      const form = document.getElementById('form');
      if (login && form) {
        login.style.display = 'none';
        form.style.display = 'block';
      }
    }
  } else if (getCookie('inDatabase')) {
    const flag = getCookie('inDatabase');
    if (flag === 'false') {
      alert('User Not In Database');
    }
  }
  if (getCookie('isAdmin')) {
    if (getCookie('isAdmin') === 'true') {
      const admin = document.getElementById('admin');
      if (admin) {
        admin.style.display = 'block';
      }
    }
  }
}

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookie = decodedCookie.split(';');
  for (let i = 0; i < cookie.length; i++) {
    const c = cookie[i];
    if (c.includes(name)) {
      return c.substring(name.length);
    }
  }
  return '';
}

export async function getUserLogs() {
  if (getCookie('id')) {
    const cookieCheck = await fetch('http://localhost:8080/v1/checkCookies', {
      method: 'GET',
      credentials: 'include',
    });
    if (cookieCheck.status === 200) {
      const url = `http://localhost:8080/v1/viewUserLogs?${cookieCheck.statusText}`;
      const resp = await fetch(url, {
      });
      try {
        const table = await resp.json();
        if (table.length === 0) {
          alert(`No Logs for ${cookieCheck.statusText}`);
          return;
        }
        return table;
      } catch (err) {
        throw err;
      }
    }
  }
}

export async function googleLogin() {
  window.location = 'http://localhost:8080/v1/login';
}

export async function checkIn(userDateParam, userTimeParam) {
  const userDate = userDateParam;
  const userTime = userTimeParam;
  const date = getFormattedDateTime();
  const userDateTime = new Date(`${userDateParam} ${userTimeParam}`);
  const dateTime = new Date(`${date[0]} ${date[1]}`);
  let url;
  let status;
  let message;

  if (userDateTime > dateTime) {
    alert('Cannot Enter Future Dates');
    status = 409;
    message = 'Cannot Enter Future Dates';
    return [status, message];
  }

  if (userDate && userTime) {
    url = `http://localhost:8080/v1/checkIn?date=${userDate}&time=${userTime}`;
  } else {
    url = 'http://localhost:8080/v1/checkIn';
  }

  const resp = await fetch(url, {
    method: 'GET',
  });

  status = resp.status;
  message = resp.statusText;

  // page tells user successful check in
  if (status === 200) {
    if (userDate && userTime) {
      message = `Checked In @ ${userDate} ${userTime}`;
      return [status, message];
    }
    const formattedDate = date[0];
    const formattedTime = date[1];
    message = `Checked In @ ${formattedDate} ${formattedTime}`;
    return [status, message];
  }
  // alerts user if check in failed
  alert(message);
  return [status, message];
}

export async function checkOut(userDateParam, userTimeParam) {
  const userDate = userDateParam;
  const userTime = userTimeParam;
  const date = getFormattedDateTime();
  const userDateTime = new Date(`${userDateParam} ${userTimeParam}`);
  const dateTime = new Date(`${date[0]} ${date[1]}`);
  let url;
  let status;
  let message;

  if (userDateTime > dateTime) {
    alert('Cannot Enter Future Dates');
    status = 409;
    message = 'Cannot Enter Future Dates';
    return [status, message];
  }

  if (userDate && userTime) {
    url = `http://localhost:8080/v1/checkOut?date=${userDate}&time=${userTime}`;
  } else {
    url = 'http://localhost:8080/v1/checkOut';
  }

  const resp = await fetch(url, {
    method: 'GET',
  });

  status = resp.status;
  message = resp.statusText;

  // page tells user successful check out
  if (status === 200) {
    if (userDate && userTime) {
      message = `Checked Out @ ${userDate} ${userTime}`;
      return [status, message];
    }
    const formattedDate = date[0];
    const formattedTime = date[1];
    message = `Checked Out @ ${formattedDate} ${formattedTime}`;
    return [status, message];
  }
  // alerts user if check out failed
  alert(message);
  return [status, message];
}

function getFormattedDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  let month = start.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const day = start.getDate();
  let hours = start.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = start.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}`;

  return [formattedDate, formattedTime];
}
