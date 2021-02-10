import { testables } from '@/scripts/units/biz.js';

const assert = require('assert');

describe('units-biz', function () {

    describe('# getLineCards', function () {

        const fn = testables.getLineCards;
/* 
        it('should return 5d Ad, the cards on an array', function () {

            const p = 'Dealt to vikcch [5d Ad]';

            assert.deepStrictEqual(fn(p), ['5d', 'Ad']);
        });

        it('should return Ac 4c Td, the cards on an array', function () {

            const p = '*** FLOP *** [Ac 4c Td]';

            assert.deepStrictEqual(fn(p), ['Ac', '4c', 'Td']);
        }); */

        it('should return Ac 7h 6h 8s, the cards on an array', function () {

            const p = '*** TURN *** [Ac 7h 6h] [8s]';

            assert.deepStrictEqual(fn(p), ['Ac', '7h', '6h', '8s']);
        });
        
        it('should return Ac 7h 6h 8s 4c, the cards on an array', function () {

            const p = '*** RIVER *** [Ac 7h 6h 8s] [4c]';

            assert.deepStrictEqual(fn(p), ['Ac', '7h', '6h', '8s', '4c']);
        });

      /*   it('should return Kd 8h, the cards on an array', function () {

            const p = 'pozilgas: shows [Kd 8h] (a pair of Aces)';

            assert.deepStrictEqual(fn(p), ['Kd', '8h']);
        });

        it('should return Qh Th, the cards on an array', function () {

            const p = 'Seat 6: pozilgas (button) mucked [Qh Th]';

            assert.deepStrictEqual(fn(p), ['Qh', 'Th']);
        }); */
    });

});