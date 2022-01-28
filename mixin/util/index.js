/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-09 23:56:50
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-01-06 01:49:11
 */

import extend from "extend";

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

strats.data = function(parentVal, childVal) {
  if (childVal && typeof childVal !== "function") {
    // data合并策略中mixin的data必须是function
    return parentVal;
  }
  
  if (!childVal) {
    return parentVal;
  }
  if (!parentVal) {
    return childVal;
  }
  return function mergeDataFn() {
    return mergeData(
      typeof childVal === "function" ? childVal.call(this, this) : childVal,
      typeof parentVal === "function" ? parentVal.call(this, this) : parentVal
    )
  }
}

function mergeData(to, from) {
  if (!from) return to;
  let key, toVal, fromVal;
  const keys = Object.keys(from);

  for(let i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];

    if (!to.hasOwnProperty(key)) {
      set(to, key, fromVal); // Vue.set 方法
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal); // 递归合并
    }
  }
  return to;
}

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

strats.watch = function(parentVal, childVal) {
  if (!childVal) return Object.create(parentVal || null);
  if (!parentVal) return childVal;
  const ret = {...parentVal};
  for (const key in childVal) {
    let parent = ret[key];
    const child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    // 与 mergeHook 相似合并成一个数组
    ret[key] = parent ? parent.concat(child) : [child];
  }
}

strats.computed = function(parentVal, childVal) {
  if (!parentVal) return childVal;
  const ret = Object.create(null);
  ret = {...parentVal};
  if (childVal) {
    Object.assign(ret, childVal);
  }
  return ret;
}


// 核心方法
export function mergeOptions(parentVal, childVal) {
  const options = {};
  if (childVal.extend) {
    parentVal = mergeOptions(parentVal, childVal.extends);
  }
  if (childVal.mixins) {
    for(let i = 0, l = childVal.mixins.length; i < l; i++) {
      parentVal = mergeOptions(parentVal, childVal.mixins[i]);
    }
  }
  for (let k in parentVal) {
    mergeFiled(k);
  }

  for (let k in childVal) {
    if (!parentVal.hasOwnProperty(k)) {
      // 组件存在同名属性不进行合并
      mergeFiled(k);
    }
  }

  function mergeFiled(k) {
    if(strats[k]) {
      // 判断是否有自定义合并策略
      options[k] = strats[k](parentVal[k], childVal[k]);
    } else {
      // 默认策略
      // 优先使用mixin属性
      options[k] = childVal[k] ? childVal[k] : parentVal[k];
    }
  }
  return options;
}