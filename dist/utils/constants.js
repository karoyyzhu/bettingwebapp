"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_bet_data = exports.session_data_filename = exports.initial_balance = exports.multiplier = exports.dice_max = void 0;
exports.dice_max = 6;
exports.multiplier = 5;
exports.initial_balance = 1000;
exports.session_data_filename = "session_data.json";
exports.default_bet_data = {
    'balance': exports.initial_balance,
    'bet_val': -1,
    'user_roll': -1,
    'dealer_roll': -1,
    'num_wins': 0,
    'win': false,
    'alert': "DEFAULT",
    'timestamp': new Date("1995-12-17T03:24:00"), // arbitrary date in the past
    'user_id': "default"
};
