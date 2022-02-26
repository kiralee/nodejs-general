// task queue, micro task, call stack

// Call back function

// --> Giảm thời gian chờ của client
// --> Fire event
function resolveAfter2Seconds(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, delayTime);
  });
}

function readFilewithPrimise(delayTime, stringData, callback) {
  console.log("Calling read file function");
  // await resolveAfter2Seconds(delayTime); // Virtal processing read file , Delay method
  const dataForCallback = stringData;
  // tạo call back
  // Fire event. Tao xử lý xong cái file rồi bắn event để cho người khác sài
  console.log("Finish processing and fire call back");
  return new Promise((resolve) => resolve(callback(null, dataForCallback)));
}

function readFile(delayTime, stringData, callback) {
  // console.log("Calling read file function");
  // await resolveAfter2Seconds(delayTime); // Virtal processing read file , Delay method
  const dataForCallback = stringData;
  // tạo call back
  // Fire event. Tao xử lý xong cái file rồi bắn event để cho người khác sài
  // console.log("Finish processing and fire call back");
  return callback(null, dataForCallback);
}
// Đọc file không phụ thuộc

function readFileWithCallBack() {
  readFile(2000, "read File 1 of call back 1", (err, data) => {
    console.log("Result data ====> ", data);
  });
  readFile(4000, "read File 2 of call back 2", (err, data) => {
    console.log("Result data ===> ", data);
  });
}

// Đọc file có phụ thuộc

function readFileWithCallBackWithDependency(callBackFunction) {
  let dataResult = "";
  readFile(0, "read File 1 of call back 1", (err, data) => {
    dataResult += data;
    readFile(0, "read File 2 of call back 2", (err, data) => {
      dataResult += data;
      return callBackFunction(dataResult);
    });
  });
}

// ES6 lên ngôi
// Promise
// Đọc file không phục thuộc
function readFileWithOutDependencyWithPromise() {
  let dataResult = "";
  readFilewithPrimise(0, "read File 1 of call back 1", (err, data) => {
    dataResult += data;
  }).then((data) => {
    console.log("dataResult", data);
  });
}

function readManyFilesWithOutDependencyWithPromise() {
  const promise_1 = new Promise((resolve) =>
    readFile(0, "read File 1", (err, data) => {
      console.log("data read file 1", data);
      resolve(data);
    })
  );

  const promise_2 = new Promise((resolve) =>
    readFile(0, "read File 2", (err, data) => {
      console.log("data read file 2", data);
      resolve(data);
    })
  );

  const promise_3 = new Promise((resolve) =>
    readFile(0, "read File 3", (err, data) => {
      console.log("data read file 3", data);
      resolve(data);
    })
  );
  promise_1.then((data) => {
    console.log("Export result then_1 ", data);
  });

  promise_2.then((data) => {
    console.log("Export result then_2 ", data);
  });

  promise_3.then((data) => {
    console.log("Export result then_3 ", data);
  });

  //   promise_1
  //     .then((data) => {
  //       console.log("Export result then_1 ", data);
  //       return promise_2;
  //     })
  //     .then((data) => {
  //       console.log("Export result then_2 ", data);
  //       return promise_3;
  //     })
  //     .then((data) => {
  //       console.log("Export result then_3 ", data);
  //     });
}

function readFileWithoutCallBackHell() {
  const promise1 = new Promise((resolve, reject) => {
    readFile(0, "read file 1", (err, data) => {
      console.log("readFile1");
      resolve(data);
    });
  });

  const promise2 = new Promise((resolve, reject) => {
    readFile(0, "read file 2", (err, data) => {
      console.log("readFile2");
      setTimeout(() => {
        reject(" loi read file 2");
        // resolve(data);
      }, 3000);
    });
  }).catch((err) => {
    console.log("promise 2 co loi: ", err);
    // Process luu log
    console.log("put queue to save error log or save on redis");
  });

  const promise3 = new Promise((resolve, reject) => {
    readFile(0, "read file 3", (err, data) => {
      console.log("readFile3");
      resolve(data);
    });
  });

  promise1
    .then((data) => {
      console.log("Updated data readfile 1", data);
      // console.log("status", promise2);
      return promise2;
    })
    .then((data) => {
      // Check data if it is undefined
      if (data) {
        console.log("Updated data read file 2", data);
        console.log("status", promise2);
      }
      return promise3;
    })
    .then((data) => {
      console.log("Updated data read file 3", data);
    })
    .catch((err) => console.log("Final err", err));
}

// readFileWithCallBackWithDependency((data) => console.log("final data", data));

// readManyFilesWithOutDependencyWithPromise();

readFileWithoutCallBackHell();
