import View from '@/scripts/view';
import Control from './control';
import Scrollbar from './scrollbar';

export default class Chat extends Control {

    /**
     * 
     * @param { View } view 
     * @param {*} rect 
     */
    constructor(view, rect) {

        super(view, rect);

        this.list = [];

        this.image = null;

        this.itemHeight = 90 / 6;

        this.createScrollbar();
    }

    async setImage(image) {

        await this.scrollbar.setImages();

        this.image = image;
    }

    createScrollbar() {

        const rect = { x: 306, y: 13, width: 16, height: 90 };

        this.scrollbar = new Scrollbar(this.view, rect, this);

        this.scrollbar.updateRows({ visible: 6 });
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

    remove() {

        this.list.pop();

        this.scrollbar.updateRows({ total: this.list.length });

        this.draw();
    }

    removeAll() {

        this.list = [];

        this.scrollbar.updateRows({ total: 0 });

        this.draw();
    }

    // #region Mandory Methods
    /**
     * @override
     */
    click() { }

    /**
     * @override
     */
    mousedown() { }

    /**
     * @override
     */
    hover() {

        console.log('hover chat');
    }

    /**
     * @override
     * @param {{x:number, y:number}} point 
     */
    hitMe({ x, y }) {

        // 50 => desconto da scrollbar mais a margem de erro (pressedError)
        const right = this.x + this.width - 50;
        const bottom = this.y + this.height;

        const horizontal = x >= this.x && x <= right;
        const vertical = y >= this.y && y <= bottom;

        return horizontal && vertical;
    }

    /**
     * @override
     */
    draw() {

        this.context.drawImage(this.image, this.x, this.y);

        const start = this.scrollbar.hidden ? 0 : this.scrollbar.rows.index;

        const targetItens = this.list.slice(start, start + 6)

        this.context.textAlign = 'start';
        this.context.textBaseline = 'middle';

        targetItens.forEach((v, i) => {

            const x = this.x + 12;
            const y = this.y + 7 + 15 * (i + 1);

            if (i % 2 == 0) {

                this.context.fillStyle = '#eee6c3';
                this.context.fillRect(this.x + 7, y - 9, 315, 15);
            }

            this.context.fillStyle = 'black';
            this.context.fillText(v, x, y);
        });

        this.scrollbar.draw();
    }

    // #endregion
}