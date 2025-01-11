import { initial_balance, session_data_filename } from './constants.js';
import * as fs from 'fs';

//balance_delta represents value to add to balance
export function write_bet_to_file(balance_delta, bet_val, dice_roll) {
  fs.stat(session_data_filename,
  (err, stats) => {
    if (err) {
      create_default_state();
    }
    var file_data = JSON.parse(fs.readFileSync(session_data_filename, 'utf8'));
    var new_balance = parseInt(file_data['balance']) + balance_delta;

    if(new_balance <= 0) {
      console.log('You went broke ): Resetting...')
      console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');

      create_default_state();
    } else {
      file_data['balance'] = new_balance;
      file_data['bet_val'] = bet_val;
      file_data['dice_roll'] = dice_roll;

      var new_file_data = JSON.stringify(file_data);
      fs.writeFileSync(session_data_filename, new_file_data);
    }
  });
}

function create_default_state() {
  var default_state = {"balance": initial_balance};
  fs.writeFile(session_data_filename, JSON.stringify(default_state),
    (err) => {
      if(err) console.error(err);
      else console.log("Successful write.");
    });
}
