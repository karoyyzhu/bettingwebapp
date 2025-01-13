import * as sequelize from 'sequelize';
import { user_id } from '../server';
import { default_bet_data } from './constants';
import { BetData } from './types';

const sqlz = new sequelize.Sequelize('postgres://karozhu:@localhost:5432/postgres');

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
    console.log("Successful connect to sql");
  }).catch((err) => {
    if(err) console.error(err, "Failed to connect");
  })

  Bet.sync({force:true});
}

export async function write_to_db(data: BetData) {
  await Bet.create(data);
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
    console.error("Failed to retrieve database; ", err);
  }
}

export async function get_latest_bet_db() {
  try {
    const history = await Bet.findAll({
      where: {
        user_id: user_id,
      },
      order: [["timestamp", "DESC"]],
      limit: 1
    });
    return history
  } catch (err) {
    console.error("Failed to retrieve database; ", err);
  }
}

export async function reset_game_db() {
  await Bet.destroy({where: {user_id: user_id}});
  write_to_db(default_bet_data);
}
