import View from '@/scripts/view';
import Controller from '@/scripts/controller';
import { PlayerT } from '@/scripts/units/player';
import displayPositions from '@/scripts/units/display-positions';
import { drawPlayerCards } from '@/scripts/eases/view/render/table/index';
import fns from '@/scripts/units/fns';


const intervalCallBack = function (hero, noCards, point) {

    const mousePoint = Controller.mousePoint;

    if (!this.hoverHero(hero, mousePoint)) {

        this.context.putImageData(noCards, point.x, point.y);

        clearInterval(hero.holeCards.inter);

        hero.holeCards.inter = null;
    }
};

export default {

    /**
     * @this {View}
     * @param {PlayerT} hero 
     */
    showHeroFoldedHoleCards(hero) {

        // TODO:: testar quando se muda de hand com o teclado (implementar)

        if (hero.holeCards.inter) return;

        const isPLO = hero.holeCards.length === 4;

        // STOPSHIP :: hardcoded
        const displayPosition = displayPositions(6).find(x => hero.seat === x.seatAjusted);

        const point = displayPosition.holeCards;

        const ploPoint = fns.movePoint(point, -15, -4);

        // NOTE:: usando ploPoint engloba logo hold'em e plo
        const noCards = this.context.getImageData(ploPoint.x, ploPoint.y, 95, 82);

        const params = { isPLO, point, alpha: 0.8 };

        const drawPlayerCardsAbsx = drawPlayerCards.call(this, params);

        hero.holeCards.forEach(drawPlayerCardsAbsx);

        const binded = intervalCallBack.bind(this, hero, noCards, ploPoint);

        hero.holeCards.inter = setInterval(binded, 30);
    }
};