import View from '@/scripts/view';
import { MainInfoT } from '@/scripts/units/main-info';
import render from '@/scripts/eases/view/render/index';

const font = '12px Arial';
const labelColor = 'white';
const textColor = 'Khaki';

/**
 * 
 * @this {View}
 */
const drawBackground = function () {

    const { width, height } = render.rects.mainInfo;

    this.context.fillStyle = '#333333';
    this.context.fillRect(0, 0, width, height);
};

const drawBackgroundItem = function (label, text, point) {

    const { height: mainInfoHeight } = render.rects.mainInfo;

    const labelWidth = this.context.measureText(label).width + 2;
    const textWidth = this.context.measureText(text).width + 2;

    const width = labelWidth + textWidth;
    const height = mainInfoHeight / 2 - 2;
    const x = point.x - labelWidth;
    const y = point.y - height / 2

    this.context.fillStyle = '#333333';
    this.context.fillRect(x, y, width, height);
};

/**
 * 
 * @this {View}
 * @param {string} label 
 * @param {string} text 
 * @param {{x:number,y:number}} point 
 */
const drawItem = function (label, text, point) {

    this.context.font = font;
    this.context.textBaseline = 'middle';

    drawBackgroundItem.call(this, label, text, point);

    this.context.fillStyle = labelColor;
    this.context.textAlign = 'right';
    this.context.fillText(label, point.x - 1, point.y);

    this.context.fillStyle = textColor;
    this.context.textAlign = 'left';
    this.context.fillText(text, point.x + 1, point.y);
};

/**
 * 
 * @this {View}
 * @param {MainInfoT} mainInfo
 * @param {{x:number,y:number}} point 
 */
const drawHandIdAndProgress = function (mainInfo, point) {

    this.context.font = font;
    this.context.textBaseline = 'middle';

    drawBackgroundItem.call(this, 'Hand:', mainInfo.handId, point);

    this.context.fillStyle = labelColor;
    this.context.textAlign = 'right';
    this.context.fillText('Hand:', point.x - 1, point.y);

    this.context.fillStyle = textColor;
    this.context.textAlign = 'left';
    this.context.fillText(mainInfo.handId, point.x + 1, point.y);

    const measure = this.context.measureText(mainInfo.handId);
    this.context.fillStyle = 'LightPink';

    const { current, count } = mainInfo.sessionProgress;
    const progressText = `(${current} / ${count})`
    this.context.fillText(progressText, point.x + measure.width + 4, point.y);
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

        const xs = [50, 180, 330, 520];

        drawItem.call(this, 'Room:', mainInfo.room, { x: xs[0], y: height * .25 });
        drawItem.call(this, 'Date:', mainInfo.date, { x: xs[0], y: height * .75 });

        drawItem.call(this, 'Game:', mainInfo.game, { x: xs[1], y: height * .25 });

        const stakesLabel = mainInfo.isTournament ? 'Buy-In:' : 'Stakes:';
        drawItem.call(this, stakesLabel, mainInfo.stakes, { x: xs[1], y: height * .75 });

        drawHandIdAndProgress.call(this, mainInfo, { x: xs[2], y: height * .25 });

        drawItem.call(this, 'Table:', mainInfo.tableName, { x: xs[2], y: height * .75 });

        drawItem.call(this, 'Blinds:', mainInfo.blinds, { x: xs[3], y: height * .25 });
    }
};