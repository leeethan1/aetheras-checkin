/* eslint-disable */
// fetch('http://localhost:8080/v1/sample').then((resp) => {
//     console.log(resp);
//     resp.json().then((data) => {
//         console.log(data);
//         document.getElementById("status").innerHTML = data.resp;
//     });
// });
// async function main() {
//   const resp = await fetch('http://localhost:8080/v1/tests');
//   console.log(resp);
//   console.log(resp.headers.get('hello'));
//   // var data = await resp.json();
//   // document.getElementById("status").innerHTML = data.resp;
// }
// main();
console.log('hello')
function myfunction() {
  const emailtest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  var data = document.getElementById('form');
  var email = data[0].value;
  var check;
  if (data[1].checked) {
    check = data[1].value;
  } else if (data[2].checked) {
    check = data[2].value;
  }

  console.log(check);

  if (emailtest.test(email) && check) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    transfer(check);

    document.getElementById('text').innerHTML = `${email} ${check} @ ${year}/${month}/${day} ${hours}:${minutes}`;
  } else {
    alert('Not Valid');
  }
  document.getElementById('form').reset();

}
async function transfer(stamp) {
  if (stamp == "checkin") {
    console.log("checking in");
    const data = document.getElementById('form');
    const id = data[0].value;
    const url = 'http://localhost:8080/v1/checkin?' + id;
    console.log(url);
    const resp = await fetch(url, {
    });
    console.log(id);
  }
  else if (stamp == "checkout") {
    console.log("checking out");
    const data = document.getElementById('form');
    const id = data[0].value;
    const url = 'http://localhost:8080/v1/checkout?' + id;
    console.log(url);
    const resp = await fetch(url, {
    });
    console.log(id);
  }
};
// main();
