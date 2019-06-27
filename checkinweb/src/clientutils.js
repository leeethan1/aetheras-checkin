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
  // var resp = await fetch('http://localhost:8080/v1/login', {
  //   method: 'GET',
  //   mode: 'no-cors',
  // })
  location = 'http://localhost:8080/v1/login';
  // var x = await resp.json();

  // var googleurl = x.url;
  // window.open(googleurl);
}

export function myfunction() {
  var data = document.getElementById('form');
  var check;

  if (data[2].checked) {
    check = data[2].value;
    console.log(check)

  } else if (data[3].checked) {
    check = data[3].value;
    console.log(check)

  } else {
    alert('Please checkin or checkout');
    return;
  }

  // console.log(check);
  transfer(check)

  document.getElementById('form').reset();

}

// async function transfer(stamp) {

//   var data = document.getElementById('form');
//   const userdate = data[0].value;
//   const usertime = data[1].value;
//   console.log(data[0].value)
//   console.log(data[1].value)

//   if (stamp == "checkin") {

export async function checkin(userdate, usertime) {
    // var data = document.getElementById('form');
    // const userdate = data[0].value;
    // const usertime = data[1].value;
    // console.log(data[0].value)
    // console.log(data[1].value)
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
        document.getElementById('text').innerHTML =
        `Checked In @ ${userdate} ${usertime}`;
      } else {
        const date = getFDateTime();
        const fDate = date[0];
        const fTime = date[1];

        document.getElementById('text').innerHTML =
          `Checked In @ ${fDate} ${fTime}`;
      }
      
    } else {
      //alerts user check in failed
      document.getElementById('text').innerHTML = message;
      alert(message);

    }
  } 
  // else if (stamp == "checkout") {

export async function checkout(userdate, usertime) {
    // var data = document.getElementById('form');
    // const userdate = data[0].value;
    // const usertime = data[1].value;
    // console.log(data[0].value)
    // console.log(data[1].value)
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
        document.getElementById('text').innerHTML =
        `Checked Out @ ${userdate} ${usertime}`;
      } else {
        const date = getFDateTime();
        const fDate = date[0];
        const fTime = date[1];

        document.getElementById('text').innerHTML =
          `Checked Out @ ${fDate} ${fTime}`;
      }
    } else {
      //alerts user check out failed
      document.getElementById('text').innerHTML = message;
      alert(message);

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