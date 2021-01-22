import Player from '../units/player';
import fns from '../units/fns';

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

        return /\sin\schips\)\s(|is\ssitting\sout)$/gm.test(value);
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

    const rightPart = line.slice(8);
    const rev = [...rightPart].reverse().join('');

    // +2 -> 1 porque é zero based, mais 1 por causa do espaço
    const inStr = rev.indexOf("(") + 2;

    return [...rev.slice(inStr)].reverse().join('');
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


    // OPTIMIZE:: string.prototype.lastIndexOf() existe :)
    const rev = [...line].reverse().join('');

    const inStr = rev.indexOf("(");

    const stackPart = ([...rev.slice(0, inStr)]).reverse().join('');

    const finishAt = stackPart.indexOf(' in chips');

    const stackStr = stackPart.slice(0, finishAt);

    return Number(fns.removeMoney(stackStr));
};

// TODO:: util reverse string


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
const getHeroName = (lines, players) => {

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

    /**
     * 
     * @param {string[]} lines 
     * @param {number} buttonSeat 
     * @returns {Player[]} 
     */
    createPlayers(lines, buttonSeat) {

        const holeCardsLineCount = lines.indexOf('*** HOLE CARDS ***');

        // const playersLines = lines.slice(2, holeCardsLineCount - 1);

        const playersLines = getPlayersInfoLines(lines);

        const heroName = getHeroName(lines);

        const tablePositions = makeTablePositions(playersLines, buttonSeat);

        const players = playersLines.map(x => {

            // TODO: name, stack, seat, position, isHero, isButton, bounty

            const name = getPlayerName(x);
            
            const stack = getPlayerStack(x);

            const seat = getPlayerSeat(x);

            const isButton = seat === buttonSeat;

            const isHero = name === heroName;

            const position = tablePositions.find(x => x.seat === seat).position;

            return Player({ name, stack, seat, position, isButton, isHero });
        });

        return players;
    }
}

export const testables = {

    getPlayersInfoLines,
    getPlayerStack,
    getPlayerName,
    getHeroName,
    makeTablePositions,
}


