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



export default {


}