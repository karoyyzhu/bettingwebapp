import { dice_max, multiplier } from './constants';
import { process_bet, has_won_before, reset_game, get_latest_bet } from './file_handler';
import { BetData } from './types';

export async function place_bet(bet_val: number, user_roll: number, db?: string) {
  const get_balance_response = await get_latest_bet(db);
  const balance = get_balance_response['balance'];

  let dealer_roll : number = roll_dice(dice_max);

  //bets can be represented as the user paying their initial bet, which remains
  //lost if they lose the gamble, or is won back along with [multiplier] times
  //their initial bet (see line 31)
  let bet_hold : number = -1 * bet_val;
  let p_reroll = 0;

  //p_reroll represents the probability that we will take a reroll. Under normal
  //circumstances, this does not happen. The exceptions are for users with high
  //balances
  if (dealer_roll == user_roll) {
    if (balance >= 5000) p_reroll = 0.3;
    else if (balance >= 10000) p_reroll = 0.5;
  }

  //if the user did not roll the same as the dealer and/or if they do not meet
  //the balance threshold, there is no chance of taking the reroll.
  const will_reroll: boolean = Math.random() <= p_reroll;
  dealer_roll = will_reroll ? roll_dice(dice_max) : dealer_roll;


  //not grouped with above check because of the potential for a reroll
  if (user_roll == dealer_roll) {
    bet_hold += bet_val * (multiplier + 1);
  }

  return process_bet(bet_hold, bet_val, user_roll, dealer_roll, db);
}

function roll_dice(dice_max: number) : number {
  return Math.ceil(Math.random() * dice_max);
}
