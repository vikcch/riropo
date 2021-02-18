import biz, { actionAmount, getLineCards } from '@/scripts/units/biz';
import fns, { head, rear } from '@/scripts/units/fns';
import { pipe } from '@/scripts/units/fxnl';
import { History, HistoryT } from '@/scripts/units/history';
import { Player, PlayerT } from '@/scripts/units/player';
import { DelimitersT } from '@/scripts/units/delimiters';
import easeConclusion from './conclusion'

// TODO:: JSDOCS
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
 * @returns {{value: string, index: number}[]}
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
    // *** FLOP *** [Qs 4c Th]

    const findDelimiterIndex = line => line.startsWith(delimiters.current);

    const delimiterLineIndexStart = lines.findIndex(findDelimiterIndex);

    // Não inclui a linha do delimiter '*** xxx ***'
    const remainLines = lines.slice(delimiterLineIndexStart + 1);

    const rec = i => {

        delimiters.index = i;
        const r = remainLines.findIndex(findDelimiterIndex);

        if (r === -1) return rec(++i);
        else return r;
    }

    const delimiterLineIndex = rec(delimiters.index);

    const bareActivityLines = remainLines.slice(0, delimiterLineIndex + 1);

    const classify = (value, i) => ({ value, index: delimiterLineIndexStart + 1 + i });

    return bareActivityLines.map(classify).filter(x => {

        const v = x.value.trim();

        const ends = v.endsWith(': checks') || v.endsWith(': folds');
        const calls = /:\scalls\s(|.+)\d$/.test(v);
        const bets = /:\sbets\s(|.+)\d$/.test(v);
        const raises = /:\sraises\s(|.+)\d$/.test(v);

        return ends || calls || bets || raises;
    });
};

/**
 * 
 * @param {string[]} lines 
 * @returns {{value: string, index: number}}
 */
const getStreetLine = (lines, delimiters) => {

    // ...
    // *** FLOP *** [Qs 4c Th]
    // ...

    const findDelimiterIndex = line => line.startsWith(delimiters.current);

    const delimiterLineIndexStart = lines.findIndex(findDelimiterIndex);

    return {
        value: lines[delimiterLineIndexStart],
        index: delimiterLineIndexStart
    };
};

/**
 * 
 * @param {string[]} lines 
 * @returns {string[]}
 */
const getConclusionLines = lines => {

    // *** SHOW DOWN ***
    // PoketAces990: shows [2d 2s] (two pair, Queens and Deuces)
    // vikcch: mucks hand 
    // PoketAces990 collected €0.04 from pot
    // *** SUMMARY ***

    // ou 

    // pestmontijo: folds 
    // Uncalled bet (€0.01) returned to AndréRPoker
    // AndréRPoker collected €0.02 from pot
    // *** SUMMARY ***

    const showdownIndex = lines.indexOf('*** SHOW DOWN ***');
    const summaryIndex = lines.indexOf('*** SUMMARY ***');

    const hasShowdown = showdownIndex !== -1;

    const rdc = (acc, cur, index) => {

        if (index >= summaryIndex) return acc;

        const isUncalledLine = cur.startsWith('Uncalled bet (');

        if (isUncalledLine || acc.length) acc.push(cur);

        return acc;
    };

    if (hasShowdown) return lines.slice(showdownIndex + 1, summaryIndex);
    else return lines.reduce(rdc, []);
};

/**
 * 
 * @param {string[]} lines 
 * @param {PlayerT[]} players 
 */
const posts = (lines, players) => {

    const postLines = getPostsLines(lines);

    const newPlayers = players.map(x => x.clone());

    let pot = 0;

    const historyLines = [];

    postLines.forEach(line => {

        const find = player => line.startsWith(`${player.name}: posts`);

        const player = newPlayers.find(find);

        const arrSplit = line.split(' ');

        const amount = pipe(rear, fns.removeMoney, Number)(arrSplit);

        player.stack -= amount;

        const isAnte = line.startsWith(`${player.name}: posts the ante `);

        player.amountOnStreet = isAnte ? 0 : amount;

        pot += amount;

        if (!isAnte) historyLines.push(line);
    });

    const history = {

        players: newPlayers,
        pot,
        line: historyLines
    };

    return History(history);
};


/**
 * 
 * @param {string[]} lines 
 * @param {HistoryT} previousHistory
 * @param { DelimitersT } delimiters
 */
const activity = (lines, previousHistory, delimiters) => {

    const activityLines = getActivityLines(lines, delimiters);

    let pot = previousHistory.pot;

    const histories = [];

    activityLines.forEach(item => {

        const { value: line, index: lineIndex } = item;

        // TODO:: testar player `vik:` e `vik: cch`

        const lastHistory = rear(histories) ?? previousHistory;

        const clonedPlayers = lastHistory.players.map(x => x.clone());

        const find = player => line.startsWith(`${player.name}: `);

        const player = clonedPlayers.find(find);

        const startAt = `${player.name}: `.length;

        const remainLine = line.substring(startAt);

        const action = head(remainLine.split(' '));

        const amount = actionAmount(line);

        if (action === 'raises') {

            const diff = amount - player.amountOnStreet;
            player.stack -= diff;
            pot += diff;
            player.amountOnStreet = amount;

        } else {

            player.stack -= amount;
            pot += amount;
            player.amountOnStreet += amount;
        };

        if (action === 'folds') {

            player.inPlay = false;
        }

        lastHistory.nextPlayer = player;

        // NOTE:: Não faz mal copiar a referencia porque todos os `histories`
        // sáo apenas desta 'activity', podia dar pau em "redo"
        const { streetCards } = lastHistory;

        const history = History({

            players: clonedPlayers,
            pot,
            action,
            player,
            line,
            lineIndex,
            streetCards
        });

        histories.push(history);
    });

    return histories;
};


/**
 * 
 * @param {string[]} lines 
 * @param {HistoryT} previousHistory
 * @param { DelimitersT } delimiters
 * @returns {History[]} Só um item, mas array para coincidir com `activity`
 */
const street = (lines, previousHistory, delimiters) => {

    const streetLine = getStreetLine(lines, delimiters);

    const streetCards = getLineCards(streetLine.value);

    const newPlayers = previousHistory.players.map(x => x.cloneResetStreet());

    const history = History({

        players: newPlayers,
        pot: previousHistory.pot,
        action: '',
        player: null,
        line: streetLine.value,
        lineIndex: streetLine.index,
        streetCards
    });

    return [history];
};

/**
 * 
 * @param {string[]} lines 
 * @param {HistoryT} previousHistory
 * @returns {History[]} 
 */
const conclusion = (lines, previousHistory) => {

    // PoketAces990: shows [2d 2s] (two pair, Queens and Deuces)
    // vikcch: mucks hand 
    // PoketAces990 collected €0.04 from pot

    // ou 

    // Uncalled bet (€0.01) returned to AndréRPoker
    // AndréRPoker collected €0.02 from pot

    // se tiver side pot:
    // vikcch collected 2120 from side pot
    // vikcch collected 14448 from main pot

    const conclusionLines = getConclusionLines(lines);

    const newPlayers = previousHistory.players.map(x => x.cloneResetStreet());

    const { streetCards } = previousHistory;

    const histories = [];

    conclusionLines.forEach(line => {

        let playersMutated = false;

        playersMutated ||= easeConclusion.shows(line, newPlayers);

        playersMutated ||= easeConclusion.mucks(line, newPlayers, lines);

        playersMutated ||= easeConclusion.collects(line, newPlayers);

        playersMutated ||= easeConclusion.uncalled(line, newPlayers);  

        if (!playersMutated) return;

        const history = History({

            players: newPlayers,
            pot: previousHistory.pot,
            action: '',
            player: null,
            line: line,
            lineIndex: null,
            streetCards
        });

        histories.push(history);
    });

    return histories;
};


export default {

    posts,
    activity,
    street,
    conclusion
};


export const testables = {
    getActivityLines,
    getConclusionLines
}