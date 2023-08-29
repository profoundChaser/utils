/**
 * 多字段过滤查询
 * @param filterData 过滤目标数组
 * @param sourceData 源数组
 * @param filterManager 需要过滤的键管理对象,该对象用于存储过滤的键名和值
 * @param filedMap 过滤键名对应过滤数组的字段名
 */
 interface KeyBooleanArrayType {
    [propsName: string]: boolean[];
  }
  export const multiFiledFilter = () => {
    function handleDataFilter(
      filterData: any[],
      sourceData: any[],
      filterManager: {[propName: string]: string},
      filedMap: object
    ) {
      const keys = Object.keys(filterManager);
      //过滤掉没有值的键名
      const res = keys.filter((key) => {
        return filterManager[key] !== "";
      });
      if (!res.length) return clearDataFilter(filterData,sourceData,filterManager);
      const flags: KeyBooleanArrayType[] = [];
      res.forEach((key, i) => {
        if (i === res.length - 1) {
          if (res.length === 1) {
            filterData = sourceData.filter((item) => {
              return item[filedMap[key]] && searchBlurIgnorecase(
                item[filedMap[key]],
                filterManager[key]
              );
            });
            console.log(filterData)
          } else {
            //到最后一个索引时进行过滤整合处理
            filterData = sourceData.filter((item, j) => {
              return (
                item[filedMap[key]] && searchBlurIgnorecase(item[filedMap[key]], filterManager[key]) &&
                getArrayIndexSameLevelVal(flags, j)
              );
            });
          }
          return;
        }
  
        //源数据进行遍历
        sourceData.forEach((item, i) => {
          //处理当前过滤的结果返回布尔值
          const res = item[filedMap[key]] && searchBlurIgnorecase(
            item[filedMap[key]],
            filterManager[key]
          );
          //建立以属性名为key,以布尔数组为值
          if (i === 0) {
            flags.push({
              [key]: [res],
            });
          } else {
            flags.forEach((flagObj) => {
              if (flagObj[key]) {
                flagObj[key].push(res);
              }
            });
          }
        });
      });
      return filterData
    }
  
    function getArrayIndexSameLevelVal(
      arr: KeyBooleanArrayType[],
      index: number
    ) {
      const res: boolean[] = [];
      const keys: string[] = arr.map((flagObj) => Object.keys(flagObj)[0]);
      arr.forEach((flagObj, i) => {
        const key = keys[i]!;
        flagObj[key].forEach((b, j) => {
          if (j === index) {
            res.push(b);
          }
        });
      });
      return res.every((item) => item);
    }
  
    function clearDataFilter(
      filterData: any[],
      sourceData: any[],
      filterManager: object
    ) {
      for (const key in filterManager) {
        if (Object.prototype.hasOwnProperty.call(filterManager, key)) {
          filterManager[key] = "";
        }
      }
      filterData = [...sourceData];
  
      return filterData
    }
  
    return {
      handleDataFilter,
      clearDataFilter,
    };
  };