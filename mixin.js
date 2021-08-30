/*
 * @Descripttion: mixin ---- mixin原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-06-22 21:12:33
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-06-22 21:44:00
 */

// 定义生命周期
export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];

const strats = {}; // 合并策略

function mergeHook(parentVal, childVal) {
  // 如果组件有钩子函数
  if (childVal) {
    // 如果mixin也存在钩子函数
    if (parentVal) {
      return parentVal.concat(childVal); // 合并成一个数组
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

// 钩子函数的合并策略
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook;
});

// 核心方法
export function mergeOptions(parent, child) {
  const options = {};
  for (let k in parent) {
    mergeFiled(k);
  }

  for (let k in child) {
    if (!parent.hasOwnProperty(k)) {
      mergeFiled(k)
    }
  }

  function mergeFiled(k) {
    if(strats[k]) {
      options[k] = strats[k](parent[k], child[k]);
    } else {
      // 默认策略
      // 优先调用自身选项
      options[k] = child[k] ? child[k] : parent[k];
    }
  }
}