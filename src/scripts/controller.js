import View from "./view";
import Model from "./model";

export default class Controller {

    /**
     * 
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {


        this.model = model;
        this.view = view;


        this.view.bindControls({
            loadHandHistory: this.handlerLoadHandHistory_onChange
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


}
