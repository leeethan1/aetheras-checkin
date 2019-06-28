/* eslint-disable */
console.log((document.cookie));

main();
async function main() {
  if (getCookie('id')) {
    var cookiecheck = await fetch('http://localhost:8080/v1/checkcookie', {
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

export async function googlelogin() {
  location = 'http://localhost:8080/v1/login';
}

export async function checkin(userdate, usertime) {
  console.log("checking in");

  if (userdate && usertime) {
    var url = `http://localhost:8080/v1/checkin?date=${userdate}&time=${usertime}`;
  } else {
    var url = 'http://localhost:8080/v1/checkin';
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

export async function checkout(userdate, usertime) {
  console.log("checking out");

  if (userdate && usertime) {
    var url = `http://localhost:8080/v1/checkout?date=${userdate}&time=${usertime}`;
  } else {
    var url = 'http://localhost:8080/v1/checkout';
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
  const month = start.getMonth() + 1;
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