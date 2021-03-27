import { head, rear } from "./units/fns";
import pokerHand from "./units/pokerhand";
import { MainInfoT } from "@/scripts/units/main-info";
import View from "@/scripts/view";
import Controller from "@/scripts/controller";
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

    get endPointPrefix() {

        const { href } = window.location;

        // NOTE:: alterar / adicionar ip do pc na Network para ter acesso pelo telefone
        const prefixDev = 'http://localhost/dev/replayer-riropo/wwwroot';
        const prefixProd = 'https://replayer.winningpokerhud.com';

        const isDev = href.includes('localhost') || href.includes('127.0.0.1');

        return isDev ? prefixDev : prefixProd;
    }

    /**
     * 
     * @param {Controller} controller 
     * @returns 
     */
    async tryLoadFromOnlineDB(controller) {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');

        if (!id) return;

        const filePath = `${this.endPointPrefix}/php/riropo-load.php`;

        const abortController = new AbortController();
        setTimeout(() => abortController.abort(), 10000);

        // NOTE:: `id` com 123abc avalia 123 (como parseInt) 
        const param = new URLSearchParams({ id });
        const url = `${filePath}?${param}`;

        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        const options = { method: 'GET', mode: 'cors', headers };

        try {
            const response = await fetch(url, { ...options, signal: abortController.signal });
            
            try {
                const data = await response.json();

                // NOTE:: \n apenas quando vem da database, pelo menos em localhost

                const { log } = data;

                if (log.includes('\r\n')) controller.handLoad(log);

                else {

                    const secureLog = log.replace(/\n/g, '\r\n');

                    controller.handLoad(secureLog);
                }

            } catch (err) {

                alert('Hand not found');
                throw err;
            }

        } catch (err) {

            if (err.name == 'AbortError') alert("Aborted!");
            else throw err;
        }
    }


    async shareHand() {

        if (!this.lines) return;

        const url = `${this.endPointPrefix}/php/riropo-save.php`;

        const log = this.lines.join('\r\n').concat('\r\n\r\n\r\n');
        const heroName = this.hero.name;
        const holecards = this.hero.holeCards
            .map(v => biz.getOrdinalCardIndex(v))
            .join('-');

        const body = JSON.stringify({
            myrequest: 'send_data',
            hero_js: heroName,
            log_js: log,
            origem_js: 'replayer-site',
            descripton_js: this.mainInfo.getDescription(),
            holecards_js: holecards
        });

        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const options = { method: 'POST', mode: 'cors', body, headers };

        const abortController = new AbortController();
        setTimeout(() => abortController.abort(), 10000);

        try {

            const response = await fetch(url, { ...options, signal: abortController.signal });

            return await response.json();

        } catch (err) {

            if (err.name == 'AbortError') alert("Aborted!");
            else throw err;
        }
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

        if (!this.handHistories.length) return null;

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

    get lines() {

        const hand = this.handHistories[this.tracker.hand];

        return hand?.lines;
    }

    get handsList() {

        return this.handHistories.map(v => v.handsListItem);
    }

    get isVeryLastAction() {

        return !this.getNavigationEnables().play;
    }
}
