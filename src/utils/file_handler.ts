import { default_bet_data, initial_balance, session_data_filename } from './constants';
import * as fs from 'fs';
import { BetData } from './types';

//balance_delta represents value to add to balance
export function process_bet(balance_delta: number, bet_val: number, user_roll: number, dealer_roll: number) : BetData {
  const latest_bet = get_latest_bet();
  const new_balance : number = latest_bet['balance'] + balance_delta;
  let num_wins : number = latest_bet['num_wins'];

  if(new_balance <= 0) {
    console.log('You went broke ): Resetting...')
    console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');

    reset_game();
    return default_bet_data;
  } else {
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
      "alert": alert
    }

    log_to_history(new_bet_data);
    return new_bet_data;
  }
}

function log_to_history(new_bet: BetData): void {
  const bet_list: BetData[] = [new_bet];
  let in_list = JSON.parse(fs.readFileSync(session_data_filename, 'utf-8'));
  in_list.unshift(new_bet);
  fs.writeFileSync(session_data_filename, JSON.stringify(in_list));
}

export function get_latest_bet(): BetData {
  const history = get_history();
  return history.length > 0 ? history[0] : default_bet_data;
}

export function get_history(): BetData[] {
  if(!fs.existsSync(session_data_filename)) {
    reset_game();
    return [];
  } else {
    return JSON.parse(fs.readFileSync(session_data_filename, 'utf-8'));
  }
}

export function has_won_before() : boolean {
  if(!fs.existsSync(session_data_filename)) {
    return false;
  }
  return get_latest_bet()['num_wins'] > 0;
}

export function reset_game() : void {
  const empty_list: string = "[]";
  fs.writeFileSync(session_data_filename, empty_list);
  log_to_history(default_bet_data);
}