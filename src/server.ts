import express from 'express';
import * as path from 'path';
import * as ejs from 'ejs';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as sequelize from 'sequelize'

import * as gm from './utils/game_mechanics';
import * as fh from './utils/file_handler';
import { BetData } from './utils/types';
import { Bet, run_database } from './utils/database_handler';
import * as constants from './utils/constants';

export const user_id = "user" + Math.floor(Math.random() * 100);
const app : express.Express = express();

run_database();
let db_t: string = 'db';

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/', async (req, res) => {
  let latest_val = await fh.get_latest_bet(db_t);
  latest_val['balance'] = 200000;
  res.render('home', latest_val);
});

app.post('/submit-bet', async (req, res) => {
  const bet_data = await gm.place_bet(req.body.amount, req.body.user_dice, db_t);
  res.render('home', bet_data);
});

app.get('/withdraw', async (req, res) => {
  const has_won_before = await fh.has_won_before(db_t);
  if(has_won_before) {
    fh.reset_game(db_t);
    res.render('home', constants.default_bet_data)
  }
  else {
    let data = await fh.get_latest_bet(db_t);
    data['alert'] = "WITHDRAW_FAIL"
    res.render('home', data);
  }
});

app.get('/history', async (req, res) => {
  const hist = await fh.get_history(db_t);
  res.render('history', {'data': hist});
})
