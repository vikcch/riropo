import easeRender from '@/scripts/eases/view/render/index'
import { profitColor } from '@/scripts/units/enums';

/**
 * 
 * @this {View}
 * @param {*} fromView Não tem `setTransform`
 */
export const poweredBy = function ({ fromView } = {}) {

    this.context.font = '14px Arial';

    const textLight = 'Winning Poker HUD';
    const textDark = 'Powered by';

    const textLightWidth = this.context.measureText(textLight).width;

    const { table: tableRect } = easeRender.rects;

    const x = tableRect.width - (textLightWidth + 12) + (fromView ? tableRect.x : 0);
    const y = 12 + (fromView ? tableRect.y : 0);

    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';
    this.context.textAlign = 'right';
    this.context.fillText(textDark, x - 1, y);

    this.context.textAlign = 'left';
    this.context.fillStyle = '#ffffe1';
    this.context.fillText(textLight, x + 1, y);
};

/**
 * @this {View}
 */
const legend = function () {

    const x = 3, y = 376, width = 72, height = 40;

    this.context.fillStyle = '#f6d37f';
    this.context.fillRect(x, y, width, height);
    this.context.fillStyle = '#7e3100';
    this.context.fillRect(x + 1, y + 1, width - 2, height - 2);

    this.context.fillStyle = profitColor.smallWin;
    this.context.fillRect(x + 3, y + 3, 10, 10);
    this.context.fillStyle = profitColor.smallLose;
    this.context.fillRect(x + 15, y + 3, 10, 10);

    this.context.fillStyle = profitColor.mediumWin;
    this.context.fillRect(x + 3, y + 15, 10, 10);
    this.context.fillStyle = profitColor.mediumLose;
    this.context.fillRect(x + 15, y + 15, 10, 10);

    this.context.fillStyle = profitColor.bigWin;
    this.context.fillRect(x + 3, y + 27, 10, 10);
    this.context.fillStyle = profitColor.bigLose;
    this.context.fillRect(x + 15, y + 27, 10, 10);

    this.context.font = '9px Arial';
    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#f6d37f';

    this.context.fillText('2-10 BB', x + 30, y + 8);
    this.context.fillText('10-20 BB', x + 30, y + 20);
    this.context.fillText('20+ BB', x + 30, y + 32);
};

const version = function () {

    const x = 3, y = 366;

    this.context.font = '11px consolas';

    const text = '';

    this.context.textAlign = 'left';
    this.context.fillStyle = '#ffffe1';
    this.context.fillText(text, x, y);
};

export default function () {

    const { table: tableRect, logo } = easeRender.rects;

    const { width, height } = this.canvas;

    this.context.setTransform(1, 0, 0, 1, tableRect.x, tableRect.y);

    this.context.clearRect(0, 0, width, height);

    this.context.drawImage(this.images.background, 0, 0);

    this.context.drawImage(this.images.logo, logo.x, logo.y);

    poweredBy.call(this);

    legend.call(this);

    version.call(this);
}