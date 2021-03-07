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
    constructor(view, { x, y, width, height }, state = states.normal, is3d = true) {

        // OPTIMIZE:: RECECER ULTIMOS PARAMENTROS COMO OBJECT (OPTIONS)
        view.embeddables.push(this);

        this.view = view;

        // No click, move 1 pixel para a sudeste
        this.is3d = is3d;

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

        if (state === states.disabled || state === states.hidden) return;

        this.isPressed = true;

        if (this.is3d === false) return;

        this.draw();
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

        this.state = states.hover;

        this.draw();

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                // NOTE:: Pode acontecer settar a `disabled` e estar `hover`
                const isEnabled = this.state !== states.disabled
                if (isEnabled) this.state = states.normal;
                this.isPressed = false;
                this.draw();

                clearInterval(inter);
            }

        }, 30);
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

        if (state === states.hidden) return;

        this.context.setTransform(1, 0, 0, 1, 0, 0);

        const { background } = this.view.images;

        if (this.is3d) {

            const outsize = this.isPressed ? 0 : 1;

            this.context.drawImage(background,
                this.x, this.y, this.width + outsize, this.height + outsize,
                this.x, this.y, this.width + outsize, this.height + outsize);
        }

        const x = this.x + (this.isPressed ? 1 : 0);
        const y = this.y + (this.isPressed ? 1 : 0);

        this.context.drawImage(this.images[state], x, y);
    }
}