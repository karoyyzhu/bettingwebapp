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
exports.Bet = void 0;
exports.run_database = run_database;
exports.write_to_db = write_to_db;
exports.get_history_db = get_history_db;
exports.get_latest_bet_db = get_latest_bet_db;
exports.reset_game_db = reset_game_db;
const sequelize = __importStar(require("sequelize"));
const server_1 = require("../server");
const constants_1 = require("./constants");
//replace with username and password
const sqlz = new sequelize.Sequelize('postgres://[username]:[password]@localhost:5432/postgres');
exports.Bet = sqlz.define('bet', {
    "balance": { type: sequelize.DataTypes.INTEGER },
    "bet_val": { type: sequelize.DataTypes.INTEGER },
    "user_roll": { type: sequelize.DataTypes.INTEGER },
    "dealer_roll": { type: sequelize.DataTypes.INTEGER },
    "num_wins": { type: sequelize.DataTypes.INTEGER },
    "win": { type: sequelize.DataTypes.BOOLEAN },
    "alert": { type: sequelize.DataTypes.STRING },
    "timestamp": { type: sequelize.DataTypes.DATE },
    "user_id": { type: sequelize.DataTypes.STRING }
});
function run_database() {
    return __awaiter(this, void 0, void 0, function* () {
        sqlz.authenticate().then(() => {
            console.log("Successful connect to database");
        }).catch((err) => {
            console.error("Failed to connect to database; ", err);
        });
        //drops any existing information and conforms to Bet model
        exports.Bet.sync({ force: true });
    });
}
function write_to_db(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        try {
            yield exports.Bet.create(data);
        }
        catch (err) {
            console.log('Failed to write to database; ', err);
        }
    });
}
function get_history_db() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const history = yield exports.Bet.findAll({
                where: {
                    user_id: server_1.user_id
                }
            });
            return history;
        }
        catch (err) {
            console.error("Failed to retrieve history; ", err);
        }
    });
}
//gets most recent bet logged to DB
function get_latest_bet_db() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = yield exports.Bet.findAll({
                where: {
                    user_id: server_1.user_id,
                },
                order: [["timestamp", "DESC"]],
                limit: 1,
                raw: true
            });
            return payload[0]; // query returns as a list of one item, this gets the object
        }
        catch (err) {
            console.error("Failed to retrieve value; ", err);
        }
    });
}
//resets db by erasing all of user's previous history, writing default value in
function reset_game_db() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.Bet.destroy({ where: { user_id: server_1.user_id } });
            write_to_db(constants_1.default_bet_data);
        }
        catch (err) {
            console.error("Failed to reset database, deleting user history; ", err);
        }
    });
}
