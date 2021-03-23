/**
 * 在v2的基础上拓展then实现链式调用
 * * 要求在执行then的时候返回一个新的promise对象
 * * then中执行onFullfilled的时候要获取返回值value并传递给新的promise的resolve
 * * then中执行onRejected的时候要获取原因reason并传递给新的promise的reject
 * * 执行到新promise的resolve和reject的时候要有try catch做错误处理
 */

function Promisev3(constructor) {
  const self = this;
  self.status = 'pending';
  self.value = undefined;
  self.reason = undefined;
  self.onFullfilledArray = [];
  self.onRejectedArray = [];

  try {
    constructor(resolve, reject);
  } catch(e) {
    reject(e);
  }

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.value = value;
      onFullfilledArray.forEach((fn) => {
        fn(self.value);
      });
    }
  }

  function reject(reason)  {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.reason = reason;
      onRejectedArray.forEach((fn) => {
        fn(reason);
      });
    }
  }
}

Promisev3.prototype.then = function(onFullfilled, onRejected) {
  let promise;
  switch(this.status) {
    case 'pending':
      promise = new Promisev3((resolve, reject) => {
        this.onFullfilledArray.push(() => {
          try {
            const template = onFullfilled(this.value);
            resolve(template);
          } catch(e) {
            reject(e);
          }
        });
        this.onRejectedArray.push(() => {
          try {
            const template = onRejected(this.reason);
            reject(template);
          } catch(e) {
            reject(e);
          }
        })
      });
      break;
    case 'resolved':
      promise = new Promisev3((resolve, reject) => {
        try {
          const template = onFullfilled(this.value);
          resolve(template);
        } catch(e) {
          reject(e);
        }
      });
      break;
    case 'rejected':
      promise = new Promisev3((resolve, reject) => {
        try {
          const template = onRejected(this.value);
          resolve(template);
        } catch(e) {
          reject(e);
        }
      });
      break;
    default:
      break;
  };
  return promise;
}

const v3 = new Promise((resolve, reject) => {
  resolve(1);
});

v3.then((e1) => {
  console.log('e1 :>> ', e1);
  return { i: 2 };
}).then((e2) => {
  console.log('e2 :>> ', e2);
  return 4;
}).then((e3) => {
  console.log('e3 :>> ', e3);
});