import fns, { head, rear } from '@/scripts/units/fns';
import { pipe } from '@/scripts/units/fxnl';
import { profitColor } from './enums';

/**
 * 
 * @param {string} line 
 * @returns {number}
 */
export const actionAmount = line => {

    const arrSplit = line.replace(/\sand\sis\sall-in$/gm, '').split(' ');

    const rearValue = pipe(rear, fns.removeMoney, Number)(arrSplit);

    return rearValue || 0;
};

/**
 * 
 * @param {string} line 
 * @returns {number}
 */
const collectedAmount = line => {

    // PoketAces990 collected €0.04 from pot
    // vikcch collected 2120 from side pot
    // vikcch collected 14448 from main pot

    const arrSplit = line.split(' ');

    const dirtyValue = rear(arrSplit.filter(x => /\d$/gm.test(x)));

    return pipe(fns.removeMoney, Number)(dirtyValue);
};

/**
 * 
 * @param {string} line 
 * @returns {number}
 */
const uncalledAmount = line => {

    // Uncalled bet (€0.01) returned to AndréRPoker

    const dirtyValue = line.split(' ')[2];

    return pipe(fns.removeMoney, Number)(dirtyValue);
};

/**
 * 
 * @param {string} value 
 * @returns {boolean}
 */
const isUncalledBet = value => {

    // Uncalled bet (€0.01) returned to AndréRPoker

    return /^Uncalled\sbet\s\(.+\)\sreturned\sto\s/.test(value);
};

/**
 * 
 * @param {string} value 
 * @returns {number}
 */
export const getBigBlind = value => {

    // "1000/2000(+45)"
    // "100/200(+5)[400][800]"
    // "100/200[400][800]"
    // "€0.01/€0.02"

    const targetPart = rear(value.split('/'));

    const rdc = (acc, cur) => {

        if (cur === '(' || cur === '[') acc.break = true;

        if (!acc.break) acc.value += cur;

        return acc;
    };

    const dirty = [...targetPart].reduce(rdc, { value: '', break: false });

    return pipe(fns.removeMoney, Number)(dirty.value);
};

const getChipsValues = () => {

    const values = [0.01, 0.05, 0.25, 1];

    const sequence = [5, 5, 4, 5, 2];

    const rec = index => {

        const last = rear(values);

        if (last === 25000000000) return;
        if (index === 5) index = 0;

        const newValue = last * sequence[index];
        values.push(newValue);
        rec(++index);
    };

    rec(0);

    return values;
};

/**
 * 
 * @param {number} amount 
 * @returns {number}
 */
export const getChipIndex = amount => {

    return getChipsValues().indexOf(amount);
};

/**
 * Retorma array com o valor das fichas descendente
 * 
 * @example
 * 527 => [500, 25, 1, 1]
 * 
 * @param {number} value
 * @returns {number[]}
 */
export const getChips = value => {

    return getChipsValues().reduceRight((acc, cur) => {

        const rec = () => {

            if (acc.remaining >= cur) {

                acc.remaining -= cur;
                acc.remaining = Number(acc.remaining.toFixed(2));
                acc.chips.push(cur);
                rec();
            }
        };

        return rec(), acc;

    }, { remaining: value, chips: [] }).chips;
};


/**
 * 
 * @param {string} action 
 * @returns {number}
 */
export const getActionIndex = action => {

    return ['bets', 'calls', 'checks', 'raises', 'folds'].indexOf(action);
};

/**
 * 
 * @param {string} line 
 * @returns {string[]}
 */
export const getLineCards = line => {

    // Dealt to vikcch [5d Ad]
    // *** FLOP *** [Ac 4c Td]
    // *** TURN *** [Ac 7h 6h] [8s]
    // *** RIVER *** [Ac 7h 6h 8s] [4c]
    // pozilgas: shows [Kd 8h] (a pair of Aces)
    // Seat 6: pozilgas (button) mucked [Qh Th]

    const isTurn = line.startsWith('*** TURN *** [');
    const isRiver = line.startsWith('*** RIVER *** [');

    const end = isTurn || isRiver ? -4 : Infinity;

    const openBracketIndex = line.slice(0, end).lastIndexOf('[');
    const closeBracketIndex = line.lastIndexOf(']');

    const bareCards = line.substring(openBracketIndex + 1, closeBracketIndex);

    const cards = bareCards.replace('] [', ' ');

    return cards.split(' ');
};

/**
 * 
 * @param {string} card 
 * @returns { { suit:number, value:number } }
 */
export const getCardIndex = card => {

    const [value, suit] = card;

    return {
        suit: 'chsd'.indexOf(suit),
        value: '23456789TJQKA'.indexOf(value)
    };
};

/**
 * 
 * @param {number} profitBBs
 * @returns {string} hex color 
 */
export const getColorScale = profitBBs => {

    if (profitBBs >= 20) return profitColor.bigWin;
    if (profitBBs >= 10) return profitColor.mediumWin;
    if (profitBBs >= 2) return profitColor.smallWin;

    if (profitBBs <= -20) return profitColor.bigLose;
    if (profitBBs <= -10) return profitColor.mediumLose;
    if (profitBBs <= -2) return profitColor.smallLose;

    return profitColor.neutral;
};

/**
 * 
 * @param {string[]} lines
 * @returns {string[]} 
 */
const filterAllowedLines = lines => {

    // NOTE:: Noise lines em _riropo/hand-history/edge-cases_ (ver index.md)

    // NOTE:: `mucks hand`, `folds` e `checks` têm espaço no fim no log
    // da PokerStars, mas náo têm no _Live Squeezer_, `Seat x` têm em ambos

    const summaryIndex = lines.indexOf('*** SUMMARY ***');

    return lines.filter((line, index) => {

        const allowedRegex = [
            /^Seat\s\d:\s.+\)(|\sis\ssitting\sout)$/m,      // Seat x
            /\:\sposts\s.*\d(|\sand\sis\sall-in)$/m,        // post
            /^Dealt(|ed)\sto\s.+\]$/m,                      // Dealt

            /\:\sfolds$/m,                                  // folds
            /\:\schecks$/m,                                 // checks
            /\:\sbets\s.*\d(|\sand\sis\sall-in)$/m,         // bets
            /\:\scalls\s.*\d(|\sand\sis\sall-in)$/m,        // calls
            /\:\sraises\s.*\d(|\sand\sis\sall-in)$/m,       // raises
            /^Uncalled\sbet\s\(.+\)\sreturned\sto\s/,       // Uncalled bet

            /^\*\*\*\s(FLOP|TURN|RIVER)\s\*\*\*\s\[.+\]$/m, // Street

            /\:\sshows\s\[.+\]/,                            // shows
            /\:\smucks\shand$/m,                            // mucks
            /\scollected\s.+pot$/m,                         // collects
        ];

        const fixedLines = [
            '*** HOLE CARDS ***', '*** SHOW DOWN ***', '*** SUMMARY ***'
        ];

        if (fixedLines.includes(line)) return true;

        const tableGameDescription = index < 2;
        if (tableGameDescription || index > summaryIndex) return true;

        return allowedRegex.some(v => v.test(line.trimEnd()));
    });
};

export default {

    getActionIndex,
    getChipIndex,
    getChips,
    getLineCards,
    getCardIndex,
    collectedAmount,
    uncalledAmount,
    isUncalledBet,
    actionAmount,
    getBigBlind,
    getColorScale,
    filterAllowedLines
}

export const testables = {
    getLineCards,
    collectedAmount,
    uncalledAmount,
    actionAmount,
    getBigBlind
}

