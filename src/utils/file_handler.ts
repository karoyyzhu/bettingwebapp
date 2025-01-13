import * as fs from 'fs';
import * as mongo from 'mongodb';

import { default_bet_data, initial_balance, session_data_filename } from './constants';
import { BetData } from './types';
import { user_id } from '../server';
import { write_to_db, get_latest_bet_db, get_history_db, reset_game_db } from './database_handler';

//balance_delta represents value to add to balance
export async function process_bet(balance_delta: number, bet_val: number, user_roll: number, dealer_roll: number, db?: string) {
  let latest_bet = await get_latest_bet(db);
  const new_balance : number = latest_bet['balance'] + balance_delta;
  let num_wins : number = latest_bet['num_wins'];

  if(new_balance <= 0) {
    console.log('You went broke ): Resetting...')
    console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');

    reset_game(db);
    return default_bet_data;
  } else { // creates bet object to save to DB
    //if change in balance is positive, user won. negative, user lost.
    const win_val : boolean = balance_delta > 0;
    num_wins = win_val ? num_wins + 1 : num_wins;
    const alert = win_val ? "WIN" : "LOSE";
    const new_bet_data : BetData = {
      "balance" : new_balance,
      "bet_val": bet_val,
      "user_roll": user_roll,
      "dealer_roll": dealer_roll,
      "num_wins": num_wins,
      "win": win_val,
      "alert": alert,
      "timestamp": new Date(),
      "user_id": user_id
    }

    log_to_history(new_bet_data, db); // write to database
    return new_bet_data;
  }
}

//add new bet to history, each new bet added to the beginning of the json file
function log_to_history(new_bet: BetData, db?: string) {
  if(db == 'db') {
    write_to_db(new_bet);
  } else {
    const bet_list: BetData[] = [new_bet];
    let in_list = JSON.parse(fs.readFileSync(session_data_filename, 'utf-8'));
    in_list.unshift(new_bet); //adds new history to beginning of file to make access of most recent bet easier
    fs.writeFileSync(session_data_filename, JSON.stringify(in_list));
  }
}

export async function get_latest_bet(db?: string) {
  if(db == 'db') {
    const latest_bet = await get_latest_bet_db();
    if(latest_bet == null || latest_bet.length == 0) {
      return default_bet_data;
    }
    return latest_bet;
  } else {
    const history = await get_history(db);
    return history.length > 0 ? history[0] : default_bet_data;
  }
}

export async function get_history(db?:string) {
  if(db == 'db') {
    const history = await get_history_db();
    return history;
  } else {
    if(!fs.existsSync(session_data_filename)) {
      reset_game();
      return [];
    } else {
      return JSON.parse(fs.readFileSync(session_data_filename, 'utf-8'));
    }
  }
}

//boolean to check if user has won before
export async function has_won_before(db?: string) {
  if(db == 'db') {
    const check_wins = await get_latest_bet_db();
    return check_wins['num_wins'] > 0;
  } else {
    if(fs.existsSync(session_data_filename)) {
      const num_wins = await get_latest_bet(db)
      return num_wins > 0;
    }
  }
  return false;
}

//reset changes all values back to defaults, and clears history.
export function reset_game(db?: string) : void {
  if(db == 'db') {
    reset_game_db();
  } else {
    fs.writeFileSync(session_data_filename, "[]");
    log_to_history(default_bet_data);
  }
}
