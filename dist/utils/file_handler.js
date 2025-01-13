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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function process_bet(balance_delta, bet_val, user_roll, dealer_roll, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let latest_bet = yield get_latest_bet(db);
        const new_balance = latest_bet['balance'] + balance_delta;
        let num_wins = latest_bet['num_wins'];
        if (new_balance <= 0) {
            console.log('You went broke ): Resetting...');
            console.log('If my pit boss catches me doing this he\'ll have my kneecaps!');
            reset_game(db);
            return constants_1.default_bet_data;
        }
        else { // creates bet object to save to DB
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
                "timestamp": new Date(),
                "user_id": server_1.user_id
            };
            log_to_history(new_bet_data, db); // write to database
            return new_bet_data;
        }
    });
}
//add new bet to history, each new bet added to the beginning of the json file
function log_to_history(new_bet, db) {
    if (db == 'db') {
        (0, database_handler_1.write_to_db)(new_bet);
    }
    else {
        const bet_list = [new_bet];
        let in_list = JSON.parse(fs.readFileSync(constants_1.session_data_filename, 'utf-8'));
        in_list.unshift(new_bet); //adds new history to beginning of file to make access of most recent bet easier
        fs.writeFileSync(constants_1.session_data_filename, JSON.stringify(in_list));
    }
}
function get_latest_bet(db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (db == 'db') {
            const latest_bet = yield (0, database_handler_1.get_latest_bet_db)();
            if (latest_bet == null || latest_bet.length == 0) {
                return constants_1.default_bet_data;
            }
            return latest_bet;
        }
        else {
            const history = yield get_history(db);
            return history.length > 0 ? history[0] : constants_1.default_bet_data;
        }
    });
}
function get_history(db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (db == 'db') {
            const history = yield (0, database_handler_1.get_history_db)();
            return history;
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
    });
}
//boolean to check if user has won before
function has_won_before(db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (db == 'db') {
            const check_wins = yield (0, database_handler_1.get_latest_bet_db)();
            return check_wins['num_wins'] > 0;
        }
        else {
            if (fs.existsSync(constants_1.session_data_filename)) {
                const num_wins = yield get_latest_bet(db);
                return num_wins > 0;
            }
        }
        return false;
    });
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
