import View from "../view";


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

/**
 * 
 * @param {string|number} value 
 * @return {string} 
 */
export const thousandSeparator = value => {

    const arrSplit = `${value}`.replace('-', '').split('.');

    const wholePart = head(arrSplit);

    const decimalPart = arrSplit.length > 1 ? `.${rear(arrSplit)}` : '';

    const sign = `${value}`.charAt(0) === '-' ? '-' : '';

    const r = [...wholePart].reduce((cur, acc, index, arr) => {

        const comma = (arr.length - index) % 3 === 0 ? ',' : '';

        return `${cur}${comma}${acc}`;
    });

    return `${sign}${r}${decimalPart}`;
};


/**
 * 
 * @param {number} value 
 * @return {string} 
 */
export const twoDecimalOrWhole = value => {

    const v = Number(value.toFixed(2));

    if (Number.isInteger(v)) return `${v}`;

    return value.toFixed(2);
};

/**
 * 
 * @param {number} value 
 * @return {number} 
 */
export const pureValue = value => {

    if (Number.isInteger(value)) return value;

    return Number(value.toFixed(2));
};

/**
 * 
 * @param {{x:number, y:number}} point 
 * @param {{x:number, y:number, width:number, height:number}} rect 
 */
export const pointInRect = ({ x, y }, rect) => {

    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;

    const horizontal = x >= rect.x && x <= right;
    const vertical = y >= rect.y && y <= bottom;

    return horizontal && vertical;
};

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @param {number} value 
 * @returns {number}
 */
export const clamp = (min, max, value) => {

    return Math.min(Math.max(value, min), max);
};

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @param {number} norm normalmente entre 0 e 1
 * @returns {number}
 */
export const lerp = (min, max, norm) => {

    return (max - min) * norm + min;
};

/**
 * 
 * @param {{x:number,y:number}} point 
 * @param {number} left 
 * @param {number} top 
 */
export const movePoint = (point, left, top) => {

    return {
        x: point.x + left,
        y: point.y + top,
    };
};

/**
 * 
 * @param {string} value 
 */
export const capitalize = value => {

    const headCapitalized = head(value).toUpperCase();

    return headCapitalized + value.substring(1);
};


export default {

    /**
     * Tambem remove outros caracteres como '(' ')' usado no 'Uncalled bet'
     * 
     * @param {string} value 
     * @returns {string}
     */
    removeMoney(value) {

        const approve = x => x >= 0 && x <= 9 || x === '.';

        return [...value].filter(approve).join('');
    },

    /**
     * 
     * @param {HTMLImageElement } image 
     * @param {number} row 
     * @param {number} width 
     * @param {number} height 
     * @returns {Promise<HTMLImageElement[]>}
     */
    async sprites(image, row, width, height) {

        View.canvasAux.width = width;
        View.canvasAux.height = height;

        const spriteCount = image.width / width;
        const y = row * height;

        const images = [...Array(spriteCount)].map((_, index) => {

            View.contextAux.clearRect(0, 0, width, height);

            View.contextAux.drawImage(image, -index * width, -y, image.width, image.height);

            const source = View.canvasAux.toDataURL('image/png');

            return new Promise((resolve, reject) => {

                const img = new Image();
                img.onload = () => resolve(img);
                img.src = source;
            });
        });

        return await Promise.all(images);
    },

    pointInRect,
    clamp,
    lerp,
    movePoint,
    capitalize,
    twoDecimalOrWhole,
    thousandSeparator
}