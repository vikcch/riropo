import fns, { displayValue, head, pureValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import { PlayerT } from '@/scripts/units/player';
import View from '@/scripts/view';
import displayPositions from '@/scripts/units/display-positions';
import biz from '@/scripts/units/biz';
import enums from '@/scripts/units/enums';
import easeMiddlePot from './middle-pot';

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

const drawPlayerCards = function ({ isPLO, point }) {

    const offSetX = 15;
    const offSetY = 4;

    const outSetX = isPLO ? -offSetX : 0;
    const outSetY = isPLO ? -offSetY : 0;

    return (card, index) => {

        const { suit, value } = biz.getCardIndex(card);

        const image = this.images.deck[suit][value];

        const x = point.x + offSetX * index + outSetX;

        const y = point.y + offSetY * index + outSetY;

        this.context.drawImage(image, x, y);
    };
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

    const isPLO = players.find(x => x.isHero).holeCards.length === 4;

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

            if (isPLO) {

                const x = displayPosition.inPlay.x + 10;
                const y = displayPosition.inPlay.y + 4;
                drawImage(inPlay, { x, y });
            }
        }

        if (player.holeCards) {

            const point = displayPosition.holeCards;

            const drawPlayerCardsAbsx = drawPlayerCards.call(this, { isPLO, point });

            player.holeCards.forEach(drawPlayerCardsAbsx);
        }

    });
}

/**
 * @this {View}
 * @param {HistoryT} history 
 */
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

    this.inter = setInterval(drawStatus, 500);

    drawStatus();
};

/**
 * @this {View}
 * @param {PlayerT[]} players 
 */
const betChips = function (players) {

    const { chips } = this.images;

    players.forEach(player => {

        if (!player.amountOnStreet) return;

        const findPlayer = x => player.seat === x.seatAjusted;

        const displayPosition = displayPositions(6).find(findPlayer);

        let { x, y } = displayPosition.betChips;

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

        const { seatFixed } = displayPosition;

        const value = player.amountOnStreet;

        const text = displayValue(value);

        const textAlign = seatFixed >= 5 ? 'left' : 'right';

        this.context.textAlign = textAlign;
        this.context.textBaseline = 'bottom';
        this.context.fillStyle = 'white';

        this.context.fillText(text, x, y);
    });
};

/**
 * @this {View}
 * @param {string[]} streetCards 
 */
const streetCards = function (streetCards) {

    if (!streetCards) return;

    const { deck } = this.images;

    streetCards.forEach((card, index) => {

        const { suit, value } = biz.getCardIndex(card);

        const image = deck[suit][value];

        const x = 268 + image.width * index + (index * 4);

        const y = 152;

        this.context.drawImage(image, x, y);
    });
}



/**
 * @this {View}
 * @param {HistoryT} history 
 */
const middlePotValue = function (history) {

    const streetAmount = history.players.reduce((acc, cur) => acc + cur.amountOnStreet, 0);

    const value = pureValue(history.pot - streetAmount);

    if (value === 0) return;

    const point = { x: 400, y: 275 };

    drawTextCenter(this.context, value, 'white', point);
};

/**
 * @this {View}
 * @param {HistoryT} history 
 * @param {string} navigation 
 */
const chat = function (history, navigation) {

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
};

export default {

    /**
     * 
     * @this {View}
     * @param {HistoryT} history 
     */
    render(history, navigation) {

        // NOTE:: `inter` usado em `waitingToAct` e `middlePot`
        clearInterval(this.inter);

        const { width, height } = this.canvas;

        this.context.clearRect(0, 0, width, height);

        this.context.drawImage(this.images.background, 0, 0);

        pot.call(this, history.pot);

        players.call(this, history);

        action.call(this, history);

        waitingToAct.call(this, history);

        betChips.call(this, history.players);

        chipsValues.call(this, history.players);

        streetCards.call(this, history.streetCards);

        easeMiddlePot.call(this, history);

        middlePotValue.call(this, history);

        chat.call(this, history, navigation);

        // console.log(this.canvas.width);

        // this.chat.add(history.line);

        console.log(history, navigation);

        // console.log('render');

    }
}

// TODO:: Remover isto
export const testables = {

    middlePotValue,
    streetCards
};