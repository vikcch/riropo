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

export default {

    getActionIndex,
    getChipIndex,
    getChips
}