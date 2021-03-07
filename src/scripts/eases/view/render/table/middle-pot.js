import fns, { displayValue, head, pureValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import { PlayerT } from '@/scripts/units/player';
import View from '@/scripts/view';
import displayPositions from '@/scripts/units/display-positions';
import biz from '@/scripts/units/biz';
import easeRender from '@/scripts/eases/view/render/index'


const frames = 10;

// STOPSHIP:: displayPositions(6) <- hardcoded

/**
 * 
 * @param {PlayerT} player 
 * @returns {object|undefined}
 */
const getDisplayPosition = player => {

    if (!player) return;

    const findPlayer = x => player.seat === x.seatAjusted;

    const displayPosition = displayPositions(6).find(findPlayer);

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
            x: i * 22 + 1 * i,
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
    this.context.textAlign = textAlign;

    this.context.textBaseline = 'bottom';
    this.context.fillStyle = 'red';

    const offSetX = textAlign === 'left' ? chipsSpan + 4 : -4;

    this.context.fillText(text, x + offSetX, y + 18);
};

/**
 * @this {View}
 * @param {*} makeChipsOffSetsAbsx 
 * @param {number} amount 
 * @param {PlayerT} winner
 */
const draw = function (makeChipsOffSetsAbsx, amount, winner) {

    const { chips } = this.images;

    const text = displayValue(amount);

    let count = 0;

    // NOTE:: Os metodos translate() e setTransform() não afectam
    // getImageData e putImageData
    const { table: tableRect } = easeRender.rects;

    const background = winner
        ? this.context.getImageData(tableRect.x, tableRect.y, 792, 400)
        : null;

    const seatFixed = getDisplayPosition(winner)?.seatFixed;

    return () => {

        // NOTE:: Em `count === 0` tem o setTransform() sync, pot parado.
        // Os restantes (setInterval) pot animado

        if (count >= frames) clearInterval(this.inter);

        const chipsOffSets = makeChipsOffSetsAbsx(count);

        if (count > 0) {

            this.context.putImageData(background, tableRect.x, tableRect.y);

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
 */
export default function (history) {

    const { chips } = this.images;

    const amount = getMiddlePotAmount(history);

    const chipStyle = {
        width: head(chips).width,
        margin: 1
    };

    const chipsOutSets = makeChipsOutSets(amount, chipStyle);

    const winner = history.players.find(v => v.collect);

    const target = getDisplayPosition(winner)?.betChips;

    const makeChipsOffSetsAbsx = makeChipsOffSets(chipsOutSets, chipStyle, target);

    const drawAbsx = draw.call(this, makeChipsOffSetsAbsx, amount, winner);

    if (winner) this.inter = setInterval(drawAbsx, 30);

    drawAbsx();
};

export const testables = {

    makeChipsOutSets
};