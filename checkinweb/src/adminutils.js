/* eslint-disable */
//const ADMINPASS = 'admin123';

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

  var h = document.createElement("h4");
  var node = document.createTextNode(msg);
  h.appendChild(node);

  var div = document.getElementById("text");
  div.appendChild(h);

  console.log(status);
}

export async function viewEmail() {
  const url = 'http://localhost:8080/v1/employees';
  var resp = await fetch(url, {
  });
  console.log(resp.statusText);
  var h = document.createElement("h4");
  var node = document.createTextNode(resp.statusText);
  h.appendChild(node);

  var element = document.getElementById("text");
  element.appendChild(h);
}

export async function userlogs() {
  var info = prompt('Enter name or email');
  if (info) {
    info = info.replace(' ', '-')
    const url = 'http://localhost:8080/v1/userlogs?' + info;
    var resp = await fetch(url, {
    });
    var x = await resp.json();
    if (x.length === 0) {
      alert('No such Email');
      return;
    }
    console.log(x)

    // CHANGE DISPLAY METHOD
    var element = document.getElementById("text");
    var tbl = document.createElement('table');
    element.appendChild(tbl);
    var tr1 = document.createElement("TR");
    tbl.appendChild(tr1)
    var th = document.createElement("TH");
    th.innerHTML = "Email: " + x[0].email;
    th.classList.toggle('header');
    tbl.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "First name: " + x[0].firstname;
    th.classList.toggle('header');
    tbl.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Last name: " + x[0].lastname;
    th.classList.toggle('header');
    tbl.appendChild(th);
    var tr2 = document.createElement("TR");
    tbl.appendChild(tr2);
    th = document.createElement("TH");
    th.innerHTML = "Date";
    tbl.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Check In Time";
    tbl.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Check Out Time";
    tbl.appendChild(th);
    for (var xs in x) {
      var tr = document.createElement("TR");
      tbl.appendChild(tr);
      var td = document.createElement("TD");
      td.innerHTML = x[xs].checkdate;
      tbl.appendChild(td);
      td = document.createElement("TD");
      td.innerHTML = x[xs].checkintime;
      tbl.appendChild(td);
      td = document.createElement("TD");
      td.innerHTML = x[xs].checkouttime;
      tbl.appendChild(td);
    }
  } else {
    console.log('no input');
    return;
  }
}

export async function writeCSV() {
  const start = document.getElementById('startdate').value;
  const end = document.getElementById('enddate').value;
  if (start != '' && end != '') {
    window.open(`http://localhost:8080/v1/writeCSV?start=${start}&end=${end}`);
  }
}

export async function refresh() {
  location.reload();
}