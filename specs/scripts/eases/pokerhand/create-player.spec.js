// import { assert } from 'chai';
import testables from '@/scripts/eases/pokerhand/create-player';

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

    describe('# 4 getPlayersInfoLines', function () {

        const fn = testables.getPlayersInfoLines;

        it('should return only Players info lines', function () {

            const lines = [
                "PokerStars Hand #206033306253: Tournament #2714160813, €116.50+€116.00+€17.50 EUR Hold'em No Limit - Level V (300/600) - 2019/11/10 20:12:50 WET [2019/11/10 15:12:50 ET]",
                "Table '2714160813 219' 9-max Seat #3 is the button",
                'Seat 1: EXXPL0ITRRRR (89631 in chips, €174 bounty) ',
                'Seat 2: BonneChance1956 (54345 in chips, €116 bounty) ',
                'Seat 3: vikcch (31514 in chips, €116 bounty) ',
                'Seat 4: L€urop€an (70660 in chips, €116 bounty) ',
                'Seat 5: Premove10 (56555 in chips, €116 bounty) ',
                'Seat 6: MAILI SAIRES (35617 in chips, €116 bounty) ',
                'Seat 7: Ericaao (50755 in chips, €116 bounty) ',
                'Seat 8: surfingwithU (69802 in chips, €116 bounty) ',
                'Seat 9: tonyrastas (40153 in chips, €116 bounty) ',
                'EXXPL0ITRRRR: posts the ante 75',
                'BonneChance1956: posts the ante 75',
                'vikcch: posts the ante 75',
                'L€urop€an: posts the ante 75',
                'Premove10: posts the ante 75',
                'MAILI SAIRES: posts the ante 75',
                'Ericaao: posts the ante 75',
                'surfingwithU: posts the ante 75',
                'tonyrastas: posts the ante 75',
                'L€urop€an: posts small blind 300',
                'Premove10: posts big blind 600',
                '*** HOLE CARDS ***'
            ];

            const anticipate = [
                'Seat 1: EXXPL0ITRRRR (89631 in chips, €174 bounty) ',
                'Seat 2: BonneChance1956 (54345 in chips, €116 bounty) ',
                'Seat 3: vikcch (31514 in chips, €116 bounty) ',
                'Seat 4: L€urop€an (70660 in chips, €116 bounty) ',
                'Seat 5: Premove10 (56555 in chips, €116 bounty) ',
                'Seat 6: MAILI SAIRES (35617 in chips, €116 bounty) ',
                'Seat 7: Ericaao (50755 in chips, €116 bounty) ',
                'Seat 8: surfingwithU (69802 in chips, €116 bounty) ',
                'Seat 9: tonyrastas (40153 in chips, €116 bounty) ',
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

    describe('# 1 getPlayerName', function () {

        const fn = testables.getPlayerName;

        it('should return Joanana', function () {

            const line = 'Seat 7: Joanana (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 'Joanana');
        });
    });

    describe('# 2 getPlayerName', function () {

        const fn = testables.getPlayerName;

        it('should return Joan (ana', function () {

            const line = 'Seat 7: Joan (ana (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 'Joan (ana');
        });
    });

    describe('# 1 getPlayerStack', function () {

        const fn = testables.getPlayerStack;

        it('should return 50680', function () {

            const line = 'Seat 7: Ericaao (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 50680);
        });
    });

    describe('# 2 getPlayerStack', function () {

        const fn = testables.getPlayerStack;

        it('should return 5.60', function () {

            const line = 'Seat 5: ruipinho1 (€5.60 in chips) ';

            assert.strictEqual(fn(line), 5.60);
        });
    });

    describe('# 3 getPlayerStack', function () {

        const fn = testables.getPlayerStack;

        it('should return 50680', function () {

            const line = 'Seat 7: Ericaao (50680 in chips) ';

            assert.strictEqual(fn(line), 50680);
        });
    });

    describe('# 1 getPlayerBounty', function () {

        const fn = testables.getPlayerBounty;

        it('should return 116', function () {

            const line = 'Seat 7: Ericaao (50680 in chips, €116 bounty) ';

            assert.strictEqual(fn(line), 116);
        });
    });

    describe('# 2 getPlayerBounty', function () {

        const fn = testables.getPlayerBounty;

        it('should return 116.54', function () {

            const line = 'Seat 7: Ericaao (50680 in chips, €116.54 bounty) ';

            assert.strictEqual(fn(line), 116.54);
        });
    });

    describe('# 3 getPlayerBounty', function () {

        const fn = testables.getPlayerBounty;

        it('should return null', function () {

            const line = 'Seat 7: Ericaao (50680 in chips) ';

            assert.strictEqual(fn(line), null);
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