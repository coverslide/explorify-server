module.exports = function crossOrigin (option) {
  return function (ctx) {
    if (option === true) {
      return '*';
    }
    if (option === false) {
      return false;
    }
    if (typeof option === 'string') {
      return option === ctx.header.origin && ctx.header.origin;
    }
    if (Array.isArray(option)) {
      return option.includes(ctx.header.origin) && ctx.header.origin;
    }
    return false;
  }
}
