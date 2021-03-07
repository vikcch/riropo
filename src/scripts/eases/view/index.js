import loadImagesBridge from '@/scripts/eases/view/load-images';
import heroFoldedHoleCardsBridge from '@/scripts/eases/view/hero-folder-hole-cards';
import renderBridge from '@/scripts/eases/view/render/index';

export default {

    loadImages() {

        return loadImagesBridge.loadImages();
    },

    render(history) {

        renderBridge.render.call(this, history)
    },

    showHeroFoldedHoleCards(hero, model) {

        heroFoldedHoleCardsBridge.showHeroFoldedHoleCards.call(this, hero, model);
    }
};