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

        this.context = view.context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.handlers = {
            click: null,
            hover: null
        };

        this.images = {
            normal: null,
            hover: null,
            disabled: null
        };

        this.state = state;
    }

    set setState(value) {

        this.state = value;
        this.draw();
    }

    bind(handlers) {

        this.handlers = { ...handlers };
    }

    click() {

        this.handlers.click();
    }

    hover() {

        if (this.state !== states.normal) return;

        this.context.putImageData(this.images.hover, this.x, this.y);

        this.state = states.hover;

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                this.context.putImageData(this.images.normal, this.x, this.y);
                this.state = states.normal;
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

    setImages(image, { row }) {

        const keys = ['normal', 'hover', 'disabled'];

        // NOTE:: Dentro de `sprites`, se a imagem tiver transparencia
        // o `getImageData` captura o background do body, e quando faço
        // `putImageData` ele aparece
        const backSpot = this.context.getImageData(this.x, this.y, this.width, this.height);

        fns.sprites(image, backSpot, row, this.width, this.height).forEach((v, i) => {

            const key = keys[i];

            this.images[key] = v;
        });
    }

    draw() {

        const { state } = this;

        this.context.putImageData(this.images[state], this.x, this.y);
    }
}