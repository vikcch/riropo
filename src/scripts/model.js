import pokerHand from "./units/pokerhand";

export default class Model {

    constructor() {


        this.handHistories = [];
    }

    /**
     * 
     * @param {string} log 
     */
    processLog(sessionLog) {

        // TODO:: 10 max é invalido

        
        //TODO:: ver arranjar nome de jogador com \n
        // STOPSHIP:: ver no live-squeezer se envia com 3 enters

        const arrayOfHands = sessionLog.split(/\r\n\r\n\r\n\r\n/).filter(Boolean);

        const jagged = arrayOfHands.map(x => x.split(/\r\n/));

        console.log(jagged);

        this.handHistories = jagged.map(hand => {

            // TODO:: LIMPAR HAND (EX: remover playes "out of hand", comentarios, etc)
            // STOPSHIP:: "out of hand" é importantissimo

            return pokerHand(hand);

        })

        console.log(this.handHistories);
    }



}