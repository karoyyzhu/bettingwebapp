"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.process_bet = process_bet;
exports.get_latest_bet = get_latest_bet;
exports.get_history = get_history;
exports.log_to_history = log_to_history;
exports.has_won_before = has_won_before;
exports.reset_game = reset_game;
const constants_1 = require("./constants");
const fs = __importStar(require("fs"));
//balance_delta represents value to add to balance
function process_bet(balance_delta, bet_val, dice_roll) {
    const latest_bet = get_latest_bet();
    const new_balance = parseInt(latest_bet['balance']) + balance_delta;
    let num_wins = parseInt(latest_bet['num_wins']);
    if (new_balance <= 0) {
        console.log('You went broke ): Resetting...');
        console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');
        reset_game();
        return constants_1.default_bet_data;
    }
    else {
        win = balance_delta > 0;
        num_wins = win ? num_wins + 1 : num_wins;
        const new_bet_data = {
            "balance": new_balance,
            "bet_val": parseInt(bet_val),
            "dice_roll": parseInt(dice_roll),
            "num_wins": num_wins,
            "win": win
        };
        log_to_history(new_bet_data);
        return new_bet_data;
    }
}
function get_latest_bet() {
    if (!fs.existsSync(constants_1.session_data_filename)) {
        reset_game();
    }
    return get_history()[0];
}
function get_history() {
    if (!fs.existsSync(constants_1.session_data_filename)) {
        reset_game();
    }
    return JSON.parse(fs.readFileSync(constants_1.session_data_filename, 'utf-8'));
}
function log_to_history(new_bet) {
    if (!fs.existsSync(constants_1.session_data_filename)) {
        reset_game();
    }
    const new_list = JSON.parse(fs.readFileSync(constants_1.session_data_filename, 'utf-8')).push(new_bet);
    fs.writeFileSync(constants_1.session_data_filename, JSON.stringify(new_list));
}
function has_won_before() {
    if (!fs.existsSync(constants_1.session_data_filename)) {
        return false;
    }
    return parseInt(get_latest_bet()['num_wins']) > 0;
}
function reset_game() {
    const default_list = Array(constants_1.default_bet_data);
    fs.writeFile(constants_1.session_data_filename, JSON.stringify(default_list), (err) => {
        if (err)
            console.error(err);
        else
            console.log("Successful write.");
    });
}
