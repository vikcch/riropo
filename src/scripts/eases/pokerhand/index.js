import Player from '@/scripts/units/player';
import History from '@/scripts/units/history';

import createPlayer from './create-player';
import createHistory from './create-history';
import { head } from '@/scripts/units/fns';

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

        const delimiters = {
            index: 0,
            names: ['HOLE CARDS', 'FLOP', 'TURN', 'RIVER', 'SHOW DOWN', 'SUMMARY'],
            get current() { return `*** ${this.names[this.index]} ***`; },
        };

        const histories = [];

        const posts = createHistory.posts(lines, players, delimiters);
        histories.push(posts);

        const lastHistory = head(histories);

        const activity = createHistory.activity(lines, lastHistory, delimiters);
        histories.push(...activity);




        console.log(players);
        console.log(histories);
        console.log('+++++++');

        // console.log(delimiters);
    }
}
