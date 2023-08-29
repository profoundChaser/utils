import SparkMD5 from "spark-md5";
//所有文件下载方式
export const downloadByLink = (blob, fileSuffix, fileName = "defaultName") => {
  let blobUrl = window.URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.download = fileName + "." + fileSuffix;
  link.style.display = "none";
  link.href = blobUrl;
  // 触发点击
  document.body.appendChild(link);
  link.click();
  // 移除
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const bigFileSlice = (file, chunkSize = 10 * 1024 * 1024) => {
  const chunks = [];
  const size = file.size;
  for (let i = 0; i < size; i += chunkSize) {
    const index = i / chunkSize + 1;
    console.log(index, chunkSize * index);
    chunks.push(file.slice(i, chunkSize * index));
  }
  return chunks;
};

export const addHashToBigFile = (chunks) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5();
    function _read(i) {
      if (i >= chunks.length) {
        resolve(spark.end());
        return;
      }
      const blob = chunks[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        spark.append(result);
        _read(i + 1);
      };
      reader.readAsArrayBuffer(blob);
    }
    _read(0);
  });
};

export const calculateFileHash = (chunks) => {
  return new Promise((resolve) => {
    const worker = new Worker("/fileHash.js");
    console.log("worker", worker);
    worker.postMessage({ chunksList: chunks });
    worker.onmessage = (e) => {
      const { hash, percentage } = e.data;
      console.log(hash, percentage);
      if (hash) {
        resolve(hash);
        worker.terminate();
      }
    };
  });
};

/**
 *@param uploadList 上传文件的列表,会存储到后台
 *@param hash 文件标识
 *@param fileData 需要上传的文件列表
 */
export const uploadChunks = (
  uploadList = [],
  hash,
  fileData = [],
  fileOrigin,
  onProgress
) => {
  return new Promise(async (resolve, reject) => {
    const requestList = fileData
      .filter(({ index }) => !uploadList.includes(index))
      .map(({ file, fileHash, index }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadId", fileHash);
        formData.append("partNumber", index);
        return { formData, index };
      })
      .map(({ formData, index }) =>
        request({
          url,
          method: "POST",
          data: formData,
          isUpload: 1,
          onUploadProgress: (e) => {
            fileData[index].percentage = parseInt(
              String((e.loaded / e.total) * 100)
            );
            const loaded = fileData
              .map((i) => i.size * i.percentage)
              .reduce((acc, cur) => acc + cur);
            onProgress(loaded);
          },
        })
      );
    await Promise.all(requestList);
    if (uploadList.length + requestList.length === fileData.length) {
      mergeRequestList(hash, fileOriginalData)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          Message.error(error);
        });
    }
  });
};


// 开始合并
function mergeRequestList(hash, file) {
  return new Promise(async (resolve, reject) => {
    let {data} = await request({
      url,
      method: 'POST',
      data,
      isUpload: 0
    })
    if (data.success) {
      Message.success('上传成功!')
      resolve(data.data)
    } else {
      reject(data.message)
    }
  })
}

/**
 * 自定义axios
 * @param url
 * @param method
 * @param data
 * @param isUpload
 * @param onUploadProgress
 * @returns {Promise<any>}
 */
 function request({url, method = 'post', data, isUpload, onUploadProgress = e => e}) {
  const service = axios.create({
    baseURL,
    timeout: 0,
    onUploadProgress,
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if (isUpload) {
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    axios.defaults.headers.post['UpLoadFile'] = '1'
  }
  service.defaults.headers.common['Authorization'] = `Bearer ${token}`
  service.interceptors.response.use(response => {
    if (response) {
      return Promise.resolve(response)
    }
  }, error => {
    return Promise.reject(error)
  })
  return service.request({
    url,
    method,
    data
  })
}
