/*
 * @Descripttion: nextTick----原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-06-22 21:43:50
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-06-22 22:28:45
 */


let callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}

let timeFunc;

if (typeof Promise !== "undefined") { // Promise 异步
  const p = Promise.resolve();
  timeFunc = () => {
    p.then(flushCallbacks);
  }
} else if (typeof MutationObserver !== "undefined") { // MutationObserver 监听创建的dom节点异步
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, { characterData: true });
  timeFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") { // setImmediate 异步
  timeFunc = () => {
    setImmediate(flushCallbacks);
  }
} else { // setTimeout异步
  timeFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    // 多次调用nextTick 只会执行一次异步 异步队列清空后再把标志改回false
    pending = true;
    timeFunc();
  }
}
