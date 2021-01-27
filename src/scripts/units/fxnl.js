export const pipe = (...fns) => arg => fns.reduce((acc, cur) => cur(acc), arg);

export default {
    pipe
};