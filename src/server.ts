import express from 'express';
import * as path from 'path';
import * as ejs from 'ejs';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';

import * as gm from './utils/game_mechanics';
import * as fh from './utils/file_handler';
import * as types_c from './utils/types';
import * as constants from './utils/constants';

const app : express.Express = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/', function(req, res){
  res.render('home', fh.get_latest_bet());
});

app.post('/submit-bet', (req, res) => {
  const bet_amount : number = req.body.amount;
  const user_dice : number = req.body.user_dice;

  const bet_data : types_c.BetData = gm.place_bet(bet_amount, user_dice);

  res.render('home', bet_data);
});

app.get('/withdraw', (req, res) => {
  if(fh.has_won_before()) {
    fh.reset_game();
    res.render('home', constants.default_bet_data)
  }
  else {
    let data = fh.get_latest_bet();
    data['alert'] = "WITHDRAW_FAIL"
    res.render('home', data);
  }
});

app.get('/history', (req, res) => {
  res.render('history', {'data': fh.get_history()});
})
