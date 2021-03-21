export const pipe = (...fns) => arg => fns.reduce((acc, cur) => cur(acc), arg);
export const validator = (...tests) => obj => tests.every(v => v(obj));

export default {
    pipe,
    validator
};