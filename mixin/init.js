import { callHook } from "./callHook";
import {mergeOptions} from "./util/index"

/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-10 00:50:47
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-01-06 01:21:48
 */
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 初始化中 this 为Vue实例，options 是组件选项
    vm.$options = mergeOptions(vm.constructor.options, options);
    callHook(vm, "beforeCreate"); //初始化数据之前
    // 初始化状态
    initState(vm);
    callHook(vm, "created"); //初始化数据之后
    // 如果有el属性 进行模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}