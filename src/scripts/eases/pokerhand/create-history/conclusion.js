import biz from '@/scripts/units/biz';
import { phase } from '@/scripts/units/enums';
import { PlayerT } from '@/scripts/units/player';
import { HistoryT } from '@/scripts/units/history';

/**
 * 
 * @param {string[]} lines 
 * @param {number} seat 
 * @returns {string}
 */
const getMuckedLine = (lines, seat) => {

    const summaryIndex = lines.indexOf('*** SUMMARY ***');

    const target = `Seat ${seat}: `;

    return lines.find((v, i) => v.startsWith(target) && i > summaryIndex);
};

export default {

    // PoketAces990: shows [2d 2s] (two pair, Queens and Deuces)
    // vikcch: mucks hand 
    // PoketAces990 collected €0.04 from pot

    // ou 

    // Uncalled bet (€0.01) returned to AndréRPoker
    // AndréRPoker collected €0.02 from pot

    // se tiver side pot:
    // vikcch collected 2120 from side pot
    // vikcch collected 14448 from main pot


    // TODO:: em all-ins mostrar logo as cartas

    /**
     * 
     * @param {string} lines
     * @param {PlayerT[]} players 
     * @returns {boolean|undefined}
     */
    shows: (line, players) => {

        const showsIndex = line.lastIndexOf(': shows [');

        if (showsIndex !== -1) {

            const name = line.substring(0, showsIndex);

            const player = players.find(x => x.name === name);

            player.holeCards = biz.getLineCards(line);

            return phase.conclusionShows;
        }
    },

    /**
     * 
     * @param {string} line
     * @param {PlayerT[]} players 
     * @param {string[]} lines 
     * @returns {boolea|undefined}
     */
    mucks: (line, players, lines) => {

        const mucksIndex = line.lastIndexOf(': mucks hand');

        // TODO:: apagar as holecards quando é o hero a fazer muck

        if (mucksIndex !== -1) {

            const name = line.substring(0, mucksIndex);

            const player = players.find(x => x.name === name);

            const muckedLine = getMuckedLine(lines, player.seat);

            player.holeCards = biz.getLineCards(muckedLine);

            return phase.conclusionMucks;
        }
    },

    /**
     * 
     * @param {string} lines
     * @param {PlayerT[]} players 
     * @returns {boolea|undefined}
     */
    collects: (line, players) => {

        const matchCollected = /\scollected\s.+pot$/gm.exec(line);

        if (matchCollected) {

            const name = line.substring(0, matchCollected.index);

            const player = players.find(x => x.name === name);

            player.collect = biz.collectedAmount(line);

            return phase.conclusionCollects;
        }
    },


    /**
     * Actualiza a stack do ultimo winner em side pots
     * 
     * @param {HistoryT} lastHistory 
     * @param {PlayerT[]} newPlayers 
     */
    lastWinnerCollects: (lastHistory, newPlayers) => {

        const lastWinner = lastHistory.players.find(v => v.collect);

        if (lastWinner) {

            const player = newPlayers.find(v => v.seat === lastWinner.seat);

            // NOTE:: Não usa prop `stack` para facilitar as contas no profit.
            // Necessário para em side pots ter a stack visualmente actualizada
            player.gatherStack += lastWinner.collect;
        }
    }
};