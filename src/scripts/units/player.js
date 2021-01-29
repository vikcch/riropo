export const Player = ({ name, stack, seat, position, isButton, isHero, bounty }) => {

    let _amountOnStreet = 0;

    return {
        stack,
        name,
        seat,
        position,
        isButton,
        isHero,
        bounty,

        clone() {

            return { ...this };
        },
        cloneResetStreet() {

            const p = { ...this };
            p.amountOnStreet = 0;

            return p;
        },

        get amountOnStreet() { return _amountOnStreet; },
        set amountOnStreet(value) { _amountOnStreet = value; }
    };
};

export const PlayerT = Player({});
