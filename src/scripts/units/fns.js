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



export default {

    /**
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

}