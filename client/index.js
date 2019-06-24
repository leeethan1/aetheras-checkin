/* eslint-disable */

console.log(document.cookie);
main();
async function main() {
  if (document.cookie) {
    let cookiecheck = await fetch('http://localhost:8080/v1/checkcookie', {
      method: 'GET',
      credentials: 'include'
    })
    if (cookiecheck.status == 200) {
      var login = document.getElementById('login');
      var form = document.getElementById('form');
      login.style.display = 'none';
      form.style.display = 'block';
      console.log('LOGIN COMPLETE')
    }
  } else {
    console.log('no cookies')
  }
}
async function googlelogin() {
  var resp = await fetch('http://localhost:8080/v1/login', {
    method: 'GET',
    mode: 'cors',
  })
  var x = await resp.json();

  var googleurl = x.url;
  window.location.replace(googleurl);

  console.log(googleurl);
}

function myfunction() {
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

async function transfer(stamp) {

  var data = document.getElementById('form');
  const userdate = data[0].value;
  const usertime = data[1].value;
  console.log(data[0].value)
  console.log(data[1].value)

  if (stamp == "checkin") {
    console.log("checking in");

    if (userdate && usertime) {
      var url = `http://localhost:8080/v1/checkin?date=${data[0].value}&time=${data[1].value}`;
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
      const date = getFDateTime();
      const fDate = date[0];
      const fTime = date[1];

      document.getElementById('text').innerHTML =
        `${stamp} @ ${fDate} ${fTime}`;
    } else {
      //alerts user check in failed
      document.getElementById('text').innerHTML = message;
      alert(message);

    }
  } else if (stamp == "checkout") {

    console.log("checking out");

    if (userdate && usertime) {
      var url = `http://localhost:8080/v1/checkout?date=${data[0].value}&time=${data[1].value}`;
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
      const date = getFDateTime();
      const fDate = date[0];
      const fTime = date[1];

      document.getElementById('text').innerHTML =
        `${stamp} @ ${fDate} ${fTime}`;
    } else {
      //alerts user check out failed
      document.getElementById('text').innerHTML = message;
      alert(message);

    }

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