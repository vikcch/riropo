import fns, { head, rear } from '@/scripts/units/fns';
import { pipe } from '@/scripts/units/fxnl';

/**
 * 
 * @param {string} line 
 * @returns {number}
 */
export const actionAmount = line => {

    const arrSplit = line.split(' ');

    const rearValue = pipe(rear, fns.removeMoney, Number)(arrSplit);

    return rearValue || 0;
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

export default {

    getActionIndex,
    getChipIndex,
    getChips,
    getLineCards,
    getCardIndex
}

export const testables = {
    getLineCards
}

