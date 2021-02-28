import loadImagesBridge from '@/scripts/eases/view/load-images';
import renderTableBridge from '@/scripts/eases/view/render/table';
import heroFoldedHoleCardsBridge from '@/scripts/eases/view/hero-folder-hole-cards';

export default {

    loadImages() {

        return loadImagesBridge.loadImages();
    },

    render(history, navigation) {

        renderTableBridge.render.call(this, history, navigation);

        this.embeddables.forEach(x => x.draw());
    },

    showHeroFoldedHoleCards(hero, model) {

        heroFoldedHoleCardsBridge.showHeroFoldedHoleCards.call(this, hero, model);
    }
};