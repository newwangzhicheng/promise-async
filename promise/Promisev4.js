/**
 * 这一版本继续提出问题并解决
 * ! 如果then返回的是Promise对象呢
 * ! 如果then返回的是自身呢
 * ! onFullfilled和onRejected如果不是函数应该被忽略
 * 
 * ! 如果then返回的对象x有一个then方法呢（对象是thenabble的）；这个情况有点复杂
 * ! 首先判断x是否是一个对象
 * ! 获取x.then，防止x没有这个方法；用try catch包裹
 * ! 执行x.then的方法，为防止重复执行，用一个called tag
 * 
 * 
 * then内部的函数应该异步执行的
 * * 可以用setTimeout模拟
 */

function Promisev4(constructor) {
  const self = this;
  self.status = 'pending';
  self.value = undefined;
  self.reason = undefined;
  self.onFullfilledArray = [];
  self.onRejectedArray = [];

  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.value = value;
      self.onFullfilledArray.forEach((fn) => {
        fn(value);
      });
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.reason = reason;
      self.onRejectedArray.forEach((fn) => {
        fn(reason);
      });
    }
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('promise circle'));
  }

  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    let called;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (called) {
            return;
          }
          called = true;
          resolvePromise(promise, y, resolve, reject);
        }, (r) => {
          if (called) {
            return;
          }
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) {
        return;
      }
      reject(e);
    }
  } else {
    resolve(x);
  }
}

Promisev4.prototype.then = function (onFullfilled, onRejected) {
  onFullfilled = (typeof onFullfilled === 'function') ? onFullfilled : function (x) {
    return x;
  };
  onRejected = (typeof onRejected === 'function') ? onRejected : function (e) {
    throw e;
  };

  let promise;
  switch (this.status) {
    case 'pending':
      promise = new Promisev4((resolve, reject) => {
        this.onFullfilledArray.push(() => {
          setTimeout(() => {
            try {
              const x = onFullfilled(this.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedArray.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      });
      break;
    case 'resolved':
      promise = new Promisev4((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFullfilled(this.value);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
      break;
    case 'rejected':
      promise = new Promisev4((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
      break;
    default:
      break;
  }
  return promise;
};

// const v4 = new Promisev4((resolve) => {
//   resolve(1);
// });
// v4.then((e) => {
//   console.log(`e`, e)
// })

Promisev4.deferred = function () {
  var result = {};
  result.promise = new Promisev4(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
module.exports = Promisev4;