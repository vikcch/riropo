// import { assert } from 'chai';
// import { testables } from '../../../src/scripts/eases/pokerhand';
import { testables } from '@/scripts/eases/pokerhand';

// import { testables } from '@@/scripts/eases/pokerhand';

// const testables = require('../../../src/scripts/eases/pokerhand');
const assert = require('assert');

describe('ease-pokerhand', function () {

    describe('# getPlayersInfoLines', function () {

        const fn = testables.getPlayersInfoLines;

        it('should return only Players info lines', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
                "Table 'Akiyama II' 6-max Seat #5 is the button",
                'Seat 2: vikcch (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) ',
                'ruipinho1: posts small blind €0.01',
                'vikcch: posts big blind €0.02',
                '*** HOLE CARDS ***',
            ];

            const anticipate = [
                'Seat 2: vikcch (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) '
            ];

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('# 2 getPlayersInfoLines', function () {

        const fn = testables.getPlayersInfoLines;

        it('should return only Players info lines', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
                "Table 'Akiyama II' 6-max Seat #5 is the button",
                'Seat 2: Seat 9: vikcch (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) ',
                'ruipinho1: posts small blind €0.01',
                'Seat 9: vikcch: posts big blind €0.02',
                '*** HOLE CARDS ***',
            ];

            const anticipate = [
                'Seat 2: Seat 9: vikcch (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) '
            ];

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });
    describe('# 3 getPlayersInfoLines', function () {

        const fn = testables.getPlayersInfoLines;

        it('should return only Players info lines', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
                "Table 'Akiyama II' 6-max Seat #5 is the button",
                'Seat 2: Seat 9: vikcch in chips) (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) ',
                'ruipinho1: posts small blind €0.01',
                'Seat 9: vikcch in chips) : posts big blind €0.02',
                '*** HOLE CARDS ***',
            ];

            const anticipate = [
                'Seat 2: Seat 9: vikcch in chips) (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) '
            ];

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('# getHeroName', function () {

        const fn = testables.getHeroName;

        it('should return vikcch', function () {

            const lines = [
                '*** HOLE CARDS ***',
                'Dealt to vikcch [5h 3c]'
            ]

            assert.strictEqual(fn(lines), 'vikcch');
        });
    });

    describe('# 2 getHeroName', function () {

        const fn = testables.getHeroName;

        it('should return vik[cch', function () {

            const lines = [
                '*** HOLE CARDS ***',
                'Dealt to vik[cch [5h 3c]'
            ]

            assert.strictEqual(fn(lines), 'vik[cch');
        });
    });

    describe('# getPlayerName', function () {

        const fn = testables.getPlayerName;

        it('should return Joanana', function () {

            const line = 'Seat 7: Joanana (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 'Joanana');
        });
    });

    describe('# getPlayerStack', function () {

        const fn = testables.getPlayerStack;

        it('should return 50680', function () {

            const line = 'Seat 7: Ericaao (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 50680);
        });
    });

    describe('# 1 makeTablePositions', function () {

        const fn = testables.makeTablePositions;

        it('should return only Players info lines', function () {

            const lines = [
                'Seat 2: Seat 9: vikcch in chips) (€2 in chips) ',
                'Seat 5: ruipinho1 (€5.60 in chips) ',
            ];

            const anticipate = [
                { seat: 2, position: 'BB' },
                { seat: 5, position: 'BU' },
            ];

            assert.deepStrictEqual(fn(lines, 5), anticipate);
        });
    });

    describe('# 2 makeTablePositions', function () {

        const fn = testables.makeTablePositions;

        it('should return only Players info lines', function () {

            const lines = [
                'Seat 1: Amts65 (€0.94 in chips) ',
                'Seat 2: bilboubou78 (€2.55 in chips) ',
                'Seat 3: vikcch (€2 in chips) ',
                'Seat 4: ganalallama (€2.07 in chips) ',
                'Seat 5: Jotaoerredan (€1.92 in chips) ',
                'Seat 6: nofunfuma (€2 in chips) '
            ];

            const anticipate = [
                { seat: 3, position: 'BB' },
                { seat: 2, position: 'SB' },
                { seat: 1, position: 'BU' },
                { seat: 6, position: 'CO' },
                { seat: 5, position: 'HJ' },
                { seat: 4, position: 'LJ' },
            ];

            assert.deepStrictEqual(fn(lines, 1), anticipate);
        });
    });



});