import fns from '@/scripts/units/fns';
import View from '@/scripts/view';
import Controller from '@/scripts/controller';
import Button from './button';
import Control from "./control";
import { buttonStates } from '../units/enums';

export default class Sb extends Control {

    /**
     * 
     * @param { View } view 
     * @param {*} param1 
     */
    constructor(view, rect, parent) {

        const pureRect = {
            ...rect,
            x: rect.x + parent.x,
            y: rect.y + parent.y
        }

        super(view, pureRect, { isScrollBar: true });

        this.parent = parent;

        this.rows = {
            visible: 0, // Maximo de rows visiveis
            total: 0,
            offSet: 0,   // OffSetY se for 5, estão 5 items escondidos para cima
            maxHiddenRule: 8, // Apenas para controlar o tamanho de decremento
            //  do height da thumb, tamanhos possiveis da thumb (excluindo completa)
            get shown() {
                return Math.min(this.visible, this.total);
            }
        };

        this.createButtons();

        this.thumb = {
            x: 2,
            y: 0,
            width: 12,
            height: 40,
            minHeight: 20,
            maxHeight: this.height - 16 * 2,
            hover: false,
            pressed: false,
            diffStart: null
        };

        this.maxTrackAvailable = this.height - (16 * 2 + this.thumb.minHeight);
    }

    get hidden() {

        return this.rows.total <= this.rows.visible;
    }

    createButtons() {

        const buttonSize = { width: 16, height: 16 };

        const options = {
            state: buttonStates.normal,
            is3d: false
        };

        const upRect = { x: this.x, y: this.y, ...buttonSize };
        this.up = new Button(this.view, upRect, options);

        const ydownRect = this.y + this.height - 16;
        const downRect = { x: this.x, y: ydownRect, ...buttonSize };
        this.down = new Button(this.view, downRect, options);

        this.up.bind({ click: this.upClick });
        this.down.bind({ click: this.downClick });
    }

    async setImages() {

        await this.up.setImages(this.view.images.scrollbarButtons, { row: 0 });
        await this.down.setImages(this.view.images.scrollbarButtons, { row: 1 });
    }

    roolToTop() {

        this.rows.offSet = 0;
        this.thumb.y = 0;
    }

    updateRows({ visible, total }) {

        this.rows.visible = visible ?? this.rows.visible;
        this.rows.total = total ?? this.rows.total;
        this.rows.offSet = Math.max(this.rows.total - this.rows.visible, 0);

        this.ajustThumbSize();

        const state = this.hidden ? buttonStates.hidden : buttonStates.normal;
        this.up.state = state;
        this.down.state = state;
    }

    upClick = () => {

        this.rows.offSet = Math.max(--this.rows.offSet, 0);

        this.parent.draw();

        this.adjustThumbLocation();

        this.draw();
    }

    downClick = () => {

        const max = this.rows.total - this.rows.visible;

        this.rows.offSet = Math.min(++this.rows.offSet, max);

        this.adjustThumbLocation();

        this.parent.draw();
    }

    /**
     * Chamado por `updateRows`
     */
    ajustThumbSize() {

        const rowsHidden = this.rows.total - this.rows.visible;

        const ratioHidden = rowsHidden / this.rows.maxHiddenRule;

        const bareSize = this.maxTrackAvailable * (1 - ratioHidden);

        const { minHeight, maxHeight } = this.thumb;

        const size = Math.floor(bareSize + minHeight);

        this.thumb.height = fns.clamp(minHeight, maxHeight, size);
        this.thumb.y = this.height - 16 * 2 - this.thumb.height;
    }

    /**
     * Chamado pelos buttons da scrollbar ou `adjustRowsOffSet()` do parent
     * 
     * @example
     * trackAvailable = 70
     * hiddenCount = 14
     * hiddenRowsBefore = this.rows.offSet = 8
     * hiddenRowsAfter = 6
     * before = 8 * 70 / 14 => 40
     * after = 6 * 70 / 14 => 30 ('Não é preciso')
     * 
     */
    adjustThumbLocation() {

        const trackAvailable = this.height - 16 * 2 - this.thumb.height;

        const hiddenCount = this.rows.total - this.rows.visible;

        this.thumb.y = this.rows.offSet * trackAvailable / hiddenCount;
    }

    /**
     * Chamado pelo drag da thumb (hover)
     * 
     * @example
     * trackAvailable = 70
     * hiddenCount = 14
     * this.thumb.y = 40
     * this.rows.offSet = 40 * 14 / 70 => 8
     * 
     * @returns {boolean} offSet alterado
     */
    ajustOffSet() {

        const current = this.rows.offSet;

        const trackAvailable = this.height - 16 * 2 - this.thumb.height;

        const hiddenCount = this.rows.total - this.rows.visible;

        this.rows.offSet = Math.round(this.thumb.y * hiddenCount / trackAvailable);

        return current !== this.rows.offSet;
    }

    /**
     * Chamado pelo drag da thumb (hover)
     */
    checkThumbBoundaries() {

        const yMax = this.height - 16 * 2 - this.thumb.height;

        const failMax = this.thumb.y > yMax;

        const failMin = this.thumb.y < 0;

        const clamped = failMin || failMax;

        if (clamped) {

            this.thumb.y = fns.clamp(0, yMax, this.thumb.y);

            this.drawTrack();
            this.drawThumb();
        }
    }

    drawTrack() {

        if (this.hidden) return;

        const { x, y, width, height } = this;

        // NOTE:: Se usar stokeRect dá pau com o antialiased

        // Borda kind of
        this.context.fillStyle = '#cecece';
        this.context.fillRect(x, y + 16, width, height - 32);

        // Fundo
        this.context.fillStyle = '#e2e2e4';
        this.context.fillRect(x + 1, y + 17, width - 2, height - 34);
    }

    drawThumb({ hover } = {}) {

        if (this.hidden) return;

        this.context.save();
        this.context.translate(this.x, this.y + 16);

        const { x, y, width, height } = this.thumb;

        // borda kind of
        this.context.fillStyle = '#7c7c7c';
        this.context.fillRect(x, y, width, height);

        // Linear gradients are defined by an imaginary line which defines 
        // the direction of the gradient
        const gradient = this.context.createLinearGradient(3, 0, 13, 0);
        gradient.addColorStop(0, '#939393');
        gradient.addColorStop(1, '#666666');

        this.context.fillStyle = gradient;
        this.context.fillRect(x + 1, y + 1, width - 2, height - 2);

        // grip
        const yGrip = height / 2 - 1 + y;

        this.context.fillStyle = '#cecece';
        this.context.fillRect(5, yGrip - 4, 6, 2);
        this.context.fillRect(5, yGrip, 6, 2);
        this.context.fillRect(5, yGrip + 4, 6, 2);

        if (hover) {

            this.context.globalAlpha = 0.2;
            this.context.fillStyle = 'white';
            this.context.fillRect(x, y, width, height);
        }

        this.context.restore();
    }

    clearHover() {

        if (this.hidden) return;

        this.up.state = buttonStates.normal;
        this.down.state = buttonStates.normal;

        this.draw();
    }

    // #region Mandory Methods
    /**
     * @override
     */
    hitMe(point) {

        if (this.hidden) return false;

        // NOTE:: Caso não fizesse "hit" na thumb, ficaria vazio para acionar 
        // os buttons (usa find() no controller) que pertencem á scrollbar

        const pressedError = this.thumb.pressed ? 2500 : 0;

        const pureThumb = {
            x: this.x - pressedError,
            y: this.y + 16 + this.thumb.y - pressedError,
            width: 16 + pressedError * 2,
            height: this.thumb.height + pressedError * 2
        };

        return fns.pointInRect(point, pureThumb);
    }

    /**
     * @override
     */
    click(point) {

        this.thumb.pressed = false;
        this.thumb.diffStart = null;
    }

    /**
     * @override
     */
    mousedown(point) {

        this.thumb.pressed = true;

        this.thumb.diffStart = point.y - this.thumb.y;
    }

    hover(point) {

        if (this.thumb.pressed) {

            this.thumb.y = point.y - this.thumb.diffStart;

            this.checkThumbBoundaries();

            const offSetChanged = this.ajustOffSet();

            if (offSetChanged) this.parent.draw();
        }

        this.drawTrack();
        this.drawThumb({ hover: true });

        if (this.thumb.hover) return;

        this.thumb.hover = true;

        const inter = setInterval(() => {

            const mousePoint = Controller.mousePoint;

            if (!this.hitMe(mousePoint)) {

                this.thumb.hover = false;
                this.thumb.pressed = false;
                this.drawTrack();
                this.drawThumb();

                clearInterval(inter);
            }

        }, 30);
    }

    draw() {

        this.up.draw();
        this.drawTrack();
        this.drawThumb();
        this.down.draw();
    }

    // #endregion
}