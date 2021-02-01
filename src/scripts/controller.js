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
            canvasClick: this.handlerCanvas_onClick,
            canvasMouseMove: this.handlerCanvas_onMouseMove,
        });

        this.view.bindEmbeddedControls({
            nextAction: {
                click: this.handlerNextAction_onClick,
                hover: this.handlerNextAction_onHover
            },

            previousAction: {
                click: this.handlerPreviousAction_onClick,
                hover: this.handlerPreviousAction_onHover
            }
        });
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

    handlerCanvas_onClick = (e) => {

        const mousePoint = { x: e.offsetX, y: e.offsetY };

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.click();
    }

    handlerCanvas_onMouseMove = (e) => {

        const mousePoint = { x: e.offsetX, y: e.offsetY };

        Controller.mousePoint = mousePoint;

        const found = this.view.embeddables.find(v => v.hitMe(mousePoint));

        if (found) found.hover();
    }


    handlerNextAction_onClick = () => {

        console.log('foi clicako  next');


        this.view.previousAction.setState = 'normal';
    }
    handlerNextAction_onHover = (p) => {

        console.log('foi hover  next');
        console.log(p);
    }

    handlerPreviousAction_onClick = () => {

        console.log('foi clicako  previous');
    }
    handlerPreviousAction_onHover = () => {

        console.log('foi hover  previous');
    }



}
