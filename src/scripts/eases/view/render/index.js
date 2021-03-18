import { HistoryT } from '@/scripts/units/history';
import { MainInfoT } from '@/scripts/units/main-info';
import View from '@/scripts/view';
import tableBridge from '@/scripts/eases/view/render/table';
import mainInfoBridge from '@/scripts/eases/view/render/main-info';
import { getBigBlind } from '@/scripts/units/biz';

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

        const { tableMax, cashSign, blinds } = mainInfo;

        mainInfoBridge.render.call(this, mainInfo);

        const displayValueAssets = {
            cashSign,
            isBigBlinds: this.showBigBlinds.checked,
            bigBlind: getBigBlind(blinds)
        };

        tableBridge.render.call(this, history, tableMax, displayValueAssets);

        this.embeddables.forEach(x => x.draw());
    },

    rects
};