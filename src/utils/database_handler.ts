import * as sequelize from 'sequelize';
import { user_id } from '../server';
import { default_bet_data } from './constants';
import { BetData } from './types';

const sqlz = new sequelize.Sequelize('postgres://[username]:[password]@localhost:5342/bets');

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
  let history: any = [];
  try {
    history = await Bet.findAll({
      where: {
        id: user_id
      }
    });
  } catch (err) {
    console.error("Failed to retrieve database; ", err);
  }
  return history;
}

export async function get_latest_bet_db() {
  const latest_bet = await sqlz.query(
    `SELECT * FROM bet
    WHERE user_id=${user_id}
    ORDER BY timestamp DESC
    LIMIT 1;
    `,
    {
      mapToModel: true,
      model: Bet
    });
  //get first item from results list (first argument of value returned from query)
  return latest_bet;
}

export async function reset_game_db() {
  await Bet.destroy({where: {user_id: user_id}});
  write_to_db(default_bet_data);
}
