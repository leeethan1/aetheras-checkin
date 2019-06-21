/* eslint-disable */

function myfunction() {
  var emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  var data = document.getElementById('form');
  var email = data[0].value;
  var check;

  if (data[1].checked) {
    check = data[1].value;

  } else if (data[2].checked) {
    check = data[2].value;

  }

  console.log(check);
  transfer(check,email)
  //verifies that proper email is entered and button has been checked

  // emailtest.test(email) && check ? transfer(check, email) : alert('Not Valid');
  document.getElementById('form').reset();

}

async function login() {
  var resp = await fetch('http://localhost:8080/v1/login', {
    method: 'GET',
    mode: 'cors',
  })
  var x = await resp.json();
  
  var googleurl = x.url;
  window.location.replace(googleurl);

  console.log(googleurl);
}

async function transfer(stamp, email) {

  if (stamp == "checkin") {
    console.log("checking in");

    var data = document.getElementById('form');
    var emailaddr = data[0].value;
    var url = 'http://localhost:8080/v1/checkin';

    console.log(url);

    var resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailaddr }),
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
        `${email} ${stamp} @ ${fDate} ${fTime}`;
    } else {
      //alerts user check in failed
      document.getElementById('text').innerHTML = message;
      alert(message);

    }
  } else if (stamp == "checkout") {

    console.log("checking out");

    var data = document.getElementById('form');
    var emailaddr = data[0].value;
    var url = 'http://localhost:8080/v1/checkout';

    console.log(url);

    var resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: emailaddr }),
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
        `${email} ${stamp} @ ${fDate} ${fTime}`;
    } else {
      //alerts user check out failed
      document.getElementById('text').innerHTML = message;
      alert(message);

    }

  }
};

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