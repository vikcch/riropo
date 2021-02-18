import { Player, PlayerT } from '@/scripts/units/player';

import { History } from '@/scripts/units/history';

import createPlayer from './create-player';
import createHistory from './create-history';
import { rear } from '@/scripts/units/fns';

import { Delimiters } from '@/scripts/units/delimiters';

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
     * @returns {History[]}
     */
    createHistories(lines, players) {

        const delimiters = Delimiters();

        const posts = createHistory.posts(lines, players, delimiters);

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


        // console.log(players);
        // console.log(histories);
        // console.log('+++++++');


        return histories;
        // console.log(delimiters);
    }
}
