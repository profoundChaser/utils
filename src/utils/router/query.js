export const getQueryString = function () {
  //获取查询的字符串
  let queryStr = location.search.length > 0 ? location.search.substring(1) : "";
  //创建空的的查询对象
  let queryObj = {};
  let items = queryStr.length ? queryStr.split("&") : [];
  for (let i = 0; i < items.length; i++) {
    let item = items[i].split("=");
    let name = decodeURIComponent(item[0]);
    let value = decodeURIComponent(item[0]);
    if (!name.length) return;
    queryObj[name] = value;
  }
  return queryObj;
};
