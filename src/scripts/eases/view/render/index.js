import { HistoryT } from '@/scripts/units/history';
import { MainInfoT } from '@/scripts/units/main-info';
import View from '@/scripts/view';
import tableBridge from '@/scripts/eases/view/render/table';
import mainInfoBridge from '@/scripts/eases/view/render/main-info';

const rects = {

    mainInfo: { x: 96, y: 0, width: 792, height: 40 },
    table: { x: 96, y: 40, width: 792, height: 555 }
};

export default {

    /**
     * @this {View}
     * @param {HistoryT} history 
     * @param {MainInfoT} [mainInfo=null]
     */
    render(history, mainInfo) {

        const { tableMax } = mainInfo;

        mainInfoBridge.render.call(this, mainInfo);

        tableBridge.render.call(this, history, tableMax);

        this.embeddables.forEach(x => x.draw());
    },

    rects
};