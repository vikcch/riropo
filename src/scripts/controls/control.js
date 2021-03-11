import View from '@/scripts/view';
import fns from '../units/fns';

export default class Control {

    /**
     * 
     * @param { View } view 
     * @param {*} rect 
     * @param {boolean} [isScrollBar={}] Para testar o hover primeiro (hitMe)
     */
    constructor(view, rect, { isScrollBar } = {}) {

        this.view = view;
        this.context = view.context;

        const insertMethod = isScrollBar ? 'unshift' : 'push';
        view.embeddables[insertMethod](this);

        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;

        this.rect = rect;

        // TODO:: se tiver parent no fazer draw por embeddables,
        // o parente é quem chama o draw()
        // o find no controller tb precisa de outra opcção (set top layer)
    }

    hitMe(point) {

        return fns.pointInRect(point, this.rect);
    }

    click(point) {

        throw new Error('You have to implement the method click!');
    }

    mousedown() {

        throw new Error('You have to implement the method mousedown!');
    }

    hover() {

        throw new Error('You have to implement the method hover!');
    }

    draw() {

        throw new Error('You have to implement the method draw!');
    }

    // events mouse 



}