const seatsPositions = [
    {
        seatFixed: 1, // seat em 9-max 
        name: { x: 560, y: 34 },
        dealer: { x: 513, y: 88 },
        chips: { x: 480, y: 128 },
        inPlay: { x: 536, y: 88 },
        emptySeat: { x: 475, y: 0 }
    },
    {
        seatFixed: 2, // seat em 9-max 
        name: { x: 0, y: 0 },
        dealer: { x: 642, y: 156 },
        chips: { x: 576, y: 168 },
        inPlay: { x: 598, y: 115 },

        emptySeat: { x: 614, y: 61 }
    },
    {
        seatFixed: 3, // seat em 9-max 
        name: { x: 0, y: 0 },
        dealer: { x: 668, y: 240 },

        chips: { x: 624, y: 240 },
        inPlay: { x: 672, y: 205 },

        emptySeat: { x: 693, y: 189 }
    },
    {
        seatFixed: 4, // seat em 9-max 
        name: { x: 0, y: 0 },
        dealer: { x: 550, y: 316 },
        chips: { x: 528, y: 296 },
        inPlay: { x: 588, y: 278 },

        emptySeat: { x: 571, y: 305 }
    },
    {
        seatFixed: 5, // seat em 9-max 
        name: { x: 351, y: 414 },
        dealer: { x: 382, y: 316 },
        chips: { x: 344, y: 290 },
        inPlay: { x: 419, y: 314 },
        emptySeat: { x: 351, y: 331 }
    },
    {
        seatFixed: 6, // seat em 9-max 
        name: { x: 0, y: 0 },
        dealer: { x: 233, y: 316 },
        chips: { x: 240, y: 296 },
        inPlay: { x: 172, y: 277 },
        emptySeat: { x: 139, y: 303 }
    },
    {
        seatFixed: 7, // seat em 9-max 
        name: { x: 0, y: 0 },
        chips: { x: 144, y: 240 },
        dealer: { x: 107, y: 242 },
        inPlay: { x: 102, y: 204 },
        emptySeat: { x: 13, y: 189 }
    },
    {
        seatFixed: 8, // seat em 9-max 
        name: { x: 0, y: 0 },
        button: { x: 128, y: 146 },
        chips: { x: 208, y: 168 },
        inPlay: { x: 179, y: 114 },
        emptySeat: { x: 95, y: 60 }
    },
    {
        seatFixed: 9, // seat em 9-max 
        name: { x: 0, y: 0 },
        button: { x: 271, y: 88 },
        chips: { x: 296, y: 128 },
        inPlay: { x: 240, y: 88 },
        emptySeat: { x: 238, y: 0 }
    },
];

export default function (tableMax) {

    const work = {
        '2': [3, 7],
        '3': [2, 5, 8],
        '4': [2, 4, 6, 8],
        '6': [2, 3, 4, 6, 7, 8],
        '8': [1, 2, 3, 4, 6, 7, 8, 9],
        def: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    };

    const arr = (work[tableMax] || work['def']);

    return seatsPositions.filter(x => arr.includes(x.seatFixed));
}