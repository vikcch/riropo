import loadImagesBridge from '@/scripts/eases/view/load-images';
import renderBridge from '@/scripts/eases/view/render';

export default {

    loadImages() { return loadImagesBridge.loadImages(); },
    render(history) { return renderBridge.render.call(this, history); }

};