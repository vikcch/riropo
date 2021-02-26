const easeName = function () {
    const offSetX = 46;
    const offSetY = 9;
    const x = this.status.x + offSetX;
    const y = this.status.y + offSetY;
    return { x, y };
};

const easeStack = function () {
    const offSetX = 46;
    const offSetY = 25;
    const x = this.status.x + offSetX;
    const y = this.status.y + offSetY;
    return { x, y };
};

const easeAction = function () {
    const offSetX = 15;
    const offSetY = 35;
    const x = this.emptySeat.x + offSetX;
    const y = this.emptySeat.y + offSetY;
    return { x, y };
};

const easeStatusHighlight = function () {
    const offSetX = -2;
    const offSetY = -2;
    const x = this.status.x + offSetX;
    const y = this.status.y + offSetY;
    return { x, y };
};

const easeChipsValue = function () {

    const chipsWidth = 22;
    const chipsHeight = 20;

    const leftAlign = this.seatFixed >= 5;

    const offSetX = leftAlign ? chipsWidth + 4 : -4;
    const offSetY = chipsHeight - 2;

    const x = this.betChips.x + offSetX;
    const y = this.betChips.y + offSetY;
    return { x, y };
};

const easeHoleCards = function () {

    const offSetX = -2;
    const offSetY = -25;
    const x = this.action.x + offSetX;
    const y = this.action.y + offSetY;
    return { x, y };
};


const seatsPositions = [
    {
        seatFixed: 1, // seat em 9-max 
        status: { x: 560, y: 34 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 513, y: 88 },
        betChips: { x: 480, y: 128 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 536, y: 88 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 475, y: 0 }
    },
    {
        seatFixed: 2, // seat em 9-max 
        status: { x: 698, y: 89 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 642, y: 156 },
        betChips: { x: 576, y: 168 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 598, y: 115 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 614, y: 61 }
    },
    {
        seatFixed: 3, // seat em 9-max 
        status: { x: 691, y: 274 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 668, y: 240 },
        betChips: { x: 624, y: 240 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 672, y: 205 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 693, y: 189 }
    },
    {
        seatFixed: 4, // seat em 9-max 
        status: { x: 484, y: 337 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 550, y: 316 },
        betChips: { x: 528, y: 296 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 588, y: 278 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 571, y: 305 }
    },
    {
        seatFixed: 5, // seat em 9-max 
        status: { x: 351, y: 414 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 382, y: 316 },
        betChips: { x: 344, y: 290 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 419, y: 314 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 351, y: 331 }
    },
    {
        seatFixed: 6, // seat em 9-max 
        status: { x: 225, y: 337 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 233, y: 316 },
        betChips: { x: 240, y: 292 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 172, y: 277 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 139, y: 303 }
    },
    {
        seatFixed: 7, // seat em 9-max 
        status: { x: 13, y: 275 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 107, y: 242 },
        betChips: { x: 144, y: 240 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 102, y: 204 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 13, y: 189 }
    },
    {
        seatFixed: 8, // seat em 9-max 
        status: { x: 9, y: 89 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 128, y: 146 },
        betChips: { x: 208, y: 168 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 179, y: 114 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
        emptySeat: { x: 95, y: 60 }
    },
    {
        seatFixed: 9, // seat em 9-max 
        status: { x: 151, y: 33 },
        get name() { return easeName.call(this) },
        get stack() { return easeStack.call(this) },
        dealer: { x: 271, y: 88 },
        betChips: { x: 296, y: 128 },
        get chipsValue() { return easeChipsValue.call(this) },
        inPlay: { x: 240, y: 88 },
        get action() { return easeAction.call(this) },
        get statusHighlight() { return easeStatusHighlight.call(this) },
        get holeCards() { return easeHoleCards.call(this) },
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

    const mapAddSeat = (x, i) => ({ ...x, seatAjusted: i + 1 });

    return seatsPositions
        .filter(x => arr.includes(x.seatFixed))
        .map(mapAddSeat);
}