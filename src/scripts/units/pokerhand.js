import ease from '../eases/pokerhand/index';
import { head } from './fns';

/**
 * 
 * @param {string[]} lines
 * @returns {number}
 */
const countPlayers = lines => {

    const holeCardsLineCount = lines.indexOf('*** HOLE CARDS ***');

    const seats = (v, i) => v.startsWith('Seat ') && i < holeCardsLineCount;

    return lines.filter(seats).length;

};

/**
 * 
 * @param {string[]} lines
 * @returns {number}
 */
const getButtonSeat = lines => {

    // Table 'Akiyama II' 6-max Seat #5 is the button

    const buttonLine = lines[1];

    const match = buttonLine.match(/\s#.\s/);

    return Number(match[0].replace('#', ''));
};

/**
 * 1-> Tornament Hold'em  
 * 2-> Cash Hold'em  
 * 3-> Tournament PLO  
 * 4-> Cash PLO
 * 
 * @param {string[]} lines
 * @returns {number}
 */
const getGameMode = lines => {

    // cash
    // PokerStars Hand #206007550592:  Hold'em No Limit (€0.01/€0.02 EUR) - ...

    const gameModeLine = lines[0];

    const tournament = gameModeLine.includes('Tournament');
    const Holdem = gameModeLine.includes('Hold');

    if (tournament) return Holdem ? 1 : 3;
    else return Holdem ? 2 : 4;
};

/**
 * @param {string[]} lines
 * @returns {number}
 */
const getTableMax = lines => {

    // ...
    // Table 'Akiyama II' 6-max Seat #5 is the button

    const tableMaxLine = lines[1];

    const match = tableMaxLine.match(/\d+(?=\-max\sSeat\s#\d+\sis\sthe\sbutton$)/gm)

    return Number(head(match));
};

/**
 * 
 * @param {string[]} lines 
 */
export default function (lines) {

    const buttonSeat = getButtonSeat(lines);

    const players = ease.createPlayers(lines, buttonSeat);

    const histories = ease.createHistories(lines, players);

    // TODO:: table max, date, stakes, table name, room, hand id

    return {

        playersCount: countPlayers(lines),
        buttonSeat,
        gameMode: getGameMode(lines),
        tableMax: getTableMax(lines),
        players,
        histories
    };


}

export const testables = {
    getButtonSeat,
    getGameMode,
    getTableMax
}