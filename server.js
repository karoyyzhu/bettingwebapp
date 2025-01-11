const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs')

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
  var bet_obj = {
    bet_amount: req.body.amount,
    dice_number: req.body.dicenum
  };

  var json = JSON.stringify(bet_obj);
  fs.writeFile('bet_data.json', json, 'utf-8',
    (err) => {
      if (err) console.log(err);
      else {
        console.log("Successful file write\n");
        console.log("Contents of file:");
        console.log(fs.readFileSync("bet_data.json", "utf8"));
      }
    });
})
