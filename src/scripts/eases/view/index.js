import loadImagesBridge from '@/scripts/eases/view/load-images';
import renderTableBridge from '@/scripts/eases/view/render/table';

export default {

    loadImages() {

        return loadImagesBridge.loadImages();
    },

    render(history, navigation) {

        renderTableBridge.render.call(this, history, navigation);

        this.embeddables.forEach(x => x.draw());
    }
};