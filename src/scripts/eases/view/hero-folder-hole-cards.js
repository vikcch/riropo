import View from '@/scripts/view';
import Controller from '@/scripts/controller';
import { PlayerT } from '@/scripts/units/player';
import displayPositions from '@/scripts/units/display-positions';
import { drawPlayerCards } from '@/scripts/eases/view/render/table/index';
import fns from '@/scripts/units/fns';

/**
 * @this {View}
 * @param {PlayerT} hero 
 * @param {ImageData} noCards 
 * @param {{x:number,y:number}} point 
 */
const intervalCallBack = function (hero, noCards, point, model) {

    const mousePoint = Controller.mousePoint;

    if (!this.hoverHero(hero, mousePoint)) {

        // Para o caso de navegar a ação pelo teclado (model.hero = current)
        if (hero === model.hero) {

            this.context.putImageData(noCards, point.x, point.y);
        }

        clearInterval(hero.holeCards.inter);

        hero.holeCards.inter = null;
    }
};

export default {

    /**
     * @this {View}
     * @param {PlayerT} hero 
     */
    showHeroFoldedHoleCards(hero, model) {

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

        const binded = intervalCallBack.bind(this, hero, noCards, ploPoint, model);

        hero.holeCards.inter = setInterval(binded, 30);
    }
};