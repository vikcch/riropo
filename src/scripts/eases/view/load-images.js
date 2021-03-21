import fns, { head } from "@/scripts/units/fns";

const getImage = async function (file) {

    return new Promise(async (resolve, reject) => {

        const img = new Image();
        img.onload = () => resolve(img);
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
    scrollbarButtons: 'scrollbar-buttons-16x16-32x32.png',
    smallDeck: 'deck-small-16x20-208-80.png',
    searchHand: 'search-hand.png',
    clearHandFilter: 'clear-button-28x28.png',
    logo: 'logo-orange-174x26-30-opacy.png'
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
                getImage(files.scrollbarButtons),
                getImage(files.smallDeck),
                getImage(files.searchHand),
                getImage(files.clearHandFilter),
                getImage(files.logo)
            ];

            const r = await Promise.all(arrFiles);

            const images = {};
            images.background = r[0];
            images.navigation = r[1];
            images.emptySeat = r[2];
            images.inPlay = r[3];

            const chips = await fns.sprites(r[4], 0, 22, 20);
            images.dealer = head(chips);
            images.chips = chips.slice(1);

            images.status = r[5];
            images.statusHighlight = r[6];

            const actions = await fns.sprites(r[7], 0, 60, 22);
            images.actions = actions;

            images.deck = [];
            for (let i = 0; i < 4; i++) {
                const deckSuit = await fns.sprites(r[8], i, 50, 70);
                images.deck[i] = deckSuit;
            }

            images.chat = r[9];
            images.scrollbarButtons = r[10];

            images.smallDeck = [];
            for (let i = 0; i < 4; i++) {
                const deckSuit = await fns.sprites(r[11], i, 16, 20);
                images.smallDeck[i] = deckSuit;
            }

            images.searchHand = r[12];
            images.clearHandFilter = r[13];

            images.logo = r[14];

            console.timeEnd('await total');

            return images;

        } catch (error) {

            console.error(error);
        }

    }
};



