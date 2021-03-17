import Button from "./controls/button";
import ease from '@/scripts/eases/view/index';
import { HistoryT } from '@/scripts/units/history';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';
import easeRender from '@/scripts/eases/view/render/index'
import enums, { buttonStates } from '@/scripts/units/enums';
import Chat from "./controls/chat";
import HandsList from "./controls/hand-list";
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

        const { handsList } = embeddedRects;
        const { table } = easeRender.rects;
        this.canvas.width = handsList.width + table.width;
        this.canvas.height = handsList.height;

        /** @type {HTMLCanvasElement} */
        this.canvasToolTip = document.querySelector('#canvas-tool-tip');
        this.contextToolTip = this.canvasToolTip.getContext('2d');
        this.canvasToolTip.width = this.canvas.width;
        this.canvasToolTip.height = this.canvas.height;

        this.embeddables = [];
        this.createEmbeddedControls();

        this.images = {};
        this.setImages();

        // intervals em table
        this.inter = null;

        this.setCallOffEmbeddedControls();
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

        // NOTE:: carrega as imagens da scrollbar internamente
        await this.handsList.setImage();
    }

    createEmbeddedControls() {

        const { navigation: rect, handsList: handsListRect } = embeddedRects;

        const state = buttonStates.disabled;

        this.previousHand = new Button(this, rect.previousHand, { state });
        this.previousAction = new Button(this, rect.previousAction, { state });
        this.play = new Button(this, rect.play, { state });
        this.nextAction = new Button(this, rect.nextAction, { state });
        this.nextHand = new Button(this, rect.nextHand, { state });

        const { chat: chatRect } = embeddedRects;

        this.chat = new Chat(this, chatRect);

        this.handsList = new HandsList(this, handsListRect);
    }

    bindControls(handlers) {

        // this.coordsDiv.innerHTML = e.offsetX
        this.loadHH.addEventListener('change', handlers.loadHandHistory);
        this.canvas.addEventListener('mousemove', handlers.canvasMouseMove);
        this.canvas.addEventListener('mousedown', handlers.canvasMouseDown);
        this.canvas.addEventListener('mouseup', handlers.canvasMouseUp);
        this.canvas.addEventListener('keyup', handlers.canvasKeyUp);
    }

    bindEmbeddedControls(handlers) {

        this.previousHand.bind(handlers.previousHand);
        this.previousAction.bind(handlers.previousAction);
        this.play.bind(handlers.play);
        this.nextAction.bind(handlers.nextAction);
        this.nextHand.bind(handlers.nextHand);
        this.handsList.bind(handlers.handsList);
    }

    setCallOffEmbeddedControls() {

        this.canvas.addEventListener('mouseout', (e) => {

            this.handsList.clearHover();
            this.chat.clearHover();

        });

        window.addEventListener('mouseup', () => {

            this.handsList.unpressScrollBar();
            this.chat.unpressScrollBar();
        });
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
     * @param {MainInfoT} mainInfo
     */
    render(history, mainInfo) {

        ease.render.call(this, history, mainInfo);
    }

    hoverHero(hero, mousePoint, tableMax) {

        if (!hero && !tableMax) return;

        const displayPosition = displayPositions(tableMax).find(x => hero.seat === x.seatAjusted);

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

            const isHover = this[key].state === states.hover;

            const state = enable ? states.normal : states.disabled;

            // Se tiver hover e manter-se enable, nem altera nada (if contrario)
            if (!(enable && isHover)) this[key].setState = state;
        });

    }

    unpressScrollBars() {

        this.handsList.unpressScrollBar();
        this.chat.unpressScrollBar();
    }

    adjustHandsList() {

        this.handsList.adjustRowsOffSet();
    }

    async tooglePlayback(nextActionHandler, model) {

        if (this.play.data === undefined) {

            this.play.data = {
                playing: false,
                speed: 500,
                inter: null
            };
        }

        this.play.data.playing = !this.play.data.playing;

        const { playing } = this.play.data;

        if (!playing) clearInterval(this.play.data.inter);

        else this.play.data.inter = setInterval(() => {

            if (model.isVeryLastAction) return;

            nextActionHandler({ fromPlay: true });

        }, this.play.data.speed);

        const row = playing ? 5 : 2;

        await this.play.setImages(this.images.navigation, { row });

        this.play.draw();
    }


    stopPlayback() {

        const { playing } = { ... this.play.data };

        if (!playing) return;

        this.tooglePlayback();
    }
}
