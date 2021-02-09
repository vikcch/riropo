export const Player = ({ name, stack, seat, position, isButton, isHero, bounty }) => {

    return {
        stack,
        name,
        seat,
        position,
        isButton,
        isHero,
        bounty,
        amountOnStreet: 0,
        inPlay: true,

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
