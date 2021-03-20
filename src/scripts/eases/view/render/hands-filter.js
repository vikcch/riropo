import View from '@/scripts/view';
import render from '@/scripts/eases/view/render/index';

/**
 * 
 * @this {View}
 */
const drawBackground = function () {

    const { width, height } = render.rects.handFiltered;

    this.context.fillStyle = '#7e3100';
    this.context.fillRect(0, 0, width, height);
};


/**
 * 
 * @this {View}
 */
const drawTitle = function () {

    this.context.font = '10px Arial';
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#f6d37f';
    this.context.fillText('Hand Filtered', 8, 7);
};

/**
 * 
 * @this {View}
 * @param {string} handFiltered 
 */
const drawHandFiltered = function (handFiltered) {

    this.context.font = '22px consolas';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#f6d37f';
    this.context.fillText(handFiltered, 33, 28);
};

export default {

    /**
     * 
     * @this {View}
     * @param {string} handFiltered
     */
    render(handFiltered) {

        if (!handFiltered) return;

        const { x, y } = render.rects.handFiltered;

        this.context.setTransform(1, 0, 0, 1, x, y);

        drawBackground.call(this);

        drawTitle.call(this);

        drawHandFiltered.call(this, handFiltered);
    }
};