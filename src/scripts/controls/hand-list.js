import View from '@/scripts/view';
import Controller from '@/scripts/controller';
import biz from '../units/biz';
import Control from './control';
import Scrollbar from './scrollbar';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';
import { pipe } from '../units/fxnl';
import { head, pureValue, thousandSeparator, twoDecimalOrWhole } from '../units/fns';

export default class HandsList extends Control {

    /**
     * 
     * @param { View } view 
     * @param {*} rect 
     */
    constructor(view, rect) {

        super(view, rect);

        this.list = [];
        this.fullList = [];

        this.itemHeight = 25;

        this.handlers = {
            click: null,
            tracker: null
        };

        this.hoverIndexFixed = -1;

        this.createScrollbar();
    }

    get listItemIndex() {

        const fullListHandIndex = this.handlers.tracker.hand;

        return this.list.findIndex(v => v.handIndex === fullListHandIndex);
    }

    async setImage() {

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
     * @param {object[]} values 
     */
    setRange(values) {

        this.fullList = values.map((v, i) => ({ handIndex: i, ...v }));

        this.list = this.fullList.slice();

        this.scrollbar.updateRows({ total: this.list.length });

        this.scrollbar.roolToTop();

        this.draw();
    }

    removeAll() {

        this.list = [];

        this.scrollbar.updateRows({ total: 0 });

        this.draw();
    }

    /**
     * 
     * @returns {undefined|string} Ex: "AK" 
     */
    filterItems() {

        const getInput = () => {

            const cardsCount = head(this.fullList).holeCards.length;

            const cardsExample = cardsCount === 2 ? 'AK TT 56' : '98JT';

            const message = `Enter a Hand\n\nEg: ${cardsExample}`;

            const input = prompt(message, 'AA');

            if (input === null) return;

            if (input.trim().length !== cardsCount) return;

            return [...input.toUpperCase()];
        };

        const setList = cardsInput => {

            this.list = this.fullList.filter(item => {

                const values = item.holeCards.map(([v]) => v);

                cardsInput.forEach(c => {

                    const index = values.indexOf(c);

                    if (index !== -1) values.splice(index, 1);
                });

                return !values.length;
            });
        };

        const cardsInput = getInput();

        if (!cardsInput) return;

        setList(cardsInput);

        if (this.list.length === 0) {

            this.list = this.fullList.slice();
            return;
        }

        this.scrollbar.updateRows({ total: this.list.length });

        this.setMaxHiddenRule();

        const { handIndex } = this.list[0];

        this.handlers.click(handIndex);

        this.draw();

        return cardsInput.join('');
    }

    clearFilter() {

        this.list = this.fullList.slice();

        this.scrollbar.updateRows({ total: this.list.length });

        this.setMaxHiddenRule();

        const { handIndex } = this.list[0];

        this.handlers.click(handIndex);

        this.draw();
    }

    setMaxHiddenRule() {

        const value = Math.floor(this.list.length * 1.1);

        this.scrollbar.rows.maxHiddenRule = value;

        this.scrollbar.ajustThumbSize();

        this.scrollbar.roolToTop();
    }

    /**
     * Obriga a manter 4 ou 5 itens no inicio e fim da lista  
     * Chamado inicialmente pelos buttons de navegaçao
     */
    adjustRowsOffSet() {

        const { offSet: rowsOffSet, visible: rowsVisible, total: rowsTotal }
            = this.scrollbar.rows;

        if (rowsOffSet !== 0 && this.listItemIndex < rowsOffSet + 5) {

            this.scrollbar.rows.offSet = Math.max(0, this.listItemIndex - 5);
        }

        const hasMoreRows = rowsOffSet + rowsVisible < rowsTotal;

        if (hasMoreRows && this.listItemIndex > rowsOffSet + rowsVisible - 5) {

            const value = this.listItemIndex - (rowsVisible - 5);
            const maxRowOffSet = this.list.length - rowsVisible;
            this.scrollbar.rows.offSet = Math.min(maxRowOffSet, value);
        }

        this.scrollbar.adjustThumbLocation();
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
        })
    }

    drawMarker() {

        if (this.listItemIndex === null) return;

        const x = 0;
        const width = this.scrollbar.hidden ? this.width : this.width - 16;
        const height = this.itemHeight;


        const y = (this.listItemIndex - this.scrollbar.rows.offSet) * height;

        const offBoundaries = y < 0 || y >= this.scrollbar.rows.visible * height;
        if (offBoundaries) return;

        this.context.fillStyle = 'yellow';
        this.context.globalAlpha = .15;
        this.context.fillRect(x, y, width, height);
        this.context.globalAlpha = 1;

        this.context.fillStyle = 'red';
        this.context.fillRect(x, y, width, 2);
        this.context.fillRect(x, y + height - 1, width, 2);
        this.context.fillRect(x, y, 2, height);
        this.context.fillRect(width - 2, y, 2, height);
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

        const { handsList: handsListRect } = embeddedRects;

        this.context.setTransform(1, 0, 0, 1, handsListRect.x, handsListRect.y);

        this.context.fillStyle = 'white';
        this.context.globalAlpha = .3;

        const y = this.hoverIndexFixed * this.itemHeight;
        const width = this.width - (this.scrollbar.hidden ? 0 : 16);

        this.context.fillRect(0, y, width, this.itemHeight);
        this.context.globalAlpha = 1;
    }

    cleanToolTip() {

        const { width, height } = this.view.canvasToolTip;
        const { contextToolTip: ctxToolTip } = this.view;

        ctxToolTip.clearRect(0, 0, width, height);
    }

    drawToolTip(mousePoint) {

        const { contextToolTip: ctxToolTip } = this.view;

        const itemIndex = this.scrollbar.rows.offSet + this.hoverIndexFixed;

        const item = this.list[itemIndex];

        this.cleanToolTip();

        const padding = 4;
        const space = 10;

        const position = `[${item.position}]`;

        const profit = `${item.cashSign} ${pipe(twoDecimalOrWhole, thousandSeparator)(item.profit)}`;

        const profitBBs = `(${pipe(pureValue, thousandSeparator)(item.profitBBs)} BBs)`;

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
        this.scrollbar.clearHover();
        this.draw();
        this.cleanToolTip();
    }

    // #region Mandory Methods
    /**
     * @override
     */
    click(mousePoint) {

        const itemIndexFixed = Math.floor(mousePoint.y / this.itemHeight);

        const itemIndex = this.scrollbar.rows.offSet + itemIndexFixed;

        if (itemIndex >= this.list.length) return;

        const { handIndex } = this.list[itemIndex];

        this.handlers.click(handIndex);

        this.drawMarker();
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

        const scrollbarWidth = this.scrollbar.hidden ? 0 : this.scrollbar.width;

        const right = this.x + this.width - scrollbarWidth;
        const bottom = this.y + this.height;

        const horizontal = x >= this.x && x <= right;
        const vertical = y >= this.y && y <= bottom;

        return horizontal && vertical;
    }

    /**
     * @override
     */
    draw() {

        const { handsList: handsListRect } = embeddedRects;

        this.context.setTransform(1, 0, 0, 1, handsListRect.x, handsListRect.y);
        this.context.clearRect(0, 0, this.width, this.height);

        const start = this.scrollbar.hidden ? 0 : this.scrollbar.rows.offSet;

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

        this.drawMarker();

        this.scrollbar.draw();
    }

    // #endregion
}