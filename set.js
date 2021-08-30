/*
 * @Descripttion: $set---原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-16 22:47:35
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-08-22 22:47:26
 */
export function set(target, key, val) {
  // 对象是数组，调用arrayMethods中重写的splice方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  // 对象拥有已存在属性，直接添加
  if(key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  const ob = target.__ob__;
  // 如果不是响应式，也不需要将其定义成响应式数据
  if(!ob) {
    target[key] = val;
    return val;
  }

  // 将数据定义成响应式
  defineReactive(ob.value, key, val);
  // 通知视图更新
  ob.dep.notify();
  return val;
}