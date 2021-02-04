import View from "./view";
import Model from "./model";
import seatPositions from '@/scripts/units/display-positions';

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

        this.view.coordsDiv.innerHTML = e.offsetX;
    }

    //#region EmbeddedControls

    static c = 0;

    handlerNextAction_onClick = () => {

        console.log('foi clicako  next');

        this.view.previousAction.setState = 'normal';

        // const hand = this.model.handHistories[0];
        // this.view.render(hand.histories[Controller.c++]);


        seatPositions(9).forEach(item => {

            const point = item.emptySeat;
            const img = this.view.images.emptySeat;

            this.view.context.drawImage(img, point.x, point.y);

            this.view.context.textBaseline = "top";

            this.view.context.fillText('lkasdjflkfjd', item.name.x, item.name.y)

            this.view.context.fillRect(item.chips.x, item.chips.y, 22, 20);

            const { inPlay } = this.view.images;
            this.view.context.drawImage(inPlay, item.inPlay.x, item.inPlay.y);
        });




    }

    handlerPreviousAction_onClick = () => {

        console.log('foi clicako  previous');

        const { chips } = this.view.images;

        // View.contextAux.clearRect(0, 0, 22, 20);
        // View.contextAux.drawImage(chips, 0, 0)

        // const imgData = View.contextAux.getImageData(0, 0, 22, 20);

        // this.view.context.putImageData(imgData, 0, 100);

        /* ****** */
        /*   View.canvasAux.width = 22;
          View.canvasAux.height = 20;
          View.contextAux.clearRect(0, 0, 22, 20);
          View.contextAux.drawImage(chips, 0, 0)
  
          // var imgData = View.contextAux.getImageData(0, 0, 22, 20);
          // console.log(imgData);
  
          // var myImageData = View.contextAux.createImageData(imgData);
  
          var img = new Image();
          img.onload = () => {
              console.log('caregou');
              this.view.context.drawImage(img, 0, 300); 
          }
          // img.src = imgData;
          img.src = View.canvasAux.toDataURL('image/png'); */

        /* ************** */

        View.canvasAux.width = 22;
        View.canvasAux.height = 20;
        View.contextAux.clearRect(0, 0, 22, 20);
        View.contextAux.drawImage(chips, -22, 0);

        var img = new Image();
        img.onload = () => {
            console.log('caregou');
            this.view.context.drawImage(img, 0, 300);
        }
        // img.src = imgData;
        img.src = View.canvasAux.toDataURL('image/png');

    }

    //#endregion
}
