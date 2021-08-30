/*
 * @Descripttion: vue的observe对数组方法重写
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-16 23:51:34
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-08-22 22:50:03
 */

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort"
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    const result = arrayProto[method].apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }

    if (inserted) ob.observerArray(inserted);
    ob.dep.notify();
    return result;
  }
})