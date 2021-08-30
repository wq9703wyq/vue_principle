/*
 * @Descripttion: keepAlive----原理
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-06-22 22:47:21
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-06-26 20:31:24
 */

export default {
  name: "keep-alive",
  abstract: true, // 抽象组件

  props: {
    include: patternTypes, // 要缓存的组件
    exclude: patternTypes, // 要排除的组件
    max: [String, Number] // 最大缓存数量
  },

  created() {
    this.cache = Object.create(null); //缓存对象 {a: vNoode, b: vNode}
    this.keys = []; // 缓存组件的key集合 [a, b]
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, this.key);
    }
  },

  mounted() {
    // 动态监听include exclude
    this.$watch("include", val => {
      pruneCache(this, (name) => matches(val, name));
    });

    this.$watch("exclude", val => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },

  render() {
    const slot = this.$slot.default; // 获取包裹的插槽默认值
    const vnode = getFirstComponentChild(slot); // 获取第一个子组件
    const componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      const name = getComponentName(componentOptions); // 获取包裹组件名称
      const { include, exclude } = this;
      // 判断include/exclude条件
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }

      const { cache, keys } = this;
      // 若子组件没有设置Key则使用子组件属性组成新的key
      const key = vnode.key === null ?
        componentOptions.Ctor.cid +
        (componentOptions.tag ? `::${componentOptions.tag}` : "")
        : vnode.key;

      if (cache[key]) {
        // 根据key找到缓存
        vnode.componentInstance = cache[key].componentInstance;

        // 删掉旧key值，并把key放到最尾部
        // LRU算法，通过将最近访问的对象放到队列尾部提高访问效率，当队列值满时则删除头部低访问对象
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }

    return vnode || (slot && slot[0]);
  }
}
