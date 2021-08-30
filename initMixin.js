/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-23 18:48:51
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-08-23 19:04:41
 */
export function initMixin(Vue) {
  const vm = this;

  // 合并用户new Vue时传入的options和父类的Options
  vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {});

  // 初始化状态
  initState(vm);

  // 如果有el属性，则进行模板渲染
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}


