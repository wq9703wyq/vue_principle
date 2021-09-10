/*
 * @Descripttion: 响应式数据原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-16 21:49:17
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-10 21:54:18
 */

import { arrayMethods } from "../arrayMethods";

class Observe {
  constructor(value) {
    if (Array.isArray(value)) {
      // 如果是数组，重写对象的数组方法原型
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  // 非数组对象的递归监听
  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }

  // 数组对象的递归监听，不会对简单数据类型进行监听
  observeArray(items) {
    for (let i = 0; i < array.length; i++) {
      observe(items[i]);
    }
  }
}


function defineReactive(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    }
  });
}

export function observe(value) {
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observe) {
    return value.__ob__
  } else if (Object.prototype.toString.call(value) === "[object Object]" || Array.isArray(value)) {
    return new Observe(value);
  }
}