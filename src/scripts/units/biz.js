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

export const getChipIndex = amount => {

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

    return values.indexOf(amount);
}

export default {


}