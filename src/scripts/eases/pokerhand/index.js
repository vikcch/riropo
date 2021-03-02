import { Player, PlayerT } from '@/scripts/units/player';

import { History, HistoryT } from '@/scripts/units/history';

import createPlayer from './create-player';
import createHistory from './create-history';
import { rear } from '@/scripts/units/fns';

import { Delimiters } from '@/scripts/units/delimiters';
import { phase } from '@/scripts/units/enums';


/**
 * 
 * @param {HistoryT[]} histories 
 */
const fixShowCardsOnAllIn = histories => {

    const allInIndex = histories.findIndex(v => v.allIn);

    const finalHistory = rear(histories);

    const finalplayers = finalHistory.players.filter(v => v.holeCards);

    const newHistories = histories.map((history, i) => {

        if (i < allInIndex) return history;

        finalplayers.forEach(finalplayer => {

            const found = history.players.find(v => v.seat === finalplayer.seat);

            found.holeCards = finalplayer.holeCards;
        });

        if (history.phase === phase.conclusionShows) return;
        else return history;
    });

    const historyShowCards = {
        ...newHistories[allInIndex - 1],
        players: newHistories[allInIndex].players,
        line: 'Showing cards'
    };

    newHistories.splice(allInIndex, 0, historyShowCards);

    return newHistories.filter(Boolean);
};

export default {

    /**
     * 
     * @param {string[]} lines 
     * @param {number} buttonSeat 
     * @returns {Player[]} 
     */
    createPlayers(lines, buttonSeat) {

        // TODO:: make history, sendo cada jogada

        const { getPlayersInfoLines, getHeroName, makeTablePositions,
            getPlayerName, getPlayerStack, getPlayerSeat, getPlayerBounty,
            getDealtedHoleCards
        } = createPlayer;

        const playersLines = getPlayersInfoLines(lines);

        const heroName = getHeroName(lines);

        const tablePositions = makeTablePositions(playersLines, buttonSeat);

        const holeCardsDealted = getDealtedHoleCards(lines);

        const players = playersLines.map(line => {

            const name = getPlayerName(line);

            const stack = getPlayerStack(line);

            const seat = getPlayerSeat(line);

            const bounty = getPlayerBounty(line);

            const isButton = seat === buttonSeat;

            const isHero = name === heroName;

            const { position } = tablePositions.find(x => x.seat === seat);

            const holeCards = holeCardsDealted.find(x => x.name === name)?.holeCards;

            return Player({ name, stack, seat, position, bounty, isButton, isHero, holeCards });
        });

        return players;
    },


    /**
     * 
     * @param {string[]} lines 
     * @param {Player[]} players 
     * @returns {HistoryT[]}
     */
    createHistories(lines, players) {

        const delimiters = Delimiters();

        const posts = createHistory.posts(lines, players, delimiters);

        /** @type {HistoryT[]} */
        const histories = [posts];

        const a = 'activity', s = 'street';
        const series = [a, s, a, s, a, s, a];

        while (!delimiters.done) {

            const lastHistory = rear(histories);

            const stage = series.shift();

            const rows = createHistory[stage](lines, lastHistory, delimiters);
            histories.push(...rows);
        }

        const lastHistory = rear(histories);
        const conclusions = createHistory.conclusion(lines, lastHistory);
        histories.push(...conclusions);

        const hasAllin = histories.some(v => v.allIn);

        if (hasAllin) return fixShowCardsOnAllIn(histories);
        else return histories;
    }
}
