export const Player = ({ name, stack, seat, position, isButton,
    isHero, bounty, holeCards }) => {

    return {
        stack,
        name,
        seat,
        position,
        isButton,
        isHero,
        bounty,
        holeCards,
        amountOnStreet: 0,
        inPlay: true,
        collect: 0,
        gatherStack: 0,
        heroMucked: false,

        clone() {

            return { ...this };
        },
        cloneReset() {

            const p = { ...this };
            p.amountOnStreet = 0;
            p.collect = 0;

            return p;
        },

        /**
         * Em side pots, quando há o 'collect', na proxima history a stack printada
         * fica actualizada... 
         * Existe para não alterar a prop `stack`, para facilitar no calculo do profit
         * O `collect` vai para `gatherStack`  
         * Chamado em _render table players_
         * @returns {number}
         */
        mergedStack() {

            return this.stack + this.gatherStack - this.collect;
        }
    };
};

export const PlayerT = Player({});
