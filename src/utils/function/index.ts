Function.prototype._call = function () {
  if (typeof this !== "function") {
    throw new TypeError("not funciton");
  }
  const context = (Array.prototype.unshift.call(arguments) as any) ?? Window;
  context.fn = this;
  const args = [...arguments];
  const result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype._apply = function () {
  if (typeof this !== "function") {
    throw new TypeError("not funciton");
  }
  const context = (Array.prototype.unshift.call(arguments) as any) ?? window;
  context.fn = this;
  const args = [...arguments];
  let result: any = null;
  if (args) {
    result = context.fn(...args);
  } else {
    result = context.fn();
  }
  delete context.fn;

  return result;
};

Function.prototype._bind = function () {
    if (typeof this !== "function") {
      throw new TypeError("not funciton");
    }
    const context = (Array.prototype.unshift.call(arguments) as any) ?? window;
    const _this:any = this
    const args = [...arguments]
    return function F(this:any) {
        if (this instanceof F) {
            return new _this(...args, ...arguments)
        } else {
            return _this.apply(context, args.concat(...arguments))
        }
    }
  };
