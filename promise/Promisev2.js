/**
 * 第二个版本的Promise
 * 使用观察者模式解决不能异步调用resolve，reject的问题
 * 在v1的版本上新增一下内容：
 * * 使用数组onFullfilledArry,onRejectedArray存储异步的resolve，reject方法
 * * 在then阶段收集还处于pending状态的onFullfilled，onRejected函数
 * * 在resolve阶段改变状态并执行onFullfilledArry数组内的方法
 * * 在reject阶段改变状态并执行onRejectedArray数组内的方法
 * 
 * * 缺陷是无法实现链式调用
 */

function Promisev2(constructor) {
  let self = this;
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
      self.onFullfilledArray.forEach((fn) => {
        fn(self.value);
      })
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.reason = reason;
      self.onRejectedArray.forEach((fn) => {
        fn(self.reason);
      });
    }
  }
}

Promisev2.prototype.then = function(onFullfilled, onRejected)  {
  switch(this.status) {
    case 'pending':
      this.onFullfilledArray.push(() => {
        onFullfilled(this.value);
      });
      this.onRejectedArray.push(() => {
        onRejected(this.reason);
      });
      break;
    case 'resolve':
      onFullfilled(this.value);
      break;
    case 'rejected':
      onRejected(this.reason);
      break;
    default:
      break;
  }
};

// 使用
const v2 = new Promisev2((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
})

v2.then((e) => {
  console.log('e :>> ', e);
}, (err) => {
  console.log('err :>> ', err);
})