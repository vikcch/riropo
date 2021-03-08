import View from '@/scripts/view';
import { MainInfoT } from '@/scripts/units/main-info';
import render from '@/scripts/eases/view/render/index';

/**
 * 
 * @this {View}
 */
const drawBackground = function () {

    const { width, height } = render.rects.mainInfo;

    this.context.fillStyle = '#333333';
    this.context.fillRect(0, 0, width, height);
};

/**
 * 
 * @this {View}
 * @param {string} label 
 * @param {string} text 
 * @param {{x:number,y:number}} point 
 */
const drawItem = function (label, text, point) {

    this.context.font = '12px Arial';
    this.context.textBaseline = 'middle';

    this.context.fillStyle = 'LightPink';
    this.context.textAlign = 'right';
    this.context.fillText(label, point.x - 1, point.y);

    this.context.fillStyle = 'Khaki';
    this.context.textAlign = 'left';
    this.context.fillText(text, point.x + 1, point.y);
};


export default {

    /**
     * 
     * @this {View}
     * @param {MainInfoT} [mainInfo=null]
     */
    render(mainInfo) {

        if (!mainInfo) return;

        const { x, y, height } = render.rects.mainInfo;

        this.context.setTransform(1, 0, 0, 1, x, y);

        drawBackground.call(this);

        drawItem.call(this, 'Room:', mainInfo.room, { x: 50, y: height * .25 });
        drawItem.call(this, 'Date:', mainInfo.date, { x: 50, y: height * .75 });

        drawItem.call(this, 'Game:', mainInfo.game, { x: 180, y: height * .25 });

        const stakesLabel = mainInfo.isTournament ? 'Buy-In:' : 'Stakes:';
        drawItem.call(this, stakesLabel, mainInfo.stakes, { x: 180, y: height * .75 });

        drawItem.call(this, 'Hand:', mainInfo.handId, { x: 330, y: height * .25 });
        drawItem.call(this, 'Table:', mainInfo.tableName, { x: 330, y: height * .75 });

        drawItem.call(this, 'Blinds:', mainInfo.blinds, { x: 500, y: height * .25 });

        // OPTIMIZE:: decidir onde meter isto
        const progressText = `${mainInfo.sessionProgress.current} / ${mainInfo.sessionProgress.count}`;
        drawItem.call(this, 'Progress:', progressText, { x: 500, y: height * .75 });
    }
};