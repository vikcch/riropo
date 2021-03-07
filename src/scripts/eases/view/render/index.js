import { HistoryT } from '@/scripts/units/history';
import View from '@/scripts/view';
import tableBridge from '@/scripts/eases/view/render/table';
import mainInfoBridge from '@/scripts/eases/view/render/main-info';

const rects = {

    mainInfo: { x: 96, y: 0, width: 792, height: 48 },
    table: { x: 96, y: 48, width: 792, height: 555 },
    handsList: { x: 0, y: 0, width: 96, height: 603 }
};

export default {

    /**
     * @this {View}
     * @param {HistoryT} history 
     */
    render(history) {

        mainInfoBridge.render.call(this);

        tableBridge.render.call(this, history);

        this.embeddables.forEach(x => x.draw());
    },

    rects
};