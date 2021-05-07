import { pipe } from "@/scripts/units/fxnl";

const addGapBetweenHands = value => value.replace(/\n\n\n/gm, '\n\n\n\n');

const addCarriageReturn = value => value.replace(/\n/gm, '\r\n');

const removeExtraDealts = value => value.replace(/^Dealt to .+ \r\n/gm, '');

const patchShowdowm = value => value.replace(/SHOWDOWN/g, 'SHOW DOWN');

// Running twice
const removeFirst = value => value.replace(/FIRST /g, '');

// NOTE:: dá pau se subtituir o "SECOND"
// const removeSecond = value => value.replace(/SECOND /g, '');

const filterLegal = value => value.length > '\r\n\r\n'.length;

const makeArray = value => value
    .split(/\r\n\r\n\r\n\r\n/)
    .filter(filterLegal)
    .reverse();

const patchShows = value => value.map((handLog) => {

    const arrHandLog = handLog.split('\r\n');

    const shows = arrHandLog.filter(v => v.includes(': shows ['));

    if (shows.length === 0) return handLog;

    const others = arrHandLog.filter(v => !v.includes(': shows ['));

    const showdownIndex = others.indexOf('*** SHOW DOWN ***');

    others.splice(showdownIndex + 1, 0, ...shows);

    return others.join('\r\n');
});

const joinHands = value => value.join('\r\n\r\n\r\n\r\n');

/**
 * As hand histories nesta sala vêm ao contrario... O software em vez
 * acrescentar a hand por baixo das outras, acrescenta entes, ou seja
 * a primeira hand do file foi a ultima a ser jogada.
 * 
 * Todos os nomes dos players este em hex, não há problema de fazer 
 * replace do "SHOWDOWN"
 * 
 * @param {string} log 
 */
export default function (log) {

    const r = pipe(addGapBetweenHands, addCarriageReturn,
        removeExtraDealts, patchShowdowm, removeFirst,
        makeArray, patchShows, joinHands
    )(log);

    return r;
}
