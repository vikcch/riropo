'use strict';

const a = {};

a.inter = setInterval(() => {

    console.log('hey');

    clearInterval(a.inter);

    a.inter = null

    if (a.inter) {

        console.log('tem stuff');
    }



}, 1000);