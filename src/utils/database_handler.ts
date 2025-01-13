import * as sequelize from 'sequelize';

import { user_id } from '../server';
import { default_bet_data } from './constants';
import { BetData } from './types';

//replace with username and password
const sqlz = new sequelize.Sequelize('postgres://[username]:[password]@localhost:5432/postgres');

export const Bet = sqlz.define('bet', {
  "balance" : {type: sequelize.DataTypes.INTEGER},
  "bet_val": {type: sequelize.DataTypes.INTEGER},
  "user_roll": {type: sequelize.DataTypes.INTEGER},
  "dealer_roll": {type: sequelize.DataTypes.INTEGER},
  "num_wins": {type: sequelize.DataTypes.INTEGER},
  "win": {type: sequelize.DataTypes.BOOLEAN},
  "alert": {type: sequelize.DataTypes.STRING},
  "timestamp": {type: sequelize.DataTypes.DATE},
  "user_id": {type: sequelize.DataTypes.STRING}
});

export async function run_database() {
  sqlz.authenticate().then(() => {
    console.log("Successful connect to database");
  }).catch((err) => {
    console.error("Failed to connect to database; ", err);
  })

  //drops any existing information and conforms to Bet model
  Bet.sync({force:true});
}

export async function write_to_db(data: BetData) {
  console.log(data);
  try {
    await Bet.create(data);
  } catch (err) {
    console.log('Failed to write to database; ', err);
  }
}

export async function get_history_db() {
  try {
    const history = await Bet.findAll({
      where: {
        user_id: user_id
      }
    });
    return history;
  } catch (err) {
    console.error("Failed to retrieve history; ", err);
  }
}

//gets most recent bet logged to DB
export async function get_latest_bet_db() {
  try {
    const payload: any = await Bet.findAll({
      where: {
        user_id: user_id,
      },
      order: [["timestamp", "DESC"]],
      limit: 1,
      raw: true
    });
    return payload[0]; // query returns as a list of one item, this gets the object
  } catch (err) {
    console.error("Failed to retrieve value; ", err);
  }
}

//resets db by erasing all of user's previous history, writing default value in
export async function reset_game_db() {
  try {
    await Bet.destroy({where: {user_id: user_id}});
    write_to_db(default_bet_data);
  } catch (err) {
    console.error("Failed to reset database, deleting user history; ", err);
  }
}
