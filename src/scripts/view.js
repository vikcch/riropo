import Button from "./controls/button";
import ease from '@/scripts/eases/view/index';
import { HistoryT } from '@/scripts/units/history';

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

        await this.nextAction.setImages(this.images.navigation, { row: 3 });
        await this.previousAction.setImages(this.images.navigation, { row: 1 });
    }

    createEmbeddedControls() {

        // OPTIMIZE: rect... ou ease com display positions
        const rect = { x: 500, y: 450, width: 50, height: 28 };
        this.nextAction = new Button(this, rect);

        const rect2 = { x: 440, y: 450, width: 50, height: 28 };

        // this.previousAction = new Button(this, rect2, 'disabled');
        this.previousAction = new Button(this, rect2);
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

        this.nextAction.bind(handlers.nextAction);
        this.previousAction.bind(handlers.previousAction);
    }

    /**
     * 
     * @param {HistoryT} history 
     */
    render(history) {

        ease.render.call(this, history);
    }

}
