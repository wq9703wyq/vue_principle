/*
 * @Descripttion: mixin ---- 全局mixin方法
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-09 23:55:03
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-01-06 01:22:48
 */
import { mergeOptions } from '../util/index'
export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    // 定义全局混入方法，this === Vue
    this.options = mergeOptions(this.options, mixin)
  };
}