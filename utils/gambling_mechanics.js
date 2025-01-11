import { dice_max, multiplier } from './constants.js';
import { write_bet_to_file } from './file_handling.js';

export function process_bet(bet_val, user_dice) {
  var computer_dice = Math.ceil(Math.random() * dice_max);
  var bet_hold = -1 * bet_val

  if (user_dice == computer_dice) {
    bet_hold += bet_val * multiplier;
  }

  write_bet_to_file(bet_hold, bet_val, user_dice);
}
