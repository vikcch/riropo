import { PlayerT } from '@/scripts/units/player';

/**
 * 
 * @param {object} obj
 * @param {PlayerT[]} obj.players
 * @param {PlayerT} obj.player
 * @param {number} obj.pot
 * @param {string[]} obj.streetCards
 * @param {string} obj.action
 * @param {string} obj.line
 * @param {number} obj.lineIndex
 * @param {PlayerT} obj.nextPlayer
 * @param {boolean} obj.allIn não é copiado, procurar pelo primeiro..
 * @param {string} obj.phase 
 * 
 */
export const History = function ({
    players,
    pot = 0,
    streetCards = null,
    action = '',
    player,
    line = '',
    lineIndex = 0,
    nextPlayer = null,
    allIn = false,
    phase = ''
}) {

    return {

        players, pot, streetCards, action, player,
        line, lineIndex, nextPlayer, allIn, phase
    };
}

export const HistoryT = History({});