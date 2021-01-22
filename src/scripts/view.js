export default class View {

    constructor() {

        this.loadHH = document.querySelector('#load-hand-history');







        /** @type {HTMLCanvasElement} */
        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');


        this.canvas.width = 792;
        this.canvas.height = 555;

        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(500, 100);
        this.context.stroke();

        const img = new Image();
        img.onload = () => {

            this.context.drawImage(img, 0, 0);
        };

        img.src = './src/assets/images/bg-vector-792x555.jpg';
    }


    bindControls(handlers) {


        this.loadHH.addEventListener('change', handlers.loadHandHistory);

    }

}
