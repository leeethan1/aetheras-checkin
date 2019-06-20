/* eslint-disable */

function myfunction() {
  var emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  var data = document.getElementById('form');
  var email = data[0].value;
  var check;

  // verifies input is valid email format
  if (!emailtest.test(email)) {
    alert('Not Valid');
  } else if (data[1].value == 'Check In') {
    checkin();
  } else if (data[2].value == 'Check Out') {
    checkout();

  }

  console.log(check);

  document.getElementById('form').reset();

}

async function checkin() {
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
}
async function checkout() {
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

function getFDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const minutes = start.getMinutes();
  const fDate = `${year}-${month}-${day}`;
  const fTime = `${hours}:${minutes}`;

  return [fDate, fTime];
}