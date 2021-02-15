import fns, { head } from "@/scripts/units/fns";
import { imagesNames } from '@/scripts/units/enums';

const getImage = async function (file) {

    return new Promise(async (resolve, reject) => {

        // await new Promise(r => setTimeout(r, 1000));

        const img = new Image();
        img.onload = () => resolve(img);
        // TODO:: ver como lidar com isto
        // img.onerror = reject; 
        img.src = `./src/assets/images/${file}`;
    });
};

const files = {
    background: 'bg-vector-792x555.jpg',
    navigation: 'navigation-150x168.png',
    emptySeat: 'empty-seat-90x90.png',
    inPlay: 'in-play-25x30.png',
    chips: 'chips-22-484x20.png',
    status: 'status-93x33.png',
    statusHighlight: 'status-highlight-97x37.png',
    actions: 'actions-300x22.png',
    deck: 'deck-ps-50x70-650x280.png',
    chat: 'chat-329x108.png',
    scrollbarButtons: 'scrollbar-buttons-16x16-32x32.png'
};


export default {

    async loadImages() {

        try {

            console.time('await total');

            const arrFiles = [
                getImage(files.background),
                getImage(files.navigation),
                getImage(files.emptySeat),
                getImage(files.inPlay),
                getImage(files.chips),
                getImage(files.status),
                getImage(files.statusHighlight),
                getImage(files.actions),
                getImage(files.deck),
                getImage(files.chat),
                getImage(files.scrollbarButtons)
            ];

            const r = await Promise.all(arrFiles);

            // TODO:: enum images
            const images = {};
            images[imagesNames.background] = r[0];
            images[imagesNames.navigation] = r[1];
            images[imagesNames.emptySeat] = r[2];
            images[imagesNames.inPlay] = r[3];

            const chips = await fns.sprites(r[4], 0, 22, 20);
            images[imagesNames.dealer] = head(chips);
            images[imagesNames.chips] = chips.slice(1);

            images[imagesNames.status] = r[5];
            images[imagesNames.statusHighlight] = r[6];

            const actions = await fns.sprites(r[7], 0, 60, 22);
            images[imagesNames.actions] = actions;

            images[imagesNames.deck] = [];
            for (let i = 0; i < 4; i++) {
                const deckSuit = await fns.sprites(r[8], i, 50, 70);
                images[imagesNames.deck][i] = deckSuit;
            }

            images.chat = r[9];
            images.scrollbarButtons = r[10];

            console.timeEnd('await total');

            return images;

        } catch (error) {

            console.log(error);
        }

    }
};



