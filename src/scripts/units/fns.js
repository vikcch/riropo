/**
 * 
 * @param {any[]} array 
 * @returns {any}
 */
export const head = array => {

    return array[0];
};

/**
 * 
 * @param {any[]} array 
 * @returns {any}
 */
export const rear = array => {

    return array.slice(-1)[0];
};

export default {

    /**
     * 
     * @param {string} value 
     * @returns {string}
     */

    removeMoney(value) {

        const approve = x => x >= 0 && x <= 9 || x === '.';

        return [...value].filter(approve).join('');
    }
}