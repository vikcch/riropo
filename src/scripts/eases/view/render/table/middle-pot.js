import fns, { head, pureValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import { PlayerT } from '@/scripts/units/player';
import View from '@/scripts/view';
import displayPositions from '@/scripts/units/display-positions';
import biz from '@/scripts/units/biz';
import easeRender from '@/scripts/eases/view/render/index';
import embeddedRects from '@/scripts/eases/view/embedded-controls-rects';

const frames = 10;

/**
 * 
 * @param {PlayerT} player 
 * @param {number} tableMax
 * @returns {object|undefined}
 */
const getDisplayPosition = (player, tableMax) => {

    if (!player) return;

    const findPlayer = x => player.seat === x.seatAjusted;

    const displayPosition = displayPositions(tableMax).find(findPlayer);

    return displayPosition;
};

/**
 * @param {HistoryT} history 
 */
const getMiddlePotAmount = history => {

    /**
     * @param {number} acc 
     * @param {PlayerT} cur 
     */
    const rdc = (acc, cur) => acc + cur.amountOnStreet;

    const streetAmount = history.players.reduce(rdc, 0);

    return pureValue(history.pot - streetAmount);
};

/**
 * 
 * @param {number} amount 
 * @param {{width:number,margin:1}} chipStyle 
 * @returns { {value: number, x: number, y: number}[] }
 */
const makeChipsOutSets = (amount, chipStyle) => {

    const chipsIndexs = biz.getChips(amount).map(x => biz.getChipIndex(x));
    // const chipsIndexs = [2, 1, 1, 1, 1, 0, 0, 0, 0];

    const uniques = new Set(chipsIndexs);

    // chipsIndexs => [ 5, 5, 1 ]

    // uniques     => [ 5, 1 ]

    // jagged      => [ [ { index: 5, x: 0, y: 0 }, { index: 5, x: 0, y: -4 } ],
    //                  [ { index: 1, x: 23, y: 0 } ] ]

    // flat        => [ { index: 5, x: 0, y: 0 },
    //                  { index: 5, x: 0, y: -4 },
    //                  { index: 1, x: 23, y: 0 } ]

    const jagged = [...uniques].map((v, i) => {

        const values = chipsIndexs.filter(vv => vv === v);

        return values.map((vv, ii) => ({
            index: vv,
            x: i * chipStyle.width + chipStyle.margin * i,
            y: - ii * 4
        }));
    });

    const flat = jagged.flatMap(x => x);

    return flat;
};

const makeChipsOffSets = (chipsOutSets, chipStyle, target = { x: 0, y: 0 }) => {

    const initialPoint = { x: 400, y: 242 };

    const uniquesCount = new Set(chipsOutSets.map(v => v.index)).size;

    return (count) => {

        const dx = fns.lerp(initialPoint.x, target.x, count / frames) - initialPoint.x;
        const dy = fns.lerp(initialPoint.y, target.y, count / frames) - initialPoint.y;

        const margin = (uniquesCount - 1) * chipStyle.margin;

        const chipsSpan = uniquesCount * chipStyle.width + margin;

        return chipsOutSets.map(v => ({
            index: v.index,
            x: initialPoint.x - chipsSpan / 2 + v.x + dx,
            y: initialPoint.y + v.y + dy,
            chipsSpan
        }));
    };
};

const drawDragValue = function (chipsOffSets, text, seatFixed) {

    const { x, y, chipsSpan } = head(chipsOffSets);

    const textAlign = seatFixed >= 5 ? 'left' : 'right';
    const offSetX = textAlign === 'left' ? chipsSpan + 4 : -4;

    // NOTE:: Background para diferenciar o valor que fica por cima das cartas
    // Podia mostrar apenas quando há board
    if ([2, 8].includes(seatFixed)) {

        this.context.fillStyle = 'black';
        const textWidth = this.context.measureText(text).width;
        // NOTE:: valor negativo no "witdh" faz o fillRect para tras
        const sign = textAlign === 'left' ? 1 : -1;
        this.context.fillRect(x + offSetX, y + 6, textWidth * sign, 12);
    }

    this.context.textAlign = textAlign;

    this.context.textBaseline = 'bottom';
    this.context.fillStyle = 'white';

    this.context.fillText(text, x + offSetX, y + 18);
};

/**
 * @this {View}
 * @param {*} makeChipsOffSetsAbsx 
 * @param {string} text 
 * @param {PlayerT} winner
 * @param {number} tableMax
 */
const draw = function (makeChipsOffSetsAbsx, text, winner, tableMax) {

    const { chips } = this.images;

    let count = 0;

    // NOTE:: Os metodos translate() e setTransform() não afectam
    // getImageData e putImageData
    const { table: tableRect } = easeRender.rects;
    const { openHH: openHHRect } = embeddedRects;
    const openHHRectBottom = openHHRect.y + openHHRect.height;

    // NOTE:: Os embededed controls e legenda, tem de ficar abaixo da linha (370)
    // Adicionado o desconto do button 'OPEN HAND HISTORY' (desaparecia quando 
    // o pote era arrastado)

    const background = winner
        ? this.context.getImageData(tableRect.x, openHHRectBottom, 792, 340)
        : null;

    const seatFixed = getDisplayPosition(winner, tableMax)?.seatFixed;

    return () => {

        // NOTE:: Em `count === 0` tem o setTransform() sync, pot parado.
        // Os restantes (setInterval) pot animado

        if (count >= frames) clearInterval(this.inter);

        const chipsOffSets = makeChipsOffSetsAbsx(count);

        if (count > 0) {

            this.context.putImageData(background, tableRect.x, openHHRectBottom);

            this.context.setTransform(1, 0, 0, 1, tableRect.x, tableRect.y);

            drawDragValue.call(this, chipsOffSets, text, seatFixed);
        }

        chipsOffSets.forEach(v => {

            const chip = chips[v.index];

            this.context.drawImage(chip, v.x, v.y);
        });

        count++;
    };
};

/**
 * @this {View}
 * @param {HistoryT} history 
 * @param {number} tableMax
 */
export default function (history, tableMax, displayValueAbsx) {

    const { chips } = this.images;

    const chipStyle = {
        width: head(chips).width,
        margin: 1
    };

    const winner = history.players.find(v => v.collect);

    const amount = winner?.collect ?? getMiddlePotAmount(history);

    const chipsOutSets = makeChipsOutSets(amount, chipStyle);

    const target = getDisplayPosition(winner, tableMax)?.betChips;

    const makeChipsOffSetsAbsx = makeChipsOffSets(chipsOutSets, chipStyle, target);

    const text = displayValueAbsx(amount);

    const drawAbsx = draw.call(this, makeChipsOffSetsAbsx, text, winner, tableMax);

    if (winner) this.inter = setInterval(drawAbsx, 30);

    drawAbsx();
}

export const testables = {

    makeChipsOutSets
};