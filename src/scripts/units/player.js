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

        clone() {

            return { ...this };
        },
        cloneResetStreet() {

            const p = { ...this };
            p.amountOnStreet = 0;

            return p;
        },

        /**
         * Existe para não alterar a stack quando faz `lastWinnerCollects`  
         * O `collect` vai para `gatherStack`  
         * Chamado em _render table players_
         * @returns {number}
         */
        mergedStack() {

            return this.stack + this.gatherStack;
        }
    };
};

export const PlayerT = Player({});
