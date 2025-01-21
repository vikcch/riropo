import Controller from './scripts/controller';
import Model from './scripts/model';
import View from '@/scripts/view';

new Controller(new Model(), new View());

console.log(`v${process.env.VUE_APP_VERSION}`);