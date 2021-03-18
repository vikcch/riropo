import testables from '@/scripts/eases/pokerhand/create-main-info';

const assert = require('assert');

describe('ease-pokerhand', function () {

    describe('#1 getRoom', function () {

        const fn = testables.getRoom;

        it('should return the poker room', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
            ];

            const anticipate = 'PokerStars';

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('#2 getDate', function () {

        const fn = testables.getDate;

        it('should return the date', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
            ];

            const anticipate = '2019/11/10';

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('#3 getGame', function () {

        const fn = testables.getGame;

        it('should return the game', function () {

            const lines = [
                "PokerStars Hand #206007536567:  Hold'em No Limit (€0.01/€0.02 EUR) - 2019/11/10 1:11:59 WET [2019/11/09 20:11:59 ET]",
            ];

            const anticipate = "Hold'em No Limit";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the game', function () {

            const lines = [
                "PokerStars Hand #223692675464: Tournament #3108826330, €9+€1 EUR Hold'em No Limit -",
            ];

            const anticipate = "Hold'em No Limit";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the game', function () {

            const lines = [
                "PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]",
            ];

            const anticipate = "Omaha Pot Limit";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the game', function () {

            const lines = [
                "PokerStars Hand #224556861132: Tournament #3144375700, 8500+1500 Hold'em No Limit - Match Round I, Level I (10/20) - 2021/03/07 16:00:37 WET [2021/03/07 11:00:37 ET]",
            ];

            const anticipate = "Hold'em No Limit";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the game', function () {

            const lines = [
                "PokerStars Hand #224527700690: Tournament #3126039768, Freeroll  Hold'em No Limit - Level I (10/20) - 2021/03/06 20:00:15 WET [2021/03/06 15:00:15 ET]",
            ];

            const anticipate = "Hold'em No Limit";

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('#4 getStakes', function () {

        const fn = testables.getStakes;

        it('should return the stakes', function () {

            const lines = [
                "PokerStars Hand #114439478289:  Omaha Pot Limit ($0.01/$0.02 USD) - 2014/04/07 16:22:45 WET [2014/04/07 11:22:45 ET]",
            ];

            const anticipate = "$0.01/$0.02 USD";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the stakes', function () {

            const lines = [
                "PokerStars Hand #223692675464: Tournament #3108826330, €9+€1 EUR Hold'em No Limit -",
            ];

            const anticipate = "€9+€1 EUR";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the stakes', function () {

            const lines = [
                "PokerStars Hand #224556861132: Tournament #3144375700, 8500+1500 Hold'em No Limit - Match Round I, Level I (10/20) - 2021/03/07 16:00:37 WET [2021/03/07 11:00:37 ET]",
            ];

            const anticipate = "8500+1500";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the stakes', function () {

            const lines = [
                "PokerStars Hand #224527700690: Tournament #3126039768, Freeroll  Hold'em No Limit - Level I (10/20) - 2021/03/06 20:00:15 WET [2021/03/06 15:00:15 ET]",
            ];

            const anticipate = "Freeroll";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

    });

    describe('#5 getHandId', function () {

        const fn = testables.getHandId;

        it('should return the hand id', function () {

            const lines = [
                "PokerStars Hand #224556861132: Tournament #3144375700, 8500+1500 Hold'em No Limit - Match Round I, Level I (10/20) - 2021/03/07 16:00:37 WET [2021/03/07 11:00:37 ET]",
            ];

            const anticipate = "224556861132";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

    });

    describe('#6 getBlinds', function () {

        const fn = testables.getBlinds;

        it('should return the blinds', function () {

            const lines = [
                "PokerStars Hand #96049596508:  Hold'em No Limit ($0.05/$0.10 USD) - 2013/03/24 3:14:45 ET",
                "Table 'Bernardina' 6-max Seat #5 is the button",
                "Seat 1: vikcch ($20 in chips) ",
                "Seat 2: westy2828 ($26.57 in chips) ",
                "Seat 3: IBAH35 ($8.57 in chips) ",
                "Seat 4: IvanVany ($23.94 in chips) ",
                "Seat 5: Saxos93 ($29.47 in chips) ",
                "Seat 6: batman899 ($21.35 in chips) ",
                "batman899: posts small blind $0.05",
                "vikcch: posts big blind $0.10",
                "vikcch: posts the ante $0.02",
                "westy2828: posts the ante $0.02"
            ];

            const anticipate = "$0.05/$0.10(+$0.02)";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the blinds', function () {

            const lines = [
                "PokerStars Hand #96049596508:  Hold'em No Limit ($0.05/$0.10 USD) - 2013/03/24 3:14:45 ET"
            ];

            const anticipate = "$0.05/$0.10";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the blinds', function () {

            const lines = [
                "PokerStars Hand #223144757797: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level XVI (1000/2000) - 2021/01/28 17:12:37 WET [2021/01/28 12:12:37 ET]",
                "Table '3108828470 6' 6-max Seat #1 is the button",
                "Seat 1: vikcch (48660 in chips) ",
                "Seat 2: BlockerdoNuts (85402 in chips) ",
                "Seat 3: Eduardeanu (25422 in chips) ",
                "Seat 4: SEB0709 (23444 in chips) ",
                "Seat 5: chibbio17 (70893 in chips) ",
                "Seat 6: billypoker88 (36025 in chips) ",
                "vikcch: posts the ante 250",
                "BlockerdoNuts: posts the ante 250",
                "Eduardeanu: posts the ante 250",
                "SEB0709: posts the ante 250",
            ];

            const anticipate = "1000/2000(+250)";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

    });


    describe('#7 getTableName', function () {

        const fn = testables.getTableName;

        it('should return the table name', function () {

            const lines = [
                "PokerStars Hand #223144757797: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level XVI (1000/2000) - 2021/01/28 17:12:37 WET [2021/01/28 12:12:37 ET]",
                "Table '3108828470 6' 6-max Seat #1 is the button",
            ];

            const anticipate = "3108828470 6";

            assert.deepStrictEqual(fn(lines), anticipate);
        });

        it('should return the table name', function () {

            const lines = [
                "PokerStars Hand #222470470999:  Hold'em No Limit (€0.01/€0.02 EUR) - 2021/01/10 18:23:30 WET [2021/01/10 13:23:30 ET]",
                "Table 'Holda III' 6-max Seat #2 is the button",
            ];

            const anticipate = "Holda III";

            assert.deepStrictEqual(fn(lines), anticipate);
        });
    });

    describe('#8 getTableMax', function () {

        const fn = testables.getTableMax;

        it('should return 6, the table max', function () {

            const p = ['', "Table 'Akiyama II' 6-max Seat #5 is the button"];

            assert.strictEqual(fn(p), 6);
        });
    });

    describe('#9 getCashSign', function () {

        const fn = testables.getCashSign;

        it('should return the currency sign for cash', function () {

            const p = ["PokerStars Hand #219047045850:  Hold'em No Limit (€0.01/€0.02 EUR) - 2020/10/04 5:38:12 WET [2020/10/04 0:38:12 ET]"];

            assert.strictEqual(fn(p), '€');
        });

        it('should return the currency sign for cash', function () {

            const p = ["PokerStars Hand #223140871801: Tournament #3108828470, €9+€1 EUR Hold'em No Limit - Level I (25/50) - 2021/01/28 15:01:46 WET [2021/01/28 10:01:46 ET]"];

            assert.strictEqual(fn(p), '');
        });

        it('should return the currency sign for cash', function () {

            const p = ["PokerStars Hand #219047045850:  Hold'em No Limit (€0.01/€0.02 EUR) - 2020/10/04 5:38:12 WET [2020/10/04 0:38:12 ET]"];

            assert.strictEqual(fn(p), '€');
        });

        it('should return the currency sign for cash', function () {

            // Play Money
            const p = ["PokerStars Hand #224938002411:  Hold'em No Limit (50/100) - 2021/03/18 18:10:08 WET [2021/03/18 14:10:08 ET]"];

            assert.strictEqual(fn(p), '');
        });
    });
});