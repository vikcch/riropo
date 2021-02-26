import Button from "./controls/button";
import ease from '@/scripts/eases/view/index';
import { HistoryT } from '@/scripts/units/history';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';
import enums, { buttonStates } from '@/scripts/units/enums';
import Chat from "./controls/chat";

export default class View {

    static canvasAux = document.createElement('canvas');
    static contextAux = View.canvasAux.getContext('2d');

    constructor() {

        this.coordsDiv = document.querySelector('#mouse-coords');

        this.loadHH = document.querySelector('#load-hand-history');

        /** @type {HTMLCanvasElement} */
        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 792;
        this.canvas.height = 555;

        this.embeddables = [];
        this.createEmbeddedControls();

        this.images = {};
        this.setImages();

        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(500, 100);
        this.context.stroke();

        // intervals em table
        this.inter = null;
    }

    async setImages() {

        try {

            this.images = await ease.loadImages();

            await this.setEmbeddedControlsImages();

            this.embeddables.forEach(x => x.draw());

        } catch (error) {

            console.log(error);
        }
    }

    async setEmbeddedControlsImages() {

        this.context.drawImage(this.images.background, 0, 0);

        await this.previousHand.setImages(this.images.navigation, { row: 0 })
        await this.previousAction.setImages(this.images.navigation, { row: 1 });
        await this.play.setImages(this.images.navigation, { row: 2 });
        await this.nextAction.setImages(this.images.navigation, { row: 3 });
        await this.nextHand.setImages(this.images.navigation, { row: 4 });

        await this.chat.setImage(this.images.chat);
    }

    createEmbeddedControls() {

        const { navigation: rect } = embeddedRects;

        const { disabled } = buttonStates;

        this.previousHand = new Button(this, rect.previousHand, disabled);
        this.previousAction = new Button(this, rect.previousAction, disabled);
        this.play = new Button(this, rect.play);
        this.nextAction = new Button(this, rect.nextAction, disabled);
        this.nextHand = new Button(this, rect.nextHand, disabled);

        const { chat: chatRect } = embeddedRects;

        this.chat = new Chat(this, chatRect);



    }

    bindControls(handlers) {

        this.loadHH.addEventListener('change', handlers.loadHandHistory);
        this.canvas.addEventListener('mousemove', handlers.canvasMouseMove);

        // this.coordsDiv.innerHTML = e.offsetX

        this.canvas.addEventListener('mousedown', handlers.canvasMouseDown);

        this.canvas.addEventListener('mouseup', handlers.canvasMouseUp);
        this.canvas.addEventListener('mouseout', (e) => {

            // TODO:: deselecionar (hover) todos
        });
    }


    bindEmbeddedControls(handlers) {

        this.previousHand.bind(handlers.previousHand);
        this.previousAction.bind(handlers.previousAction);
        this.play.bind(handlers.play);
        this.nextAction.bind(handlers.nextAction);
        this.nextHand.bind(handlers.nextHand);
    }

    /**
     * 
     * @param {HistoryT} history 
     */
    render(history, navigation) {

        ease.render.call(this, history, navigation);
    }

    updateNavigation(enables) {


        Object.entries(enables).forEach(([key, enable]) => {

            const states = enums.buttonStates;

            const state = enable ? states.normal : states.disabled;

            this[key].setState = state;
        });

    }

}
