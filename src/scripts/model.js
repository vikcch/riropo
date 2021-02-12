import { head, rear } from "./units/fns";
import pokerHand from "./units/pokerhand";

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
     * @param {string} log 
     */
    processLog(sessionLog) {

        // TODO:: 10 max é invalido


        //TODO:: ver arranjar nome de jogador com \n
        // STOPSHIP:: ver no live-squeezer se envia com 3 enters

        // TODO:: file com noma `Alterada III` em 'HandHistory/Nova Pasta'

        const arrayOfHands = sessionLog.split(/\r\n\r\n\r\n\r\n/).filter(Boolean);

        const jagged = arrayOfHands.map(x => x.split(/\r\n/));

        // console.log(jagged);

        this.handHistories = jagged.map(hand => {

            // TODO:: LIMPAR HAND (EX: remover playes "out of hand", comentarios, etc)
            // STOPSHIP:: "out of hand" é importantissimo
            // tem tambem: "Chelov18 will be allowed to play after the button"
            // tem tambem: "gporto68 leaves the table"

            return pokerHand(hand);

        });

        // console.log(this.handHistories);

        this.resetTracker();
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
            enables: this.getNavigationEnables()
        };
    }


    getHistory() {

        const hand = this.handHistories[this.tracker.hand];

        return hand.histories[this.tracker.progress];
    }

    getNavigationEnables() {

        const lastHandIndex = this.handHistories.length - 1;

        const lastHandMaxProgress = rear(this.handHistories).histories.length - 1;

        const isLastHand = this.tracker.hand === lastHandIndex;

        const isLastProgress = lastHandMaxProgress === this.tracker.progress;

        const nextAction = !(isLastHand && isLastProgress);

        return {
            previousHand: this.tracker.hand > 0,
            previousAction: this.tracker.progress > 0,
            nextAction,
            nextHand: !isLastHand,
        }
    }

    getFirstHistory() {

        const hand = head(this.handHistories);

        return head(hand.histories);
    }
}
