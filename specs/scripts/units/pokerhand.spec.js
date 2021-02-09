import { testables } from '@/scripts/units/pokerhand.js';

const assert = require('assert');

describe('units-pokerhand', function () {

    describe('# getButtonSeat', function () {

        const fn = testables.getButtonSeat;

        it('should return 5, the button seat', function () {

            const p = ['', "Table 'Akiyama II' 6-max Seat #5 is the button"];

            assert.strictEqual(fn(p), 5);

        });
    });

    describe('# getTableMax', function () {

        const fn = testables.getTableMax;

        it('should return 6, the table max', function () {

            const p = ['', "Table 'Akiyama II' 6-max Seat #5 is the button"];

            assert.strictEqual(fn(p), 6);

        });
    });
});