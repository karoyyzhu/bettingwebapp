import { initial_balance, session_data_filename, history_csv_filename } from './constants';
import * as fs from 'fs';

type BetData = {
  "balance" : number,
  "bet_val": number,
  "dice_roll": number,
  "num_wins": number
}

//balance_delta represents value to add to balance
export function write_bet_to_file(balance_delta: number, bet_val: number, dice_roll: number) : void {
  fs.stat(session_data_filename,
  (err, stats) => {
    if (err) {
      reset_balance();
      write_bet_to_file(balance_delta, bet_val, dice_roll);
    }
    else {
      const file_data = JSON.parse(fs.readFileSync(session_data_filename, 'utf8'));
      const new_balance : number = Number(file_data['balance']) + balance_delta;
      let num_wins : number = Number(file_data['num_wins']);

      if(new_balance <= 0) {
        console.log('You went broke ): Resetting...')
        console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');

        reset_game();
      } else {
        num_wins = balance_delta > 0 ? num_wins + 1 : num_wins;
        const new_file_data : BetData = {
          "balance" : new_balance,
          "bet_val": Number(bet_val),
          "dice_roll": Number(dice_roll),
          "num_wins": num_wins
        }
        fs.writeFileSync(session_data_filename, JSON.stringify(new_file_data));

        fs.stat(history_csv_filename,
        (err, stats) => {
          if(err) begin_history_log();
          else {
            const existing_history : string = fs.readFileSync(history_csv_filename, 'utf8');
            const new_entry : string = `${new_balance},${bet_val},${dice_roll},${Date.now()}\n`;
            const new_history = existing_history.concat(new_entry);

            fs.writeFileSync(history_csv_filename, new_history);
          }
        })
      }
    }
  });
}

export function has_won() : boolean {
  fs.stat(session_data_filename,
  (err, stats) => {
    if(err) return false;
    else {
      return Number(JSON.parse(fs.readFileSync(session_data_filename, 'utf8'))['num_wins']) > 0;
    }
  });

  return false;
}

export function reset_game() : void {
  reset_balance()
  begin_history_log()
}

function begin_history_log() : void {
  fs.writeFile(history_csv_filename, "balance,bet_val,dice_roll,timestamp\n",
    (err) => {
      if(err) console.error(err);
      else {
        console.log("History log established.");
      }
    });
}

function reset_balance() : void {
  const default_state : BetData = {'balance': initial_balance, 'bet_val': -1, 'dice_roll':-1, 'num_wins': 0};
  console.log(JSON.stringify(default_state));
  fs.writeFile(session_data_filename, JSON.stringify(default_state),
    (err) => {
      if(err) console.error(err);
      else console.log("Successful write.");
    });
}
