export default {

    removeMoney(value) {

        const approve = x => x >= 0 && x <= 9 || x === '.';

        return [...value].filter(approve).join('');
    }
}