self.console.log('3232323')
self.onmessage = (e) => {
  self.importScripts("spark-md5.min.js");
  self.console.log(self)
  const { chunksList } = e.data;
  self.console.log(chunksList,self.SparkMD5)
  const spark = new self.SparkMD5.ArrayBuffer()
  self.console.log(chunksList)
  let percentage = 0;
  let count = 0;
  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunksList[index]);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === chunksList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        percentage += 100 / chunksList.length;
        self.postMessage({
          percentage: Number.parseFloat(percentage).toFixed(2),
        });
        // calculate recursively
        loadNext(count);
      }
    };
  };
  loadNext(0)
};
