/**
 * 初始版本的promise，包含了一下内容
 * * status 存储目前的状态，包含：pending，resolved，rejected；初始pending
 * * value 存储resolved的值
 * * reason 存储rejected的原因
 * 
 * * resolve函数，改变状态为resolved
 * * reject函数，改变状态rejected
 * * try-catch同步执行传入的函数
 * 
 * * 在原型上实现一个then方法
 * * then里面根据目前状态执行onFullfilled或onRejected函数
 */
function Promisev1(constructor) {
  const self = this;
  self.status = 'pending';
  self.value = undefined;
  self.reason = undefined;

  try {
    constructor(resolve, reject);
  } catch(e) {
    reject(e);
  }

  function resolve(value) {
    if (self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected'
    }
  }
}

Promisev1.prototype.then = function(onFullfilled, onRejected) {
  switch(this.status) {
    case 'resolved':
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
const v1 = new Promisev1((resolve, reject) => {
  resolve(1);
  reject(2);
})

v1.then((e) => {
  console.log(`e`, e)
}, (err) => {
  console.log(`err`, err)
})
