import fns, { displayValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import { PlayerT } from '@/scripts/units/player';
import View from '@/scripts/view';
import displayPositions from '@/scripts/units/display-positions';
import biz from '@/scripts/units/biz';

let inter = null;

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {string} text 
 * @param {{x:number,y:number}} point 
 */
const drawTextCenter = function (context, text, color, point) {

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;

    context.fillText(text, point.x, point.y);
};

/**
 * @this {View}
 * @param {number} value 
 */
const pot = function (value) {

    const amount = displayValue(value);
    const text = `Pot: ${amount}`;

    const textWidth = this.context.measureText(text).width

    const center = this.canvas.width / 2;
    const verticalPadding = 16;
    const boxWidth = textWidth + verticalPadding;
    const x = center - textWidth / 2 - verticalPadding / 2;

    this.context.fillStyle = 'yellow';
    this.context.fillRect(x, 8, boxWidth, 16);

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';

    this.context.fillText(text, center, 16);
};

/**
 * @this {View}
 * @param {HistoryT} history 
 */
const players = function (history) {

    const { players } = history

    const drawImage = (image, point) => {

        this.context.drawImage(image, point.x, point.y);
    };



    players.forEach(player => {

        const displayPosition = displayPositions(6).find(x => player.seat === x.seatAjusted);

        const { emptySeat, status, dealer, inPlay } = this.images;

        drawImage(emptySeat, displayPosition.emptySeat);
        drawImage(status, displayPosition.status);

        drawTextCenter(this.context, player.name, 'white', displayPosition.name);
        drawTextCenter(this.context, player.stack, 'white', displayPosition.stack);

        if (player.isButton) {

            drawImage(dealer, displayPosition.dealer);
        }

        if (player.inPlay) {

            drawImage(inPlay, displayPosition.inPlay);
        }
    });
}

const action = function (history) {

    if (!history.action) return;

    const { player } = history;

    const findPlayer = x => player.seat === x.seatAjusted;

    const displayPosition = displayPositions(6).find(findPlayer);

    const { actions } = this.images;

    const index = biz.getActionIndex(history.action);

    const { x, y } = displayPosition.action;

    this.context.drawImage(actions[index], x, y);
};

/**
 * @this {View}
 * @param {number} value 
 */
const waitingToAct = function (history) {

    clearInterval(inter);

    if (!history.nextPlayer) return;

    const findPlayer = x => history.nextPlayer.seat === x.seatAjusted;

    // STOPSHIP:: MUDAR O HARCODED 6
    const displayPosition = displayPositions(6).find(findPlayer);

    // console.log('next', history.nextPlayer);

    const { statusHighlight } = this.images;

    const { x, y } = displayPosition.statusHighlight;

    const { width, height } = statusHighlight;

    const statusNormal = this.context.getImageData(x, y, width, height);

    let count = 0;

    const drawStatus = () => {

        const isHighlight = count % 2 === 0;

        if (isHighlight) {

            this.context.drawImage(statusHighlight, x, y);

            const { name, stack } = history.nextPlayer;

            drawTextCenter(this.context, name, 'black', displayPosition.name);
            drawTextCenter(this.context, stack, 'black', displayPosition.stack);
        }

        else this.context.putImageData(statusNormal, x, y);

        count++;
    };

    inter = setInterval(drawStatus, 500);

    drawStatus();
};

/**
 * @this {View}
 * @param {PlayerT[]} players 
 */
const chips = function (players) {

    const { chips } = this.images;

    players.forEach(player => {

        if (!player.amountOnStreet) return;

        const findPlayer = x => player.seat === x.seatAjusted;

        const displayPosition = displayPositions(6).find(findPlayer);

        let { x, y } = displayPosition.chips;

        const value = player.amountOnStreet;

        const chipsIndexs = biz.getChips(value)
            .map(x => biz.getChipIndex(x));

        chipsIndexs.forEach(chipIndex => {

            const chip = chips[chipIndex];

            this.context.drawImage(chip, x, y);

            y -= 4;
        });
    });
};

/**
 * @this {View}
 * @param {PlayerT[]} players 
 */
const chipsValues = function (players) {

    players.forEach(player => {

        if (!player.amountOnStreet) return;

        const findPlayer = x => player.seat === x.seatAjusted;

        const displayPosition = displayPositions(6).find(findPlayer);

        let { x, y } = displayPosition.chipsValue;

        let { seatFixed } = displayPosition;

        const value = player.amountOnStreet;

        const text = displayValue(value);

        const textAlign = seatFixed >= 5 ? 'left' : 'right';

        this.context.textAlign = textAlign;
        this.context.textBaseline = 'bottom';
        this.context.fillStyle = 'white';

        this.context.fillText(text, x, y);
    });
};

export default {

    /**
     * 
     * @this {View}
     * @param {HistoryT} history 
     */
    render(history) {

        const { width, height } = this.canvas;

        this.context.clearRect(0, 0, width, height);

        this.context.drawImage(this.images.background, 0, 0);

        pot.call(this, history.pot);

        players.call(this, history);

        action.call(this, history);

        waitingToAct.call(this, history);

        chips.call(this, history.players);

        chipsValues.call(this, history.players);

        // console.log(this.canvas.width);

        console.log(history);

        // console.log('render');
    }
}