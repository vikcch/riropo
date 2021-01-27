import fns from '../../units/fns';

/**
 * Exclui as duas primeiras linhas do log e acaba nos posts
 * 
 * @param {string[]} lines
 * @returns {string[]}
 */
const getPlayersInfoLines = lines => {

    // PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]
    // Table 'Akiyama II' 6-max Seat #5 is the button
    // Seat 2: vikcch (€2 in chips) 
    // Seat 5: ruipinho1 (€5.60 in chips) 
    // ruipinho1: posts small blind €0.01
    // vikcch: posts big blind €0.02
    // *** HOLE CARDS ***

    const holeCardsLineCount = lines.indexOf('*** HOLE CARDS ***');

    // Não inclui a linha '*** HOLE CARDS ***'
    const barePlayersLines = lines.slice(2, holeCardsLineCount);

    const regSeat = value => /^Seat\s\d:\s/gm.test(value);
    const regChips = value => {

        return /\)\s(|is\ssitting\sout)$/gm.test(value);
    };

    return barePlayersLines.filter(x => regSeat(x) && regChips(x));
};

/**
 * 
 * @param {string} line
 * @returns {string}
 */
const getPlayerName = line => {

    // Seat 1: SteveAnoki (2120 in chips) is sitting out
    // Seat 5: ruipinho1 (€5.60 in chips) 
    // Seat 7: Ericaao (50680 in chips, €116 bounty) 

    const startAt = 'Seat *: '.length;

    const finishAt = line.lastIndexOf(' (');

    return line.substring(startAt, finishAt);
};

/**
 * 
 * @param {string} line
 * @returns {number}
 */
const getPlayerStack = line => {

    // Seat 1: SteveAnoki (2120 in chips) is sitting out
    // Seat 5: ruipinho1 (€5.60 in chips) 
    // Seat 7: Ericaao (50680 in chips, €116 bounty) 

    const bracketIndex = line.lastIndexOf('(');

    const stackPart = line.substring(bracketIndex);

    const finishAt = stackPart.indexOf(' in chips');

    const stackStr = stackPart.slice(0, finishAt);

    return Number(fns.removeMoney(stackStr));
};

/**
 * 
 * @param {string} line
 * @returns {number}
 */
const getPlayerSeat = line => {

    // Seat 5: ruipinho1 (€5.60 in chips) 

    return Number(line.substring(5, 6));
};

/**
 * 
 * @param {string} line
 * @returns {number}
 */
const getPlayerBounty = line => {

    // Seat 1: SteveAnoki (2120 in chips) is sitting out
    // Seat 5: ruipinho1 (€5.60 in chips) 
    // Seat 7: Ericaao (50680 in chips, €116 bounty) 

    const bracketIndex = line.lastIndexOf('(');

    const stackPart = line.substring(bracketIndex);

    const match = stackPart.match(/(|\d+)(|\d+\.\d{2})(?=\sbounty)/g);

    return match ? Number(match[0]) : null;
};

/**
 * 
 * @param {string[]} playersLines 
 * @param {number} buttonSeat 
 * @returns {{position:string, seat:number}[]}
 */
const makeTablePositions = function (playersLines, buttonSeat) {

    const getPositionsHU = function () {

        const getPosition = p => p.seat === buttonSeat ? 'BU' : 'BB';

        const setPositionsHU = p => p.position = getPosition(p);

        playersSeats.forEach(setPositionsHU);

        return playersSeats;
    };

    const getPositionsNonHU = function () {

        const positions = ['BB', 'SB', 'BU', 'CO', 'HJ', 'LJ', 'MP', 'UTG+2', 'UTG+1', 'UTG'];

        while (playersSeats[playersSeats.length - 3].seat !== buttonSeat) {

            playersSeats.unshift(playersSeats.pop());
        }

        playersSeats.reverse().forEach((p, i) => {
            Object.assign(p, { position: positions[i] });
        });

        return playersSeats;
    };

    const playersSeats = playersLines.map(x => ({ seat: getPlayerSeat(x) }));

    const isHeadsUp = playersSeats.length === 2;

    return isHeadsUp ? getPositionsHU() : getPositionsNonHU();
};

/**
 * 
 * @param {string[]} lines
 * @returns {string}
 */
const getHeroName = (lines) => {

    // ...
    // *** HOLE CARDS ***
    // Dealt to vikcch [5d Qc]

    const holeCardsLineCount = lines.indexOf('*** HOLE CARDS ***');

    const dealtToLine = lines[holeCardsLineCount + 1];

    const lenDealtTo = 'Dealt to '.length;

    const bracketIndex = dealtToLine.lastIndexOf('[');

    const hero = dealtToLine.substring(lenDealtTo, bracketIndex - 1);

    return hero;
};

export default {
    getPlayersInfoLines,
    getPlayerName,
    getPlayerStack,
    getPlayerSeat,
    getPlayerBounty,
    makeTablePositions,
    getHeroName
};