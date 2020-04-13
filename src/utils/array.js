Array.prototype.groupBy = function(key) {
  return this.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
Array.prototype.zipWithIndex = function() {
  let index = 0;
  return this.map(el => {
    return {
      value: el,
      i: index++
    }
  })
};