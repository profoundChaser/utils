//数组转树状结构
/* 
  items:是待处理的成tree的数组
  id:自身id的键名
  pid:父级id的键名
  loopId: 循环可能因为回调函数修改键名而出现错误

  callback:接受回调函数,会接受每一个数据作为参数,可以原有的数据进行处理再返回
*/
export const arrayToTree = function (
    items: Array<any>,
    id: string,
    pid: string,
    callback?: Function,
    loopId?: string,
    loopPid?: string,
  ) {
    //所有最高级前置 参数id和pid表示对象的自身标识和父类的标识
    items.forEach((item, i) => {
      if (item[pid] === 0) {
        const temp = item;
        items.splice(i, 1);
        items.splice(0, 0, temp);
      }
    });
  
    const result: any[] = []; // 存放结果集
    const itemMap = {};
  
    //处理回调函数未传问题
    callback = callback ? callback : (treeItem: Object): Object => treeItem;
    loopId = loopId ? loopId : id
    loopPid = loopPid ? loopPid : pid
  
    // 先转成map存储
    for (const item of items) {
      itemMap[item[id]] = {
        ...item,
        children: [],
      };
    }
  
    for (const item of items) {
      const idVal = item[id];
      const pidVal = item[pid];
      const treeItem = itemMap[idVal];
      if (pidVal === 0) {
        result.push(callback(treeItem));
      } else {
        //循环这个过程
        loopTree(result, treeItem, loopId, loopPid, callback);
      }
    }
    return result;
  };
  
  const loopTree = (
    result: Array<any>,
    treeItem: Object,
    id: string,
    pid: string,
    callback: Function
  ) => {
    result.forEach((item) => {
      console.log(item[id],treeItem[id])
      if (item[id] === treeItem[pid]) {
        console.log('loopTree',item)
        item.children.push(callback(treeItem));
      } else {
        loopTree(item.children, treeItem, id, pid, callback);
      }
    });
  };
  