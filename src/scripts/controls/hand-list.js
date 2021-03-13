import View from '@/scripts/view';
import Controller from '@/scripts/controller';
import biz from '../units/biz';
import Control from './control';
import Scrollbar from './scrollbar';

export default class HandsList extends Control {

    /**
     * 
     * @param { View } view 
     * @param {*} rect 
     */
    constructor(view, rect) {

        super(view, rect);

        this.list = [];

        this.itemHeight = 25;

        this.handlers = {
            click: null
        };

        this.hoverIndexFixed = -1;

        this.createScrollbar();
    }

    async setImage() {

        // TODO:: maxHiddenRule da scrollbar maior... receber por paremetro

        await this.scrollbar.setImages();
    }

    createScrollbar() {

        const rect = { x: 80, y: 0, width: 16, height: this.rect.height };

        this.scrollbar = new Scrollbar(this.view, rect, this);

        this.scrollbar.updateRows({ visible: 22 });
    }

    bind(handlers) {

        this.handlers = { ...handlers };
    }

    unpressScrollBar() {

        this.scrollbar.thumb.pressed = false;
    }

    /**
     * 
     * @param {string|string[]} value 
     */
    add(value) {

        this.list.push(value);

        this.scrollbar.updateRows({ total: this.list.length });

        this.draw();
    }

    /**
     * 
     * @param {string[]} values 
     */
    addRange(values) {

        this.list.push(...values);

        this.scrollbar.updateRows({ total: this.list.length });

        this.scrollbar.roolToTop();

        this.draw();
    }

    removeAll() {

        this.list = [];

        this.scrollbar.updateRows({ total: 0 });

        this.draw();
    }

    drawBackgroundItem(profitBBs, itemRect) {

        const { x, y, width, height } = itemRect;

        this.context.fillStyle = biz.getColorScale(profitBBs);
        this.context.fillRect(x, y + 1, width, height);
    }

    drawCards(cards, itemRect) {

        cards.forEach((strCard, index) => {

            const cardIndex = biz.getCardIndex(strCard);

            const card = this.view.images.smallDeck[cardIndex.suit][cardIndex.value];

            const y = itemRect.y + 3;

            this.context.drawImage(card, 2 + index * 18, y);
        });
    }

    drawSeparator(itemRect) {

        this.context.fillStyle = 'black';

        const bottom = itemRect.y + itemRect.height;

        this.context.fillRect(0, bottom, this.width, 1);
    }

    drawDealer(isButton, itemRect) {

        if (!isButton) return;

        const { dealer } = this.view.images;

        const scale = .75;

        const dWidth = dealer.width * scale;
        const dHeight = dealer.height * scale;

        const y = itemRect.y + (itemRect.height - dHeight) / 2;

        this.context.drawImage(dealer,
            0, 0, dealer.width, dealer.height,
            62, y, dWidth, dHeight);
    }

    drawHover() {

        // TODO:: ir buscar os valores (2 ultimos)
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        this.context.fillStyle = 'white';
        this.context.globalAlpha = .3;

        const y = this.hoverIndexFixed * this.itemHeight;
        const width = this.width - (this.scrollbar.hidden ? 0 : 16);

        this.context.fillRect(0, y, width, this.itemHeight);
        this.context.globalAlpha = 1;
    };

    cleanToolTip() {

        const { width, height } = this.view.canvasToolTip;
        const { contextToolTip: ctxToolTip } = this.view;

        ctxToolTip.clearRect(0, 0, width, height);
    }

    drawToolTip(mousePoint) {

        const { contextToolTip: ctxToolTip } = this.view;

        const itemIndex = this.scrollbar.rows.index + this.hoverIndexFixed;

        const item = this.list[itemIndex];

        this.cleanToolTip();

        const padding = 4;
        const space = 10;

        const position = `[${item.position}]`;

        // TODO:: format separador de milhares
        const profit = item.profit;

        // TODO:: format separador de milhares
        const profitBBs = `(${item.profitBBs} BBs)`;

        const { blinds } = item;

        ctxToolTip.font = '12px Arial';
        const positionMeasure = ctxToolTip.measureText(position);
        const profitMeasure = ctxToolTip.measureText(profit);
        const profitBBsMeasure = ctxToolTip.measureText(profitBBs);

        ctxToolTip.font = '10px Arial';
        const measureBottom = ctxToolTip.measureText(blinds);

        const topWidth = positionMeasure.width + profitMeasure.width +
            profitBBsMeasure.width + padding * 2 + space * 2;

        const width = Math.max(topWidth, measureBottom.width + padding * 2);
        const height = 36;

        const x = mousePoint.x + 20;
        const y = Math.min(mousePoint.y + 20, this.height - height);

        ctxToolTip.textBaseline = 'middle';
        ctxToolTip.fillStyle = 'black';
        ctxToolTip.fillRect(x, y, width, height);

        ctxToolTip.fillStyle = '#ffffe1';
        ctxToolTip.fillRect(x + 1, y + 1, width - 2, height - 2);

        ctxToolTip.font = '12px Arial';
        ctxToolTip.fillStyle = 'black';
        const xPosition = x + padding;
        ctxToolTip.fillText(position, xPosition, y + height * .25);

        ctxToolTip.fillStyle = biz.getColorScale(item.profitBBs);
        const xProfit = xPosition + positionMeasure.width + space;
        ctxToolTip.fillText(profit, xProfit, y + height * .25);

        ctxToolTip.fillStyle = 'black';
        const xProfitBBs = xProfit + profitMeasure.width + space;
        ctxToolTip.fillText(profitBBs, xProfitBBs, y + height * .25);

        ctxToolTip.font = '10px Arial';
        ctxToolTip.fillStyle = 'gray';
        ctxToolTip.fillText(blinds, x + padding, y + height * .75);
    }

    clearHover() {

        this.hoverIndexFixed = -1;
        this.draw();
        this.cleanToolTip();
    };

    // #region Mandory Methods
    /**
     * @override
     */
    click(mousePoint) {

        const itemIndexFixed = Math.floor(mousePoint.y / this.itemHeight);

        const itemIndex = this.scrollbar.rows.index + itemIndexFixed;

        if (itemIndex >= this.list.length) return;

        this.handlers.click(itemIndex);

        console.log(this.list[itemIndex]);
    }

    /**
     * @override
     */
    mousedown() { }

    /**
     * @override
     */
    hover(mousePoint) {

        const itemIndexFixed = Math.floor(mousePoint.y / this.itemHeight);

        const isBelowLastItem = itemIndexFixed >= this.scrollbar.rows.shown;

        if (isBelowLastItem) {

            // Evita que desenhe sempre que está abaixo dos items
            if (this.hoverIndexFixed === -1) return;

            this.clearHover();

            return;
        }

        if (itemIndexFixed === this.hoverIndexFixed) return;

        this.hoverIndexFixed = itemIndexFixed;

        this.draw();

        this.drawHover();

        this.drawToolTip(mousePoint);

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                this.clearHover();

                clearInterval(inter);
            }

        }, 30);
    }

    /**
     * @override
     * @param {{x:number, y:number}} point 
     */
    hitMe({ x, y }) {

        const right = this.x + this.width - this.scrollbar.width;
        const bottom = this.y + this.height;

        const horizontal = x >= this.x && x <= right;
        const vertical = y >= this.y && y <= bottom;

        return horizontal && vertical;
    }

    /**
     * @override
     */
    draw() {

        // TODO:: ir buscar os valores (2 ultimos)
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.width, this.height);

        const start = this.scrollbar.hidden ? 0 : this.scrollbar.rows.index;

        const { visible: visibleRowsCount } = this.scrollbar.rows;

        const targetItens = this.list.slice(start, start + visibleRowsCount);

        targetItens.forEach((item, i) => {

            const itemRect = {
                x: 0,
                y: this.itemHeight * i,
                width: this.width,
                height: this.itemHeight
            };

            this.drawBackgroundItem(item.profitBBs, itemRect);

            this.drawCards(item.holeCards, itemRect);

            this.drawDealer(item.isButton, itemRect);

            this.drawSeparator(itemRect);
        });

        this.scrollbar.draw();
    }

    // #endregion
}