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
exports.has_won_before = has_won_before;
exports.reset_game = reset_game;
const fs = __importStar(require("fs"));
const constants_1 = require("./constants");
const server_1 = require("../server");
const database_handler_1 = require("./database_handler");
//balance_delta represents value to add to balance
function process_bet(balance_delta, bet_val, user_roll, dealer_roll) {
    const latest_bet = get_latest_bet();
    const new_balance = latest_bet['balance'] + balance_delta;
    let num_wins = latest_bet['num_wins'];
    if (new_balance <= 0) {
        console.log('You went broke ): Resetting...');
        console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');
        reset_game();
        return constants_1.default_bet_data;
    }
    else {
        //if change in balance is positive, user won. negative, user lost.
        const win_val = balance_delta > 0;
        num_wins = win_val ? num_wins + 1 : num_wins;
        const alert = win_val ? "WIN" : "LOSE";
        const new_bet_data = {
            "balance": new_balance,
            "bet_val": bet_val,
            "user_roll": user_roll,
            "dealer_roll": dealer_roll,
            "num_wins": num_wins,
            "win": win_val,
            "alert": alert,
            "timestamp": Date.now(),
            "user_id": server_1.user_id
        };
        log_to_history(new_bet_data);
        return new_bet_data;
    }
}
//add new bet to history, each new bet added to the beginning of the json file
function log_to_history(new_bet) {
    const bet_list = [new_bet];
    let in_list = JSON.parse(fs.readFileSync(constants_1.session_data_filename, 'utf-8'));
    in_list.unshift(new_bet);
    fs.writeFileSync(constants_1.session_data_filename, JSON.stringify(in_list));
}
function get_latest_bet(db) {
    if (db == 'db') {
        return (0, database_handler_1.get_latest_bet_db)();
    }
    else {
        const history = get_history();
        return history.length > 0 ? history[0] : constants_1.default_bet_data;
    }
}
function get_history(db) {
    if (db == 'db') {
        return (0, database_handler_1.get_history_db)();
    }
    else {
        if (!fs.existsSync(constants_1.session_data_filename)) {
            reset_game();
            return [];
        }
        else {
            return JSON.parse(fs.readFileSync(constants_1.session_data_filename, 'utf-8'));
        }
    }
}
//boolean to check if user has won before
function has_won_before(db) {
    if (db == 'db') {
        const force_cast_bet = (0, database_handler_1.get_latest_bet_db)();
        if (force_cast_bet != null) {
            return force_cast_bet['num_wins'] > 0;
        }
    }
    else {
        if (fs.existsSync(constants_1.session_data_filename))
            return get_latest_bet(db)['num_wins'] > 0;
    }
    return false;
}
//reset changes all values back to defaults, and clears history.
function reset_game(db) {
    if (db == 'db') {
        (0, database_handler_1.reset_game_db)();
    }
    else {
        fs.writeFileSync(constants_1.session_data_filename, "[]");
        log_to_history(constants_1.default_bet_data);
    }
}
