import View from '@/scripts/view';

export default {
    /**
     * 
     * @this {View}
     */
    render() {

        console.log(this);

        this.context.setTransform(1, 0, 0, 1, 0, 0);

        this.context.fillText('hey', 10, 10);
    }
};