export const Delimiters = function () {

    return {

        index: 0,
        names: ['HOLE CARDS', 'FLOP', 'TURN', 'RIVER', 'SHOW DOWN', 'SUMMARY'],
        get current() { return `*** ${this.names[this.index]} ***`; },
        get done() { return this.index >= 4; },
        get street() { return [1, 2, 3].includes(this.index); }
    };

}

export const DelimitersT = Delimiters();
