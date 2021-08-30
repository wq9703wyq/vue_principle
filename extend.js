/*
 * @Descripttion: extend --- extend原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-22 23:50:45
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-08-23 18:33:58
 */

export function initExtend(Vue) {
  let cid = 0; // 组件唯一标识
  Vue.extend = function (extendOptions) {
    // 创建子类的构造函数，并且调用初始方法
    const Sub = function VueComponent(options) {
      this._init(options); // 调用Vue的初始方法
    };
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype); // 子类原型指向父类
    Sub.prototype.constructor = Sub; // constructor指向自己 
    Sub.options = mergeOptions(this.options, extendOptions); // 合并自己的options和父类的options

    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // 继承父类的属性
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use
    return Sub; 
  }
}