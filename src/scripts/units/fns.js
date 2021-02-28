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

// TODO:: separador de milhares e moeda em cash
export const displayValue = value => {

    if (Number.isInteger(value)) return value;

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

    // TODO:: JSDOCS
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
    capitalize
}