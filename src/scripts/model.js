import { head, rear } from "./units/fns";
import pokerHand from "./units/pokerhand";
import { MainInfoT } from "@/scripts/units/main-info";
import View from "@/scripts/view";
import biz from "./units/biz";
import fxnl from "./units/fxnl";

export default class Model {

    constructor() {


        this.handHistories = [];

        this.tracker = {

            hand: null,
            progress: null // relativo a `hand`
        };
    }

    /**
     * 
     * @param {string} sessionLog 
     * @param {View} view 
     * 
     */
    async processLog(sessionLog, view) {

        const promise = (hand, index) => new Promise((resolve, reject) => {

            const lines = biz.filterAllowedLines(hand);

            const ph = pokerHand(lines, index, jagged.length);

            // NOTE:: Precisa do `setTimeout` (macrotask) para desenhar,
            // Não faz update no canvas só com a promise (microtask).
            // Sem `mod 10` ficava 8x mais lento, assim nem 2x fica
            if (index % 10 === 0) setTimeout(() => {
                view.drawLoadingBar(index, jagged.length);
                resolve(ph);
            }, 0);
            else resolve(ph);

        });

        const arrayOfHands = sessionLog.split(/\r\n\r\n\r\n\r\n/).filter(Boolean);

        const jagged = arrayOfHands.map(x => x.split(/\r\n/));

        this.handHistories = [];

        for (const [index, hand] of jagged.entries()) {

            const r = await promise(hand, index);

            this.handHistories.push(r);
        }

        this.resetTracker();
    }

    /**
     * 
     * @param {string} sessionLog 
     */
    logValidation(sessionLog) {

        const isPokerStars = value => value.startsWith('PokerStars ');

        const isTolerableTableMax = value => {

            const index = value.indexOf(' is the button');
            const target = value.substring(0, index);
            return target.indexOf('10-max') === -1;
        };

        const r = fxnl.validator(isPokerStars, isTolerableTableMax)(sessionLog);

        if (!r) alert('Invalid file\n\n- Only PokerStart hand history is allowed\n- 10-max tables are not allowed');

        return r;
    }

    resetTracker() {

        this.tracker.hand = 0;
        this.tracker.progress = 0;
    }

    navigation(key) {

        const work = {

            previousHand: () => {
                this.tracker.hand--;
                this.tracker.progress = 0;
            },
            previousAction: () => this.tracker.progress--,
            nextAction: () => {

                this.tracker.progress++;

                // Passa para a próxima hand caso esteja no fim da corrente
                const hand = this.handHistories[this.tracker.hand];
                const maxProgress = hand.histories.length - 1;

                if (this.tracker.progress > maxProgress) {
                    this.tracker.hand++;
                    this.tracker.progress = 0;
                }
            },
            nextHand: () => {
                this.tracker.hand++;
                this.tracker.progress = 0;
            }
        };

        work[key].call();

        return {
            history: this.getHistory(),
            enables: this.getNavigationEnables(),

            // Apenas usado no handler do nextAction
            next: this.tracker.progress === 0 ? 'nextHand' : 'nextAction'
        };
    }

    navigateTo(handIndex) {

        this.tracker.hand = handIndex;
        this.tracker.progress = 0;

        return {
            history: this.getHistory(),
            enables: this.getNavigationEnables(),
        };
    }

    getHistory() {

        const hand = this.handHistories[this.tracker.hand];

        return hand?.histories[this.tracker.progress];
    }

    getNavigationEnables() {

        if (!this.handHistories.length) return {};

        const lastHandIndex = this.handHistories.length - 1;

        const lastHandMaxProgress = rear(this.handHistories).histories.length - 1;

        const isLastHand = this.tracker.hand === lastHandIndex;

        const isLastProgress = lastHandMaxProgress === this.tracker.progress;

        const nextAction = !(isLastHand && isLastProgress);

        return {
            previousHand: this.tracker.hand > 0,
            previousAction: this.tracker.progress > 0,
            play: !(isLastHand && isLastProgress),
            nextAction,
            nextHand: !isLastHand,
        }
    }

    getFirstHistory() {

        const hand = head(this.handHistories);

        return head(hand.histories);
    }

    get hero() {

        if (!this.handHistories.length) return;

        const history = this.getHistory();

        return history.players.find(v => v.isHero);
    }

    /**
     * @returns {MainInfoT}
     */
    get mainInfo() {

        const hand = this.handHistories[this.tracker.hand];

        return hand?.mainInfo;
    }

    get handsList() {

        return this.handHistories.map(v => v.handsListItem);
    }

    get isVeryLastAction() {

        return !this.getNavigationEnables().play;
    }
}
