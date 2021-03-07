import Button from "./controls/button";
import ease from '@/scripts/eases/view/index';
import { HistoryT } from '@/scripts/units/history';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';
import easeRender from '@/scripts/eases/view/render/index'
import enums, { buttonStates } from '@/scripts/units/enums';
import Chat from "./controls/chat";
import displayPositions from "./units/display-positions";
import { pointInRect } from "./units/fns";


export default class View {

    static canvasAux = document.createElement('canvas');
    static contextAux = View.canvasAux.getContext('2d');

    constructor() {

        this.coordsDiv = document.querySelector('#mouse-coords');

        this.loadHH = document.querySelector('#load-hand-history');

        /** @type {HTMLCanvasElement} */
        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');

        const { table, handsList } = easeRender.rects;
        this.canvas.width = handsList.width + table.width;
        this.canvas.height = handsList.height;

        this.embeddables = [];
        this.createEmbeddedControls();

        this.images = {};
        this.setImages();

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

        const { table } = easeRender.rects;
        this.context.drawImage(this.images.background, table.x, table.y);

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

        this.canvas.addEventListener('keyup', handlers.canvasKeyUp);
    }


    bindEmbeddedControls(handlers) {

        this.previousHand.bind(handlers.previousHand);
        this.previousAction.bind(handlers.previousAction);
        this.play.bind(handlers.play);
        this.nextAction.bind(handlers.nextAction);
        this.nextHand.bind(handlers.nextHand);
    }

    /**
     * @param {HistoryT} history 
     * @param {string} navigation enums.navigation
     */
    updateChat(history, navigation) {

        const work = {

            previousHand: () => {
                this.chat.removeAll();
                this.chat.addRange(history.line);
            },
            previousAction: () => this.chat.remove(),
            nextAction: () => this.chat.add(history.line),
            nextHand: () => {
                this.chat.removeAll();
                this.chat.addRange(history.line);
            }
        };

        work[navigation].call();
    };

    /**
     * 
     * @param {HistoryT} history 
     */
    render(history) {

        ease.render.call(this, history);
    }

    hoverHero(hero, mousePoint) {

        if (!hero) return;

        // STOPSHIP :: hardcoded
        const displayPosition = displayPositions(6).find(x => hero.seat === x.seatAjusted);

        const { table: tableRect } = easeRender.rects;

        const heroRect = {

            x: displayPosition.emptySeat.x + tableRect.x,
            y: displayPosition.emptySeat.y + tableRect.y,
            width: this.images.emptySeat.width,
            height: this.images.emptySeat.height
        };

        return pointInRect(mousePoint, heroRect);
    }

    showHeroFolderHoleCards(hero, model) {

        if (hero.inPlay) return;

        ease.showHeroFoldedHoleCards.call(this, hero, model);
    }

    updateNavigation(enables) {

        Object.entries(enables).forEach(([key, enable]) => {

            const states = enums.buttonStates;

            const state = enable ? states.normal : states.disabled;

            this[key].setState = state;
        });

    }

}
