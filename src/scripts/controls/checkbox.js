import View from '@/scripts/view';
import Control from './control';
import Controller from "../controller";
import { checkBoxStates } from '@/scripts/units/enums';


export default class CheckBox extends Control {

    /**
     * 
     * @param { View } view 
     * @param {*} param1 
     */
    constructor(view, rect, text) {

        rect.width = CheckBox.getWidth(view.context, text);

        super(view, rect);

        this.state = checkBoxStates.normal;

        this.checked = false;
        this.text = text;

        this.handlers = {
            click: null
        };
    }

    setImage() {

        // NOTE:: Fora do construtor porque o fundo da mesa não está carregado

        const { x, y, width, height } = this.rect;

        this.background = this.view.context.getImageData(x, y, width, height);
    }

    bind(handlers) {

        this.handlers = { ...handlers };
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {string} text 
     */
    static getWidth(context, text) {

        context.font = '11px Arial';

        return context.measureText(text).width + 14 + 4;
    }

    // #region Mandory Methods

    /**
     * @override
     */
    click() {

        this.checked = !this.checked;

        this.handlers.click();

        this.draw();
    }

    /**
     * @override
     */
    mousedown(point) { }

    hover(point) {

        if (this.state === checkBoxStates.hover) return;

        this.state = 'hover';

        this.draw();

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                this.state = checkBoxStates.normal;
                this.draw();

                clearInterval(inter);
            }

        }, 30);
    }

    draw() {

        const drawBox = () => {

            this.context.fillStyle = 'black';
            this.context.fillRect(this.x, this.y, 14, 14);

            this.context.fillStyle = 'white';
            this.context.fillRect(this.x + 2, this.y + 2, 10, 10);
        };

        const drawHover = () => {

            if (this.state !== checkBoxStates.hover) return;

            this.context.globalAlpha = .2;

            this.context.fillStyle = 'black';
            this.context.fillRect(this.x, this.y, 14, 14);

            this.context.globalAlpha = 1;
        };

        const drawCheckMark = () => {

            if (!this.checked) return;

            this.context.strokeStyle = 'black';
            this.context.lineWidth = 2;
            this.context.beginPath();
            this.context.moveTo(this.x + 4, this.y + 6);
            this.context.lineTo(this.x + 6, this.y + 9);
            this.context.lineTo(this.x + 10, this.y + 4);
            this.context.stroke();
        };

        const drawLabel = () => {

            this.context.font = '11px Arial';
            this.context.textAlign = 'left';
            this.context.textBaseline = 'middle';
            this.context.fillStyle = '#ffffe1';
            this.context.fillText(this.text, this.x + 18, this.y + 8);
        };


        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.putImageData(this.background, this.x, this.y);

        drawBox();
        drawHover();
        drawCheckMark();
        drawLabel();
    }

    // #endregion
}