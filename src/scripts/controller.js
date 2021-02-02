import View from "./view";
import Model from "./model";

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
        });

        this.view.bindEmbeddedControls({
            nextAction: {
                click: this.handlerNextAction_onClick,
            },

            previousAction: {
                click: this.handlerPreviousAction_onClick,
            }
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

            this.model.processLog(log);

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

        if (found) found.mousedown();
    }

    handlerCanvas_onMouseUp = (e) => {

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.click();
    }


    /**
     * 
     * @param {MouseEvent} e 
     */
    handlerCanvas_onMouseMove = (e) => {

        this.setMousePoint(e)

        const mousePoint = Controller.mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.hover();

        this.view.coordsDiv.innerHTML = e.offsetX
    }

    //#region EmbeddedControls

    handlerNextAction_onClick = () => {

        console.log('foi clicako  next');

        // this.view.context.fillRect(0, 0, 300, 50);


        // this.view.context.fillStyle = '#FF0000';
        // this.view.context.fillText('Merda', 10, 20)  


        this.view.previousAction.setState = 'normal';

        // const hand = this.model.handHistories[0];
        // this.view.render(hand.histories[0]);
    }

    handlerPreviousAction_onClick = () => {

        console.log('foi clicako  previous');
    }

    //#endregion
}
