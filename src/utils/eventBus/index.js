const events = {}
events.eventList = {}

events.emit = function(key,fn){
    if(!this.eventList[key]){
        this.eventList[key] = [fn]
    }
    this.eventList[key].push(fn)
}

events.on = function(){
    const key  = [].shift.call(arguments)
    const fns = this.eventList[key]

  if (!fns || fns.length == 0) {
    return false
  }

  for (var i = 0, fn; (fn = fns[i++]); ) {
    fn.apply(null, arguments)
  }
}


events.off = function(){
    const keys = [...arguments]
    keys.forEach(key=>{
        this.eventList[key] = []
    })
}