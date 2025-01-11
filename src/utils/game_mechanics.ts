import { dice_max, multiplier } from './constants';
import { write_bet_to_file, has_won, reset_game } from './file_handling';

export function process_bet(bet_val: number, user_dice: number) : void {
  const computer_dice : number = Math.ceil(Math.random() * dice_max);
  let bet_hold : number = -1 * bet_val

  if (user_dice == computer_dice) {
    bet_hold += bet_val * multiplier;
  }

  write_bet_to_file(bet_hold, bet_val, user_dice);
}

export function withdraw() : boolean {
  const can_withdraw : boolean = has_won()
  if(can_withdraw) reset_game();

  return can_withdraw;
}
