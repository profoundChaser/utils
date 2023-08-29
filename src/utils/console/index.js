//计算程序运行时间 ms
export function countTime(callback){
    console.time()
    callback
    console.timeEnd()
}