import { BetData } from './types';

export const dice_max : number = 6;
export const multiplier : number = 5;
export const initial_balance : number = 1000;

export const session_data_filename : string = "session_data.json";

export const default_bet_data : BetData =
  {
    'balance': initial_balance,
    'bet_val': -1,
    'user_roll':-1,
    'dealer_roll':-1,
    'num_wins': 0,
    'win': false,
    'alert': "DEFAULT",
    'timestamp': new Date("1995-12-17T03:24:00"), // arbitrary date in the past
    'user_id': "default"
  }
