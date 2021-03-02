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

        clone() {

            return { ...this };
        },
        cloneResetStreet() {

            const p = { ...this };
            p.amountOnStreet = 0;

            return p;
        },
    };
};

export const PlayerT = Player({});
