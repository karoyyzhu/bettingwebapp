"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.place_bet = place_bet;
exports.withdraw = withdraw;
const constants_1 = require("./constants");
const file_handler_1 = require("./file_handler");
function place_bet(bet_val, user_roll) {
    const balance = (0, file_handler_1.get_latest_bet)()['balance'];
    let dealer_roll = roll_dice(constants_1.dice_max);
    //bets can be represented as the user paying their initial bet, which remains
    //lost if they lose the gamble, or is won back along with [multiplier] times
    //their initial bet (see line 31)
    let bet_hold = -1 * bet_val;
    let p_reroll = 0;
    //p_reroll represents the probability that we will take a reroll. Under normal
    //circumstances, this does not happen. The exceptions are for users with high
    //balances
    if (dealer_roll == user_roll) {
        if (balance >= 5000)
            p_reroll = 0.3;
        else if (balance >= 10000)
            p_reroll = 0.5;
    }
    //if the user did not roll the same as the dealer and/or if they do not meet
    //the balance threshold, there is no chance of taking the reroll.
    const will_reroll = Math.random() <= p_reroll;
    dealer_roll = will_reroll ? roll_dice(constants_1.dice_max) : dealer_roll;
    //not grouped with above check because of the potential for a reroll
    if (user_roll == dealer_roll) {
        bet_hold += bet_val * (constants_1.multiplier + 1);
    }
    return (0, file_handler_1.process_bet)(bet_hold, bet_val, user_roll, dealer_roll);
}
function withdraw() {
    const can_withdraw = (0, file_handler_1.has_won_before)();
    if (can_withdraw)
        (0, file_handler_1.reset_game)();
    return can_withdraw;
}
function roll_dice(dice_max) {
    return Math.ceil(Math.random() * dice_max);
}
