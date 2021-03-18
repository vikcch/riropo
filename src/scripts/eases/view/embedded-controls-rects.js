import render from '@/scripts/eases/view/render/index';

const tableRect = render.rects.table;

export default {

    navigation: {

        previousHand: {
            x: 350 + tableRect.x,
            y: 450 + tableRect.y,
            width: 50, height: 28
        },
        previousAction: {
            x: 410 + tableRect.x,
            y: 450 + tableRect.y,
            width: 50, height: 28
        },
        play: {
            x: 470 + tableRect.x,
            y: 450 + tableRect.y,
            width: 50, height: 28
        },
        nextAction: {
            x: 530 + tableRect.x,
            y: 450 + tableRect.y,
            width: 50, height: 28
        },
        nextHand: {
            x: 590 + tableRect.x,
            y: 450 + tableRect.y,
            width: 50, height: 28
        }
    },

    chat: {
        x: 3 + tableRect.x,
        y: 442 + tableRect.y,
        width: 329, height: 108
    },

    handsList: {
        x: 0, y: 0,
        width: 96, height: 595
    },

    showBigBlinds: {
        x: 99, y: 462,
        width: 10, height: 14
    }
};