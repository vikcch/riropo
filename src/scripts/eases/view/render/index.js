import { HistoryT } from '@/scripts/units/history';
import { MainInfoT } from '@/scripts/units/main-info';
import View from '@/scripts/view';
import tableBridge from '@/scripts/eases/view/render/table';
import mainInfoBridge from '@/scripts/eases/view/render/main-info';
import handsFilterBridge from '@/scripts/eases/view/render/hands-filter';
import { getBigBlind } from '@/scripts/units/biz';

const rects = {

    mainInfo: { x: 96, y: 0, width: 792, height: 40 },
    table: { x: 96, y: 40, width: 792, height: 555 },
    // NOTE:: faz toogle com `searchHand` (button)
    handFiltered: { x: 0, y: 595 - 44, width: 96, height: 44 },
    get logo() {
        return {
            x: this.table.width / 2 - 174 / 2,
            y: 180
        };
    }

};

export default {

    /**
     * @this {View}
     * @param {HistoryT} history 
     * @param {MainInfoT} [mainInfo=null]
     */
    render(history, mainInfo, handFiltered) {

        const { tableMax, cashSign, blinds } = mainInfo;

        mainInfoBridge.render.call(this, mainInfo);

        const displayValueAssets = {
            cashSign,
            isBigBlinds: this.showBigBlinds.checked,
            bigBlind: getBigBlind(blinds)
        };

        tableBridge.render.call(this, history, tableMax, displayValueAssets);

        handsFilterBridge.render.call(this, handFiltered);

        this.embeddables.forEach(x => x.draw());
    },

    rects
};