/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-10 00:50:03
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-01-06 01:19:14
 */
import { initMixin } from "./init.js";
// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
  // 这里开始进行Vue初始化工作
  // 组件实例化，options 是组件选项
  this._init(options);
}
// 此做法有利于代码分割
initMixin(Vue);
export default Vue;