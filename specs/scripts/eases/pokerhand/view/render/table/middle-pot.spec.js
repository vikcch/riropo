import { testables } from '@/scripts/eases/view/render/table/middle-pot';

const assert = require('assert');

describe('eases/view/render/table/middle-pot', function () {

    describe('# 1 makeChipsOutSets', function () {

        const fn = testables.makeChipsOutSets;

        it('should return stuff', function () {

             const anticipate = [
                { value: 'sasdfasdf: folds', index: 5 },
                { value: 'vik: calls 5', index: 6 },
                { value: 'rita: calls 3', index: 7 },
                { value: 'joana: checks', index: 8 },
            ];

            const chipStyle = {
                width: 22,
                margin: 1
            };

            assert.deepStrictEqual(fn(0.49, chipStyle), anticipate);
        });
 
    }); 

});