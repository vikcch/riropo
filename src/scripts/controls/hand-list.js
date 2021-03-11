import View from '@/scripts/view';
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

        this.draw();
    }

    removeAll() {

        this.list = [];

        this.scrollbar.updateRows({ total: 0 });

        this.draw();
    }

    drawCards(cards, itemRect) {

        cards.forEach((strCard, index) => {

            const cardIndex = biz.getCardIndex(strCard);

            const card = this.view.images.smallDeck[cardIndex.suit][cardIndex.value];

            const y = itemRect.y + 3;

            this.context.drawImage(card, index * 18, y);
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

    // #region Mandory Methods
    /**
     * @override
     */
    click(mousePoint) {

        const itemIndexFixed = Math.floor(mousePoint.y / this.itemHeight);

        const itemIndex = this.scrollbar.rows.index + itemIndexFixed;

        if (itemIndex >= this.list.length) return;

        this.handlers.click(itemIndex);
    }

    /**
     * @override
     */
    mousedown() { }

    /**
     * @override
     */
    hover() { }

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

        targetItens.forEach((v, i) => {

            const itemRect = {
                x: 0,
                y: this.itemHeight * i,
                width: this.width,
                height: this.itemHeight
            };

            this.drawCards(v.holeCards, itemRect);

            this.drawDealer(v.isButton, itemRect);

            this.drawSeparator(itemRect);
        });

        this.scrollbar.draw();
    }

    // #endregion
}