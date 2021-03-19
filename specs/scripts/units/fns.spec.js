import testables from '@/scripts/units/fns.js';

const assert = require('assert');

describe('units-fns', function () {

    describe('1# getLineCards', function () {

        const fn = testables.twoDecimalOrWhole;

        it('should return two deciamals or whole number', function () {

            const p = .34234;

            assert.deepStrictEqual(fn(p), '0.34');
        });

        it('should return two deciamals or whole number', function () {

            const p = 2;

            assert.deepStrictEqual(fn(p), '2');
        });

        it('should return two deciamals or whole number', function () {

            const p = 1.9999999999999998;

            assert.deepStrictEqual(fn(p), '2');
        });

        it('should return two deciamals or whole number', function () {

            const p = 1.9;

            assert.deepStrictEqual(fn(p), '1.90');
        });

    });


    describe('2# thousandSeparator', function () {

        const fn = testables.thousandSeparator;

        it('should return the value with a thousand separator', function () {

            const p = '1234';

            assert.deepStrictEqual(fn(p), '1,234');
        });

        it('should return the value with a thousand separator', function () {

            const p = '12345';

            assert.deepStrictEqual(fn(p), '12,345');
        });

        it('should return the value with a thousand separator', function () {

            const p = '123456';

            assert.deepStrictEqual(fn(p), '123,456');
        });

        it('should return the value with a thousand separator', function () {

            const p = '123';

            assert.deepStrictEqual(fn(p), '123');
        });

        it('should return the value with a thousand separator', function () {

            const p = '12';

            assert.deepStrictEqual(fn(p), '12');
        });

        it('should return the value with a thousand separator', function () {

            const p = '12.99';

            assert.deepStrictEqual(fn(p), '12.99');
        });

        it('should return the value with a thousand separator', function () {

            const p = '8123456.99';

            assert.deepStrictEqual(fn(p), '8,123,456.99');
        });

        it('should return the value with a thousand separator', function () {

            const p = '-456.99';

            assert.deepStrictEqual(fn(p), '-456.99');
        });

        it('should return the value with a thousand separator', function () {

            const p = '-8123456.99';

            assert.deepStrictEqual(fn(p), '-8,123,456.99');
        });

    });


});