console.log('Client-side code running');

const test = document.getElementById('test');
test.addEventListener('click', (e) => {
  test.innerHTML = "GOTCHA";
});

const button = document.getElementById('withdraw');
button.addEventListener('click', (e) => {
  var can_withdraw = false;
  if(!can_withdraw) {
    var msg = document.createElement('p');
    msg.innerHTML = "You cannot withdraw--you have not won yet."
    document.body.insertBefore(msg, document.getElementById('balance'));
  }
});
