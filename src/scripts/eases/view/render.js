import { displayValue } from '@/scripts/units/fns';
import { HistoryT } from '@/scripts/units/history';
import View from '@/scripts/view';

/**
 * @this {View}
 * @param {number} value 
 */
const pot = function (value) {

    const amount = displayValue(value);
    const text = `Pot: ${amount}`;

    const textWidth = this.context.measureText(text).width

    const center = this.canvas.width / 2;
    const verticalPadding = 16;
    const boxWidth = textWidth + verticalPadding;
    const x = center - textWidth / 2 - verticalPadding / 2;

    this.context.fillStyle = 'yellow';
    this.context.fillRect(x, 8, boxWidth, 16);

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'black';

    this.context.fillText(text, center, 16);
};

/**
 * @this {View}
 * @param {number} value 
 */
const players = function (players) {

    
}


export default {

    /**
     * 
     * @this {View}
     * @param {HistoryT} history 
     */
    render(history) {


        pot.call(this, history.pot);

        players.call(this, history.players);

        // console.log(this.canvas.width);

        console.log(history);

        // console.log('render');
    }
}