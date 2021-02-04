import Controller from "../controller";
import View from "../view";
import fns from "../units/fns";
import { buttonStates as states } from '@/scripts/units/enums'

export default class Button {

    /**
     * 
     * @param { View } view 
     * @param {*} param1 
     */
    constructor(view, { x, y, width, height }, state = states.normal) {

        view.embeddables.push(this);

        this.view = view;

        this.context = view.context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.handlers = {
            click: null
        };

        this.images = {
            normal: null,
            hover: null,
            disabled: null,
        };

        this.state = state;
        this.isPressed = false;
    }

    set setState(value) {

        this.state = value;
        this.draw();
    }

    bind(handlers) {

        this.handlers = { ...handlers };
    }

    mousedown() {

        const { state } = this;

        const { background } = this.view.images;

        this.context.drawImage(background,
            this.x, this.y, this.width, this.height,
            this.x, this.y, this.width, this.height);

        this.context.drawImage(this.images[state], this.x + 1, this.y + 1);

        this.isPressed = true;
    }

    click() {

        // Evitar mousedown fora do button e mouseup no button
        if (!this.isPressed) return;

        this.isPressed = false;

        this.handlers.click();
        this.draw();
    }

    hover() {

        if (this.state !== states.normal) return;

        this.context.drawImage(this.images.hover, this.x, this.y);

        this.state = states.hover;

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                this.state = states.normal;
                this.isPressed = false;
                this.draw();

                clearInterval(inter);
            }

        }, 30);

        console.log('dentro da class');
    }

    hitMe({ x, y }) {

        const right = this.x + this.width;
        const bottom = this.y + this.height;

        const horizontal = x >= this.x && x <= right;
        const vertical = y >= this.y && y <= bottom;

        return horizontal && vertical;
    }

    async setImages(image, { row }) {

        const keys = ['normal', 'hover', 'disabled'];

        const { width, height } = this;

        const images = await fns.sprites(image, row, width, height)

        images.forEach((v, i) => {

            const key = keys[i];

            this.images[key] = v;
        });

    }

    draw() {

        const { state } = this;

        const { background } = this.view.images;

        this.context.drawImage(background,
            this.x, this.y, this.width + 1, this.height + 1,
            this.x, this.y, this.width + 1, this.height + 1);
        this.context.drawImage(this.images[state], this.x, this.y);

    }
}