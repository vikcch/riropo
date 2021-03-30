import View from "./view";
import Model from "./model";
import enums from '@/scripts/units/enums';
import fns from '@/scripts/units/fns'

export default class Controller {

    static mousePoint = {};

    /**
     * 
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {

        this.isLoading = false;

        this.model = model;
        this.view = view;

        this.view.bindControls({
            loadHandHistory: this.handlerLoadHandHistory_onChange,
            canvasMouseDown: this.handlerCanvas_onMouseDown,
            canvasMouseUp: this.handlerCanvas_onMouseUp,
            canvasMouseMove: this.handlerCanvas_onMouseMove,
            canvasKeyUp: this.handlerCanvas_onKeyUp,
            canvasFullscreenchange: this.handlerCanvas_onFullscreenchange,
            fullscreen: this.handlerFullscreen_onClick
        });

        this.view.bindEmbeddedControls({
            openHH: {
                click: this.handlerOpenHH_onClick
            },
            previousHand: {
                click: this.handlerPreviousHand_onClick,
            },
            previousAction: {
                click: this.handlerPreviousAction_onClick,
            },
            play: {
                click: this.handlerPlay_onClick,
            },
            nextAction: {
                click: this.handlerNextAction_onClick,
            },
            nextHand: {
                click: this.handlerNextHand_onClick,
            },
            handsList: {
                click: this.handlerHandsList_onClick,
                tracker: this.model.tracker
            },
            showBigBlinds: {
                click: this.handleShowBigBlinds_onClick
            },
            searchHand: {
                click: this.handleSearchHand_onClick
            },
            clearHandsFilter: {
                click: this.handleClearHandsFilter_onClick
            },
            shareHand: {
                click: this.handlerShareHand_onClick
            },
            fullWindowed: {
                click: this.handlerFullWindowed_onClick
            }
        });

        const tryLoadFromOnlineDB = () => {

            this.model.tryLoadFromOnlineDB(this);
        }

        this.view.setImages(tryLoadFromOnlineDB);
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    setMousePoint(e) {

        const {
            width: canvasWidth, height: canvasHeight,   // Medida real do canvas
            offsetWidth, offsetHeight                   // Medida escalar (settada no style)
        } = this.view.canvas;

        const windowed = () => {

            return {
                x: e.offsetX * canvasWidth / offsetWidth,
                y: e.offsetY * canvasHeight / offsetHeight
            };
        };

        const fullScreen = () => {

            const widthRatio = window.innerWidth / canvasWidth;
            const heightRatio = window.innerHeight / canvasHeight;

            // O Browser faz a escalagem com um aspecto ratio fixo, então se
            // o canvas não tiver o mesmo aspecto ratio do ecran, a imagem fica 
            // com "barras negras", o ratio escolhido é o menor, ou seja, da
            // dimensão que fica com a margem 0,  

            const ratio = Math.min(widthRatio, heightRatio);

            const zoomWidth = canvasWidth * ratio;
            const zoomHeight = canvasHeight * ratio;

            const marginHorizontal = (window.innerWidth - zoomWidth) / 2;
            const marginVertical = (window.innerHeight - zoomHeight) / 2;

            return {
                x: (e.offsetX - marginHorizontal) * canvasWidth / zoomWidth,
                y: (e.offsetY - marginVertical) * canvasHeight / zoomHeight
            };
        };

        const mousePoint = fns.isFullScreen() ? fullScreen() : windowed();

        Controller.mousePoint = mousePoint;
    }

    async handLoad(log, { fromDB } = {}) {

        this.isLoading = true;

        this.view.resetScreen();

        if (!this.model.logValidation(log)) return;

        this.view.handsList.removeAll();

        await this.model.processLog(log, this.view);

        const history = this.model.getFirstHistory();

        this.view.handsList.setRange(this.model.handsList);

        this.view.handsList.setMaxHiddenRule();

        this.view.updateChat(history, enums.navigation.nextHand);

        this.view.render(history, this.model.mainInfo);

        const enables = this.model.getNavigationEnables();

        this.view.updateNavigation(enables);

        this.view.resetHandSearchFilterVisibility();

        this.view.enableShareHand({ fromDB });

        this.isLoading = false;
    }

    handlerOpenHH_onClick = () => {

        // NOTE:: Existem dois controlos:
        // * openHH - Embedded button, quando clicado (este evento) triga o "loadHH"
        // * loadHH - `<input type="file" hidden>` o evento change lê o file

        this.view.loadHH.click();
    }

    handlerLoadHandHistory_onChange = (event) => {

        const { loadHH } = this.view;

        const reader = new FileReader();

        reader.onload = () => {

            this.handLoad(reader.result);
        };

        reader.onerror = () => {

            alert('Something went wrong');
        };

        if (loadHH.value.length) {

            const singleFile = loadHH.files.length === 1;

            if (singleFile) reader.readAsText(loadHH.files[0]);
            else alert('Please select only one file!');
        }
    }

    handlerCanvas_onMouseDown = (e) => {

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.mousedown(mousePoint);
    }

    handlerCanvas_onMouseUp = (e) => {

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.click(mousePoint);
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handlerCanvas_onMouseMove = (e) => {

        if (this.isLoading) return;

        this.setMousePoint(e)

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.hover(mousePoint);

        const { hero } = this.model;
        const { tableMax } = { ...this.model.mainInfo };

        if (this.view.hoverHero(hero, mousePoint, tableMax)) {

            this.view.showHeroFolderHoleCards(hero, this.model);
        }
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    handlerCanvas_onKeyUp = (e) => {

        const enables = this.model.getNavigationEnables();

        const map = {

            ArrowUp: 'previousHand',
            ArrowLeft: 'previousAction',
            ArrowRight: 'nextAction',
            ArrowDown: 'nextHand'
        };

        const buttonLabel = map[e.code];

        if (enables[buttonLabel]) {

            const capitalised = fns.capitalize(buttonLabel);

            this[`handler${capitalised}_onClick`]();
        }
    }

    handlerCanvas_onFullscreenchange = () => {

        this.view.toogleFullWindowedImages();

        if (!fns.isMobile()) return;

        this.view.toogleNavigationKeysSize();

        const history = this.model.getHistory();

        this.view.render(history, this.model.mainInfo);
    }

    handlerFullscreen_onClick = () => {

        // NOTE:: Existem dois controlos:
        // * fullWindowed - Embedded button, para desktop
        // * fullscrenn - `<button hidden>` para mobile

        this.handlerFullWindowed_onClick();
    }

    //#region EmbeddedControls

    handlerFullWindowed_onClick = () => {

        const { canvas } = this.view;

        if (canvas.requestFullscreen === undefined) return;

        if (fns.isFullScreen()) document.exitFullscreen();
        else canvas.requestFullscreen();
    }

    handlerHandsList_onClick = handIndex => {

        this.view.stopPlayback();

        const { nextHand } = enums.navigation;

        const { history, enables } = this.model.navigateTo(handIndex);

        this.view.updateChat(history, nextHand);

        this.view.enableShareHand();

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    /**
     * * CheckBox
     */
    handleShowBigBlinds_onClick = () => {

        const history = this.model.getHistory();

        if (!history || !this.model.mainInfo) return;

        this.view.render(history, this.model.mainInfo);
    }

    handleSearchHand_onClick = () => {

        const hand = this.view.handsList.filterItems();

        if (hand) {

            this.view.toogleHandSearchFilterVisibility();

            const history = this.model.getHistory();

            this.view.render(history, this.model.mainInfo, hand);
        }
    }

    handleClearHandsFilter_onClick = () => {

        this.view.handsList.clearFilter();

        this.view.toogleHandSearchFilterVisibility();
    }


    handlerPreviousHand_onClick = () => {

        this.view.stopPlayback();

        const { previousHand } = enums.navigation;

        const { history, enables } = this.model.navigation(previousHand);

        this.view.updateChat(history, previousHand);

        this.view.adjustHandsList();

        this.view.enableShareHand();

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }


    handlerPreviousAction_onClick = () => {

        this.view.stopPlayback();

        const { previousAction } = enums.navigation;

        const { history, enables } = this.model.navigation(previousAction);

        this.view.updateChat(history, previousAction);

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    handlerPlay_onClick = () => {

        const nextActionHandler = this.handlerNextAction_onClick;

        this.view.tooglePlayback(nextActionHandler, this.model);
    };

    handlerNextAction_onClick = ({ fromPlay } = {}) => {

        if (!fromPlay) this.view.stopPlayback();

        this.view.previousAction.setState = 'normal';

        const { nextAction } = enums.navigation;

        const { history, enables, next } = this.model.navigation(nextAction);

        // NOTE:: Náo é sempre 'nextAction', caso seja o ultimo progress da hand
        this.view.updateChat(history, next);

        if (next !== nextAction) {

            this.view.adjustHandsList();

            this.view.enableShareHand();
        }

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    handlerNextHand_onClick = () => {

        this.view.stopPlayback();

        const { nextHand } = enums.navigation;

        const { history, enables } = this.model.navigation(nextHand);

        this.view.updateChat(history, nextHand);

        this.view.adjustHandsList();

        this.view.enableShareHand();

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    handlerShareHand_onClick = async () => {

        const content = await this.model.shareHand();

        if (!content) return;

        if (content.success) {

            const { link } = content;

            prompt(`Success\n\nLink: ${link}\n\n[CTRL + C] copy to clipboard`, link);

            this.view.disableShareHand();

        } else alert(content.message);
    }

    //#endregion
}
