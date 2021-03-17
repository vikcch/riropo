import View from "./view";
import Model from "./model";
import seatPositions from '@/scripts/units/display-positions';
import { getChipIndex } from "./units/biz";
// TODO:: remover isto
import { testables } from '@/scripts/eases/view/render/table';
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

        this.model = model;
        this.view = view;

        this.view.bindControls({
            loadHandHistory: this.handlerLoadHandHistory_onChange,
            canvasMouseDown: this.handlerCanvas_onMouseDown,
            canvasMouseUp: this.handlerCanvas_onMouseUp,
            canvasMouseMove: this.handlerCanvas_onMouseMove,
            canvasKeyUp: this.handlerCanvas_onKeyUp
        });

        this.view.bindEmbeddedControls({
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
        });
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    setMousePoint(e) {

        const {
            width, height,              // Medida real do canvas
            offsetWidth, offsetHeight   // Medida escalar (settada no style)
        } = this.view.canvas;

        const mousePoint = {
            x: e.offsetX * width / offsetWidth,
            y: e.offsetY * height / offsetHeight
        };

        Controller.mousePoint = mousePoint;
    }

    handlerLoadHandHistory_onChange = (event) => {

        const { loadHH } = this.view;

        const reader = new FileReader();

        reader.onload = () => {

            // TODO:: ver se é um hand history valido
            const log = reader.result;

            this.view.handsList.removeAll();

            this.model.processLog(log);

            const history = this.model.getFirstHistory();

            this.view.handsList.addRange(this.model.handsList);

            this.view.handsList.setMaxHiddenRule();

            this.view.updateChat(history, enums.navigation.nextHand);

            this.view.render(history, this.model.mainInfo);

            const enables = this.model.getNavigationEnables();

            this.view.updateNavigation(enables);
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

        console.log(this.view.embeddables);

        if (found) found.click(mousePoint);
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    handlerCanvas_onMouseMove = (e) => {

        this.setMousePoint(e)

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.hover(mousePoint);

        this.view.coordsDiv.innerHTML = e.offsetX;

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


    //#region EmbeddedControls

    handlerHandsList_onClick = handIndex => {

        this.view.stopPlayback();

        const { nextHand } = enums.navigation;

        const { history, enables } = this.model.navigateTo(handIndex);

        this.view.updateChat(history, nextHand);

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);

        console.log({ handIndex });
    }


    handlerPreviousHand_onClick = () => {

        this.view.stopPlayback();

        const { previousHand } = enums.navigation;

        const { history, enables } = this.model.navigation(previousHand);

        this.view.updateChat(history, previousHand);

        this.view.adjustHandsList();

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

        if (next !== nextAction) this.view.adjustHandsList();

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    handlerNextHand_onClick = () => {

        this.view.stopPlayback();

        const { nextHand } = enums.navigation;

        const { history, enables } = this.model.navigation(nextHand);

        this.view.updateChat(history, nextHand);

        this.view.adjustHandsList();

        this.view.render(history, this.model.mainInfo);

        this.view.updateNavigation(enables);
    }

    //#endregion



    showFakeRender() {

        seatPositions(9).forEach((item, i) => {

            const point = item.emptySeat;
            const img = this.view.images.emptySeat;

            if (i === 3) this.view.context.globalAlpha = 0.4;
            this.view.context.drawImage(img, point.x, point.y);
            this.view.context.globalAlpha = 1;


            const { status } = this.view.images;
            this.view.context.drawImage(status, item.status.x, item.status.y);


            this.view.context.textAlign = 'center';
            this.view.context.textBaseline = 'middle';
            this.view.context.fillStyle = 'white';

            this.view.context.fillText('lkasdjflkfjd', item.name.x, item.name.y);
            this.view.context.fillText('24,534', item.stack.x, item.stack.y);


            const { chips } = this.view.images;
            const n = Math.floor(Math.random() * 20);

            this.view.context.drawImage(chips[n], item.chips.x, item.chips.y);

            const { inPlay } = this.view.images;
            this.view.context.drawImage(inPlay, item.inPlay.x, item.inPlay.y);

            const { dealer } = this.view.images;
            this.view.context.drawImage(dealer, item.dealer.x, item.dealer.y);


            const { actions } = this.view.images;
            const n2 = Math.floor(Math.random() * 5);
            this.view.context.drawImage(actions[n2], item.action.x, item.action.y);


            const textAlign = i < 4 ? 'right' : 'left';

            this.view.context.textAlign = textAlign;
            this.view.context.textBaseline = 'bottom';
            this.view.context.fillStyle = 'white';

            this.view.context.fillText('13,623', item.chipsValue.x, item.chipsValue.y);

        });

        testables.streetCards.call(this.view, ['As', 'Kh', '8s', 'Tc', '2d']);
        testables.middlePot.call(this.view, { players: [], pot: 2324 });
        testables.middlePotValue.call(this.view, { players: [], pot: 2324 });
    }
}
