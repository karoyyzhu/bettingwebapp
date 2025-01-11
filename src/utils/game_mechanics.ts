import { dice_max, multiplier } from './constants';
import { process_bet, has_won_before, reset_game, get_latest_bet } from './file_handler';
import { BetData } from './types';

export function place_bet(bet_val: number, user_roll: number) : BetData {
  const balance = get_latest_bet()['balance'];
  let dealer_roll : number = roll_dice(dice_max)
  let bet_hold : number = -1 * bet_val;
  let p_reroll = 0;

  if (dealer_roll == user_roll) {
    if(balance >= 5000) p_reroll = 0.3;
    else if(balance >= 10000) p_reroll = 0.5;
  }

  const will_reroll: boolean = Math.random() <= p_reroll;
  dealer_roll = will_reroll ? roll_dice(dice_max) : dealer_roll;


  if (user_roll == dealer_roll) {
    bet_hold += bet_val * multiplier;
  }

  return process_bet(bet_hold, bet_val, user_roll, dealer_roll);
}

export function withdraw() : boolean {
  const can_withdraw : boolean = has_won_before()
  if(can_withdraw) reset_game();

  return can_withdraw;
}

function roll_dice(dice_max: number) : number {
  return Math.ceil(Math.random() * dice_max);
}
