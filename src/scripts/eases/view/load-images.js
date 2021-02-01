
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
};


export default {

    async loadImages() {

        try {
            const images = {};
            console.time('await total');

            console.time('await 1');
            const background = getImage(files.background);

            // this.images.background = await loadImages(files.background);
            console.timeEnd('await 1');

            console.time('await 2');
            const navigation = getImage(files.navigation);
            // this.images.navigation = await loadImages(files.navigation);
            console.timeEnd('await 2');

            const r = await Promise.all([background, navigation]);
            images.background = r[0];
            images.navigation = r[1];

            console.timeEnd('await total');

            return images;

        } catch (error) {

        }

    }
};



