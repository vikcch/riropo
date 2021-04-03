import Button from "./controls/button";
import ease from '@/scripts/eases/view/index';
import { HistoryT } from '@/scripts/units/history';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';
import easeRender from '@/scripts/eases/view/render/index'
import enums, { buttonStates } from '@/scripts/units/enums';
import Chat from "./controls/chat";
import HandsList from "./controls/hand-list";
import displayPositions from "./units/display-positions";
import fns, { pointInRect } from "./units/fns";
import CheckBox from "./controls/checkbox";

export default class View {

    static canvasAux = document.createElement('canvas');
    static contextAux = View.canvasAux.getContext('2d');

    constructor() {

        this.loadHH = document.querySelector('#load-hand-history');
        this.loadHHBogus = document.querySelector('#load-hand-history-bogus');
        this.fullscreen = document.querySelector('#fullscreen');

        /** @type {HTMLCanvasElement} */
        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');

        const { handsList } = embeddedRects;
        const { table, mainInfo } = easeRender.rects;
        this.canvas.width = handsList.width + table.width;
        this.canvas.height = mainInfo.height + table.height;

        /** @type {HTMLCanvasElement} */
        this.canvasToolTip = document.querySelector('#canvas-tool-tip');
        this.contextToolTip = this.canvasToolTip.getContext('2d');
        this.canvasToolTip.width = this.canvas.width;
        this.canvasToolTip.height = this.canvas.height;

        this.embeddables = [];
        this.createEmbeddedControls();

        this.images = {};

        // intervals em table
        this.inter = null;

        this.setCallOffEmbeddedControls();
    }

    /**
     * 
     * @param {*} tryLoadFromOnlineDB callback
     */
    async setImages(tryLoadFromOnlineDB, controller) {

        try {

            this.images = await ease.loadImages();

            await this.setEmbeddedControlsImages();

            this.setPlatformVisibility();

            this.embeddables.forEach(x => x.draw());

            tryLoadFromOnlineDB();

            controller.isLoading = false;

        } catch (error) {

            console.error(error);
        }
    }

    createEmbeddedControls() {

        const {
            openHH: openHHRect,
            navigation: navigationRect,
            chat: chatRect,
            handsList: handsListRect,
            showBigBlinds: showBBsRect,
            searchHand: searchHandRect,
            clearHandFilter: clearRect,
            shareHand: shareHandRect,
            fullWindowed: fullWindowedRect

        } = embeddedRects;

        this.openHH = new Button(this, openHHRect);

        const state = buttonStates.disabled;

        this.previousHand = new Button(this, navigationRect.previousHand, { state });
        this.previousAction = new Button(this, navigationRect.previousAction, { state });
        this.play = new Button(this, navigationRect.play, { state });
        this.nextAction = new Button(this, navigationRect.nextAction, { state });
        this.nextHand = new Button(this, navigationRect.nextHand, { state });

        this.chat = new Chat(this, chatRect);

        this.handsList = new HandsList(this, handsListRect);

        const showBBsText = 'Show Stack Values in Big Blinds';
        this.showBigBlinds = new CheckBox(this, showBBsRect, showBBsText);

        const hiddenNot3d = { state: buttonStates.hidden, is3d: false };

        this.searchHand = new Button(this, searchHandRect, hiddenNot3d);

        this.clearHandsFilter = new Button(this, clearRect, hiddenNot3d);

        this.shareHand = new Button(this, shareHandRect, { state: buttonStates.hidden });

        this.fullWindowed = new Button(this, fullWindowedRect);
    }

    async setEmbeddedControlsImages() {

        // NOTE:: Os buttons 3d vão buscar o background 
        // (nao pode ficar so no resetScreen)
        const { table } = easeRender.rects;
        this.context.drawImage(this.images.background, table.x, table.y);

        await this.openHH.setImages(this.images.openShareButtons, { row: 0 });

        await this.previousHand.setImages(this.images.navigation, { row: 0 })
        await this.previousAction.setImages(this.images.navigation, { row: 1 });
        await this.play.setImages(this.images.navigation, { row: 2 });
        await this.nextAction.setImages(this.images.navigation, { row: 3 });
        await this.nextHand.setImages(this.images.navigation, { row: 4 });

        await this.chat.setImage(this.images.chat);

        // NOTE:: carrega as imagens da scrollbar internamente
        await this.handsList.setImage();

        await this.searchHand.setImages(this.images.searchHand, { row: 0 });
        await this.clearHandsFilter.setImages(this.images.clearHandFilter, { row: 0 });
        await this.shareHand.setImages(this.images.openShareButtons, { row: 1 });

        await this.fullWindowed.setImages(this.images.fullWindowed, { row: 0 });

        // STOPSHIP:: DA ERRO SE FIZER REFRESH DA PAGINA E O MOUSE ESTIVER EM
        this.showBigBlinds.setImage();

        this.resetScreen();
    }

    bindControls(handlers) {

        this.loadHH.addEventListener('change', handlers.loadHandHistory);
        this.canvas.addEventListener('mousemove', handlers.canvasMouseMove);
        this.canvas.addEventListener('mousedown', handlers.canvasMouseDown);
        this.canvas.addEventListener('mouseup', handlers.canvasMouseUp);
        this.canvas.addEventListener('keyup', handlers.canvasKeyUp);
        this.canvas.addEventListener('fullscreenchange', handlers.canvasFullscreenchange);
        this.fullscreen.addEventListener('click', handlers.fullscreen);
        this.loadHHBogus.addEventListener('click', handlers.loadHHBogus);
    }

    bindEmbeddedControls(handlers) {

        this.openHH.bind(handlers.openHH);
        this.previousHand.bind(handlers.previousHand);
        this.previousAction.bind(handlers.previousAction);
        this.play.bind(handlers.play);
        this.nextAction.bind(handlers.nextAction);
        this.nextHand.bind(handlers.nextHand);
        this.handsList.bind(handlers.handsList);
        this.showBigBlinds.bind(handlers.showBigBlinds);
        this.searchHand.bind(handlers.searchHand);
        this.clearHandsFilter.bind(handlers.clearHandsFilter);
        this.shareHand.bind(handlers.shareHand);
        this.fullWindowed.bind(handlers.fullWindowed);
    }

    setCallOffEmbeddedControls() {

        this.canvas.addEventListener('mouseout', (e) => {

            this.handsList.clearHover();
            this.chat.clearHover();
            this.searchHand.clearHover();
            this.clearHandsFilter.clearHover();
            this.shareHand.clearHover();
            this.fullWindowed.clearHover();
        });

        window.addEventListener('mouseup', () => {

            this.handsList.unpressScrollBar();
            this.chat.unpressScrollBar();
        });
    }

    setPlatformVisibility() {

        // ex: internet explorer 11
        if (this.canvas.requestFullscreen === undefined) {

            this.fullWindowed.setState = buttonStates.hidden;
        }

        if (!fns.isMobile()) return;

        this.loadHHBogus.removeAttribute('hidden');
        this.fullscreen.removeAttribute('hidden');

        this.openHH.setState = buttonStates.hidden;
        this.fullWindowed.setState = buttonStates.hidden;

    }

    resetScreen() {

        const navs = {
            previousHand: false,
            previousAction: false,
            play: false,
            nextAction: false,
            nextHand: false
        };

        this.updateNavigation(navs);

        this.render();
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
    }

    /**
     * 
     * @param {HistoryT} history 
     * @param {MainInfoT} mainInfo
     */
    render(history, mainInfo, handFiltered) {

        ease.render.call(this, history, mainInfo, handFiltered);
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

    resetHandSearchFilterVisibility() {

        this.clearHandsFilter.setState = buttonStates.hidden;
        this.searchHand.setState = buttonStates.normal;
    }


    toogleHandSearchFilterVisibility() {

        this.clearHandsFilter.toogleVisibility();
        this.searchHand.toogleVisibility();
    }

    /**
     * 
     * @param {number} index 
     * @param {number} count 
     */
    drawLoadingBar(index, count) {

        const { table, logo } = easeRender.rects;

        const x = table.x + logo.x;
        const y = table.y + logo.y + this.images.logo.height + 10;

        this.context.setTransform(1, 0, 0, 1, x, y);

        const maxWidth = this.images.logo.width;

        if (index === 0) {

            this.context.fillStyle = '#ffffe1';
            this.context.fillRect(-3, -3, maxWidth + 6, 16);
            this.context.fillStyle = 'gray';
            this.context.fillRect(-2, -2, maxWidth + 4, 16 - 2);
        }

        this.context.fillStyle = '#ffffe1';

        const width = index * maxWidth / count;

        this.context.fillRect(0, 0, width, 10);
    }

    enableShareHand({ fromDB } = {}) {

        if (fns.isMobile() || fromDB) return;

        this.shareHand.setState = buttonStates.normal;
    }

    disableShareHand() {

        this.shareHand.setState = buttonStates.hidden;
    }

    toogleNavigationKeysSize() {

        const key = `navigation${fns.isFullScreen() ? 'Mobile' : ''}`;

        const { [key]: keyRect } = embeddedRects;
        this.previousHand.setRect = keyRect.previousHand;
        this.previousAction.setRect = keyRect.previousAction;
        this.play.setRect = keyRect.play;
        this.nextAction.setRect = keyRect.nextAction;
        this.nextHand.setRect = keyRect.nextHand;
    }

    async toogleFullWindowedImages() {

        const row = fns.isFullScreen() ? 1 : 0;

        await this.fullWindowed.setImages(this.images.fullWindowed, { row });

        this.fullWindowed.draw();

    }
}
