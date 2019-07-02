/* eslint-disable */
console.log((document.cookie));

run();
async function run() {
  if (getCookie('id')) {
    var cookiecheck = await fetch('http://localhost:8080/v1/checkCookies', {
      method: 'GET',
      credentials: 'include'
    })
    if (cookiecheck.status == 200) {
      var login = document.getElementById('login');
      var form = document.getElementById('form');
      if (login && form) {
        login.style.display = 'none';
        form.style.display = 'block';
        console.log('LOGIN COMPLETE')
      }
      
    }
  } else if (getCookie('inDatabase')) {
    var flag = getCookie('inDatabase');
    if (flag == 'false') {
      alert('User Not In Database');
    }
  }
  if (getCookie('isAdmin')) {
    if (getCookie('isAdmin') == 'true') {
      var admin = document.getElementById('admin');
      if (admin) {
        admin.style.display = 'block';
      }
    }
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    if (c.includes(name))
      return c.substring(name.length);
  }
  return "";
}

export async function getUserLogs() {
  if (getCookie('id')) {
    var cookiecheck = await fetch('http://localhost:8080/v1/checkCookies', {
      method: 'GET',
      credentials: 'include'
    })
    if (cookiecheck.status == 200) {
      const url = 'http://localhost:8080/v1/viewUserLogs?' + cookiecheck.statusText;
      var resp = await fetch(url, {
      });
      try {
        var table = await resp.json();
        if (table.length === 0) {
          alert(`No Logs for ${cookiecheck.statusText}`);
          return;
        }
        return table;
      } catch (err) {
        throw err;
      }
    }
  }
  return;
}

export async function googleLogin() {
  location = 'http://localhost:8080/v1/login';
}

export async function checkIn(userdatepass, usertimepass) {
  console.log("checking in");
  var userdate = userdatepass;
  var usertime = usertimepass;
  const date = getFDateTime();

  if (userdate > date[0] || usertime > date[1]) {
    alert('Cannot Enter Future Dates');
    let status = 409;
    let message = 'Cannot Enter Future Dates';
    return [status, message];
  }

  if (userdate && usertime) {
    var url = `http://localhost:8080/v1/checkIn?date=${userdate}&time=${usertime}`;
  } else {
    var url = 'http://localhost:8080/v1/checkIn';
  }
  

  console.log(url);

  var resp = await fetch(url, {
    method: 'GET',
  });
  var status = resp.status;
  var message = resp.statusText;

  console.log(status);
  console.log(message);

  //page tells user successful check in
  if (status == 200) {
    if (userdate && usertime) {
      message = `Checked In @ ${userdate} ${usertime}`;
      return [status, message];
    } else {
      const date = getFDateTime();
      const fDate = date[0];
      const fTime = date[1];
      message = `Checked In @ ${fDate} ${fTime}`;
      return [status, message];
    }
    
  } else {
    //alerts user check in failed
    alert(message);
    return [status, message];
  }
} 

export async function checkOut(userdatepass, usertimepass) {
  console.log("checking out");
  var userdate = userdatepass;
  var usertime = usertimepass;
  const date = getFDateTime();

  if (userdate > date[0] || usertime > date[1]) {
    alert('Cannot Enter Future Dates');
    let status = 409;
    let message = 'Cannot Enter Future Dates';
    return [status, message];
  }

  if (userdate && usertime) {
    var url = `http://localhost:8080/v1/checkOut?date=${userdate}&time=${usertime}`;
  } else {
    var url = 'http://localhost:8080/v1/checkOut';
  }

  console.log(url);

  var resp = await fetch(url, {
    method: 'GET',
  });
  var status = resp.status;
  var message = resp.statusText;

  console.log(status);
  console.log(message);

  //page tells user successful check out
  if (status == 200) {
    if (userdate && usertime) {
      message = `Checked Out @ ${userdate} ${usertime}`;
      return [status, message];
    } else {
      const date = getFDateTime();
      const fDate = date[0];
      const fTime = date[1];
      message = `Checked Out @ ${fDate} ${fTime}`;
      return [status, message];
    }
  } else {
    //alerts user check out failed
    alert(message);
    return [status, message];
  }
}

function getFDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  var month = start.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const day = start.getDate();
  var hours = start.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  var minutes = start.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const fDate = `${year}-${month}-${day}`;
  const fTime = `${hours}:${minutes}`;

  return [fDate, fTime];
}