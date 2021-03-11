import loadImagesBridge from '@/scripts/eases/view/load-images';
import heroFoldedHoleCardsBridge from '@/scripts/eases/view/hero-folder-hole-cards';
import renderBridge from '@/scripts/eases/view/render/index';

export default {

    async loadImages() {

        return loadImagesBridge.loadImages();
    },

    render(history, mainInfo) {

        renderBridge.render.call(this, history, mainInfo)
    },

    showHeroFoldedHoleCards(hero, model) {

        heroFoldedHoleCardsBridge.showHeroFoldedHoleCards.call(this, hero, model);
    }
};