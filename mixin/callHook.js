/*
 * @Descripttion: 生命周期钩子如何实现
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-09 23:06:09
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-10 00:53:43
 */

// Vue事先将用户传入的生命周期钩子用二维数组的方式储存，在创建实例的过程中再依次调用对应的钩子数组
export function callHook(vm, hook) {
  // 依次执行生命周期对应的方法
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); //生命周期里面的this指向当前实例
    }
  }
}