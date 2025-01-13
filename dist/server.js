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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_id = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const gm = __importStar(require("./utils/game_mechanics"));
const fh = __importStar(require("./utils/file_handler"));
const database_handler_1 = require("./utils/database_handler");
const constants = __importStar(require("./utils/constants"));
exports.user_id = "user" + Math.floor(Math.random() * 100);
const app = (0, express_1.default)();
(0, database_handler_1.run_database)();
//option to use either a database or local json file for saved information
//I initially misread the prompt and used this to change functionality to a db layer
let db_t = 'db';
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let latest_val = yield fh.get_latest_bet(db_t);
    if (latest_val == null) { // makes sure that site does not crash if missing data
        latest_val = constants.default_bet_data;
    }
    res.render('home', latest_val);
}));
app.post('/submit-bet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bet_data = yield gm.place_bet(req.body.amount, req.body.user_dice, db_t);
    res.render('home', bet_data);
}));
app.get('/withdraw', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const has_won_before = yield fh.has_won_before(db_t);
    if (has_won_before) {
        fh.reset_game(db_t);
        res.render('home', constants.default_bet_data);
    }
    else {
        let data = yield fh.get_latest_bet(db_t);
        data['alert'] = "WITHDRAW_FAIL";
        res.render('home', data);
    }
}));
app.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hist = yield fh.get_history(db_t);
    res.render('history', { 'data': hist });
}));
