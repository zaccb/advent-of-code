export default {
    noMoreThanN: n => value => value >= n,
    ascending: (a,b) => a - b,
    descending: (a,b) => b - a,
    multiply: (a,b) => a * b,
    sum: (a,b) => a + b,
    square: a => a * a
};
