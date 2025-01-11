const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const gm = require('./utils/gambling_mechanics');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', function(req, res){
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.post('/submit-bet', (req, res) => {
  var bet_amount = req.body.amount;
  var user_dice = req.body.dicenum;

  var bet_result = gm.process_bet(bet_amount, user_dice);
});
