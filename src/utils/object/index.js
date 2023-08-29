//对比两个对象是否相等
export function ObjectValueEqual(a, b) {
  if (a === b) return true;
  let propa = Object.getOwnPropertyNames(a);
  let propb = Object.getOwnPropertyNames(b);
  if (propa.length !== propb.length) return false;
  let flag = true;
  for (let prop of propa) {
    if (b.hasOwnProperty(prop)) {
      console.log(prop);
      if (typeof a[prop] === "object") {
        ObjectValueEqual(a[prop], b[prop]);
      }
      if (b[prop] !== a[prop]) {
        flag = false;
      }
    }
  }
  return flag;
}
