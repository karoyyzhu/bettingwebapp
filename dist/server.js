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
const constants = __importStar(require("./utils/constants"));
exports.user_id = "user" + Math.floor(Math.random() * 100);
const app = (0, express_1.default)();
//run_database();
let db_t = 'json';
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
app.get('/', function (req, res) {
    res.render('home', fh.get_latest_bet(db_t));
});
app.post('/submit-bet', (req, res) => {
    const bet_data = gm.place_bet(req.body.amount, req.body.user_dice);
    res.render('home', bet_data);
});
app.get('/withdraw', (req, res) => {
    if (fh.has_won_before(db_t)) {
        fh.reset_game(db_t);
        res.render('home', constants.default_bet_data);
    }
    else {
        let data = fh.get_latest_bet(db_t);
        data['alert'] = "WITHDRAW_FAIL";
        res.render('home', data);
    }
});
app.get('/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('history', { 'data': fh.get_history(db_t) });
}));
