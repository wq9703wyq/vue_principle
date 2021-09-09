/*
 * @Descripttion: mixin ---- 全局mixin方法
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-09 23:55:03
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-09 23:56:18
 */
import { mergeOptions } from '../util/index'
export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    //   合并对象
    this.options = mergeOptions(this.options, mixin)
  };
}