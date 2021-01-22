// import { testables } from '@root/src/scripts/units/pokerhand.js';
import { testables } from '@@/scripts/units/pokerhand.js';
// import { testables } from '';
// import { testables } from '../../../src/scripts/units/pokerhand';

const assert = require('assert');

describe('units-pokerhand', function () {

    describe('# getButtonSeat', function () {

        const fn = testables.getButtonSeat;

        it('should return 5, the button seat', function () {

            const p = ['', "Table 'Akiyama II' 6-max Seat #5 is the button "];

            assert.strictEqual(fn(p), 5);

        });
    });

    // describe('#indexOf()', function () {

    //     it('should return -1 when the value is not present', function () {
    //         assert.strictEqual([1, 2, 3].indexOf(4), -1);
    //     });
    // });
});