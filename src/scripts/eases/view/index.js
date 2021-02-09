import loadImagesBridge from '@/scripts/eases/view/load-images';
import renderTableBridge from '@/scripts/eases/view/render/table';

export default {

    loadImages() {

        return loadImagesBridge.loadImages();
    },

    render(history) {

        renderTableBridge.render.call(this, history);

        this.embeddables.forEach(x => x.draw());
    }
};