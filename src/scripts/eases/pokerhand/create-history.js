import { actionAmount } from '@/scripts/units/biz';
import fns, { head, rear } from '@/scripts/units/fns';
import { pipe } from '@/scripts/units/fxnl';
import History from '@/scripts/units/history';
import Player from '@/scripts/units/player';

const getPostsLines = lines => {

    // PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]
    // Table 'Akiyama II' 6-max Seat #5 is the button
    // Seat 2: vikcch (€2 in chips) 
    // Seat 5: ruipinho1 (€5.60 in chips) 
    // ruipinho1: posts small blind €0.01
    // vikcch: posts big blind €0.02
    // *** HOLE CARDS ***

    const holeCardsLineCount = lines.indexOf('*** HOLE CARDS ***');

    // Não inclui a linha '*** HOLE CARDS ***'
    const barePostsLines = lines.slice(2, holeCardsLineCount);

    return barePostsLines.filter(x => /:\sposts\s.+\d$/gm.test(x));
};


/**
 * 
 * @param {string[]} lines 
 * @returns {string[]}
 */
const getActivityLines = (lines, delimiters) => {

    // *** HOLE CARDS ***
    // Dealt to vik [Ad As]
    // Dealted to rita [4d 6s]
    // Dealted to joana [6s 3d]
    // Dealted to sasdfasdf [2s 6s]
    // sasdfasdf: folds
    // vik: calls 5
    // rita: calls 3
    // joana: checks
    // *** FLOP *** [Ad As Ad]

    // TODO:: trazer para com inicio, mundar nome da variavel
    const holeCardsLineCount = lines.indexOf(delimiters.current);

    // Não inclui a linha do delimiter '*** xxx ***'
    const remainLines = lines.slice(holeCardsLineCount + 1);

    // return remainLines.filter(x => /:\sposts\s.+\d$/gm.test(x));

    // const delimiters = ['FLOP', 'TURN', 'RIVER', 'SHOW DOWN', 'SUMMARY'];

    const rec = i => {

        const delimiter = `*** ${delimiters[i]} ***`;
        delimiters.index = i;
        const r = remainLines.findIndex(x => x.startsWith(delimiters.current));

        if (r === -1) return rec(++i);
        else {
            
            return r;
        };
    }

    const delimiterLineIndex = rec(delimiters.index);

    const bareActivityLines = remainLines.slice(0, delimiterLineIndex + 1);

    return bareActivityLines.filter(x => {

        x = x.trim();

        const ends = x.endsWith(': checks') || x.endsWith(': folds');
        const calls = /:\scalls\s(|.+)\d$/.test(x);
        const bets = /:\sbets\s(|.+)\d$/.test(x);
        const raises = /:\sraises\s(|.+)\d$/.test(x);

        return ends || calls || bets || raises;
    });
};

/**
 * 
 * @param {string[]} lines 
 * @param {Player[]} players 
 */
const posts = (lines, players) => {

    const postLines = getPostsLines(lines);

    const newPlayers = players.map(x => x.clone());

    let pot = 0;

    postLines.forEach(line => {

        const find = player => line.startsWith(`${player.name}: posts`);

        const player = newPlayers.find(find);

        const arrSplit = line.split(' ');

        const amount = pipe(rear, fns.removeMoney, Number)(arrSplit);

        player.stack -= amount;

        // TODO:: money on street (não incluir antes)

        pot += amount;
    });


    const history = {

        players: newPlayers,
        pot,


    };


    return History(history);
};


/**
 * 
 * @param {string[]} lines 
 * @param {history:History}} previousHistory
 */
const activity = (lines, previousHistory, delimiters) => {

    const activityLines = getActivityLines(lines, delimiters);

    /** @type {Player[]} */
    const newPlayers = previousHistory.players.map(x => x.clone());

    let pot = previousHistory.pot;

    const histories = [];

    activityLines.forEach(line => {

        // TODO:: testar player `vik:` e `vik: cch`

        const find = player => line.startsWith(`${player.name}: `);

        const player = newPlayers.find(find);

        const startAt = `${player.name}: `.length;

        const remainLine = line.substring(startAt);

        const action = head(remainLine.split(' '));

        const amount = actionAmount(line);

        if (action === 'raises') {

            const diff = amount - player.amountOnStreet;
            player.stack -= diff;
            pot += diff;

        } else {

            player.stack -= amount;
            pot += amount;
        };

        player.amountOnStreet = amount;

        const history = History({

            players: newPlayers,
            pot,
            action,
            player,
            line
        });

        histories.push(history);

    });

    return histories;
};

export default {

    posts,
    activity
};


export const testables = {
    getActivityLines
}