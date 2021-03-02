import { testables } from '@/scripts/units/biz.js';

const assert = require('assert');

describe('units-biz', function () {

    describe('# getLineCards', function () {

        const fn = testables.getLineCards;

        it('should return 5d Ad, the cards on an array', function () {

            const p = 'Dealt to vikcch [5d Ad]';

            assert.deepStrictEqual(fn(p), ['5d', 'Ad']);
        });

        it('should return Ac 4c Td, the cards on an array', function () {

            const p = '*** FLOP *** [Ac 4c Td]';

            assert.deepStrictEqual(fn(p), ['Ac', '4c', 'Td']);
        });

        it('should return Ac 7h 6h 8s, the cards on an array', function () {

            const p = '*** TURN *** [Ac 7h 6h] [8s]';

            assert.deepStrictEqual(fn(p), ['Ac', '7h', '6h', '8s']);
        });

        it('should return Ac 7h 6h 8s 4c, the cards on an array', function () {

            const p = '*** RIVER *** [Ac 7h 6h 8s] [4c]';

            assert.deepStrictEqual(fn(p), ['Ac', '7h', '6h', '8s', '4c']);
        });

        it('should return Kd 8h, the cards on an array', function () {

            const p = 'pozilgas: shows [Kd 8h] (a pair of Aces)';

            assert.deepStrictEqual(fn(p), ['Kd', '8h']);
        });

        it('should return Qh Th, the cards on an array', function () {

            const p = 'Seat 6: pozilgas (button) mucked [Qh Th]';

            assert.deepStrictEqual(fn(p), ['Qh', 'Th']);
        });
    });

    describe('# 2 collectedAmount', function () {

        const fn = testables.collectedAmount;

        it('should return the collected value', function () {

            const line = 'PoketAces990 collected €0.04 from pot';

            const anticipate = 0.04;

            assert.strictEqual(fn(line), anticipate);
        });
    });

    describe('# 3 uncalledAmount', function () {

        const fn = testables.uncalledAmount;

        it('should return the uncalled amount', function () {

            const line = 'Uncalled bet (€0.01) returned to AndréRPoker';

            const anticipate = 0.01;

            assert.strictEqual(fn(line), anticipate);
        });
    });

    describe('# 4 actionAmount', function () {

        const fn = testables.actionAmount;

        it('should return the line value', function () {

            const line = 'guix38100: raises 65446 to 71446 and is all-in';

            const anticipate = 71446;

            assert.strictEqual(fn(line), anticipate);

        });

        it('should return the line value', function () {

            const line = 'maria and is all-in: raises 88450 to 114000 and is all-in';

            const anticipate = 114000;

            assert.strictEqual(fn(line), anticipate);

        });


    });

});