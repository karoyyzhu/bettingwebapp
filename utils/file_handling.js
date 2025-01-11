import { initial_balance, session_data_filename, history_csv_filename } from './constants.js';
import * as fs from 'fs';

//balance_delta represents value to add to balance
export function write_bet_to_file(balance_delta, bet_val, dice_roll) {
  fs.stat(session_data_filename,
  (err, stats) => {
    if (err) {
      reset_balance();
      write_bet_to_file(balance_delta, bet_val, dice_roll);
    }
    else {
      var file_data = JSON.parse(fs.readFileSync(session_data_filename, 'utf8'));
      var new_balance = parseInt(file_data['balance']) + balance_delta;

      if(new_balance <= 0) {
        console.log('You went broke ): Resetting...')
        console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');

        reset_balance();
      } else {
        var new_file_data = {
          "balance" : new_balance,
          "bet_val": parseInt(bet_val),
          "dice_roll": parseInt(dice_roll),
        }
        fs.writeFileSync(session_data_filename, JSON.stringify(new_file_data));

        fs.stat(history_csv_filename,
        (err, stats) => {
          if(err) begin_history_log();
          else {
            var existing_history = fs.readFileSync(history_csv_filename, 'utf8');
            var new_entry = `${new_balance},${bet_val},${dice_roll},${Date.now()}\n`;
            var new_history = existing_history.concat(new_entry);

            fs.writeFileSync(history_csv_filename, new_history);
          }
        })
      }
    }
  });
}

function begin_history_log() {
  fs.writeFile(history_csv_filename, "balance,bet_val,dice_roll,timestamp",
    (err) => {
      if(err) console.error(err);
      else {
        console.log("History log established.");
      }
    });
}

function reset_balance() {
  var default_state = {'balance': initial_balance, 'bet_val': -1, 'dice_roll':-1};
  console.log(JSON.stringify(default_state));
  fs.writeFile(session_data_filename, JSON.stringify(default_state),
    (err) => {
      if(err) console.error(err);
      else console.log("Successful write.");
    });
}
