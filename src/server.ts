import express from 'express';
import * as path from 'path';
import * as ejs from 'ejs';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';

import * as gm from './utils/game_mechanics';
import * as fh from './utils/file_handling';

const app : express.Express = express();

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

app.post('/withdraw', (req, res) => {
  if(fh.has_won()) fh.reset_game();
  else {
  }
})
