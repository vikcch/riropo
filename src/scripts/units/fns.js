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
    sprites(image, backSpot, target, width, height) {

        View.canvasAux.width = image.width;
        View.canvasAux.height = image.height;

        const spriteCount = image.width / width;
        const y = target * height;

        // NOTE:: Preciso repetir o `backSpot` e não posso aproveitar o 
        // map porque precisa ser "colado" antes do `drawImage`
        [...Array(spriteCount)].forEach((v, i) => {

            const x = i * width;
            View.contextAux.putImageData(backSpot, x, y);
        });

        View.contextAux.drawImage(image, 0, 0);

        return [...Array(spriteCount)].map((v, i) => {

            const x = i * width;
            return View.contextAux.getImageData(x, y, width, height);
        });

    }
}