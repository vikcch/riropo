
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
    chips: 'chips-22-484x20.png'
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
            ];

            const r = await Promise.all(arrFiles);

            // TODO:: enum images
            const images = {};
            images.background = r[0];
            images.navigation = r[1];
            images.emptySeat = r[2];
            images.inPlay = r[3];
            images.chips = r[4];

            console.timeEnd('await total');

            return images;

        } catch (error) {

        }

    }
};



