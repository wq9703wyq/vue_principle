import { callHook } from "./callHook";
import {mergeOptions} from "./util/index"

/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-10 00:50:47
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-10 00:56:30
 */
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 这里的this代表调用_init方法的对象(实例对象)
    //  this.$options就是用户new Vue的时候传入的属性和全局的Vue.options合并之后的结果

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