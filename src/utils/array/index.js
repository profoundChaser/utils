//求和
export function sum() {
  const arg = Array.prototype.slice.call(arguments);
  return arg.reduce((a, b) => (a += b));
}

//初始化0矩阵
export function fillArrayDoubleZero(len, val = 0) {
  return Array(len)
    .fill(val)
    .map(() => Array(len).fill(val));
}

//数组去重
export function removeDuplicateArray(array) {
  return [...new Set(array)];
}
