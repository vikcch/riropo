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
            getPlayerName, getPlayerStack, getPlayerSeat, getPlayerBounty
        } = createPlayer;

        const playersLines = getPlayersInfoLines(lines);

        const heroName = getHeroName(lines);

        const tablePositions = makeTablePositions(playersLines, buttonSeat);

        const players = playersLines.map(x => {

            const name = getPlayerName(x);

            const stack = getPlayerStack(x);

            const seat = getPlayerSeat(x);

            const bounty = getPlayerBounty(x);

            const isButton = seat === buttonSeat;

            const isHero = name === heroName;

            const position = tablePositions.find(x => x.seat === seat).position;

            return Player({ name, stack, seat, position, bounty, isButton, isHero });
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

        // console.log(players);
        // console.log(histories);
        // console.log('+++++++');


        return histories;
        // console.log(delimiters);
    }
}
