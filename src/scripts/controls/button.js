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
            click: null
        };

        this.images = {
            normal: null,
            hover: null,
            disabled: null,
            backSpot: {
                regular: null, // para usar em mousedown
                mousedown: null, // para usar em normal
            }
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

        const { regular } = this.images.backSpot;

        this.context.putImageData(regular, this.x, this.y);
        this.context.putImageData(this.images[state], this.x + 1, this.y + 1);

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

        this.context.putImageData(this.images.hover, this.x, this.y);

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

    setImages(image, { row }) {

        const keys = ['normal', 'hover', 'disabled'];

        // NOTE:: Dentro de `sprites`, se a imagem tiver transparencia
        // o `getImageData` captura o background do body, e quando faço
        // `putImageData` ele aparece

        const { x, y, width, height } = this;

        const regular = this.context.getImageData(x, y, width, height);
        const mousedown = this.context.getImageData(x + 1, y + 1, width, height);

        this.images.backSpot = { regular, mousedown };

        fns.sprites(image, regular, row, width, height).forEach((v, i) => {

            const key = keys[i];

            this.images[key] = v;
        });
    }

    draw() {

        const { state } = this;

        const { mousedown } = this.images.backSpot;

        this.context.putImageData(mousedown, this.x + 1, this.y + 1);
        this.context.putImageData(this.images[state], this.x, this.y);
    }
}