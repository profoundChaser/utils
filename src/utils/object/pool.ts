const createPool = (fn: Function) => {
  //对象池
  const pool: object[] = [];

  return {
    create: function (...args:any[]) {
      return pool.length === 0 ? fn.apply(this, args) : pool.unshift();
    },
    recovery: function (poolObject: object) {
      pool.push(poolObject);
    },
  };
};
