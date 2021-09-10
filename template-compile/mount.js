/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-23 19:04:57
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-10 22:04:24
 */
import { compileToFunctions } from "./compileToFunctions";

Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;

  if (!options.render) {
    let template = options.template;
    // 如果存在template属性
    if (template) {
      // 如果template是字符串，且首字符为#，通过document.query找到dom节点的innerHtml
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
        }
      } else if (template.nodeType) {
        // 如果template本身是dom节点，直接取innerHtml
        template = template.innerHTML;
      } else {
        // template不符合要求，中断返回
        return vm;
      }
    } else if (el) {
      // 不存在template，取el的outerHTML
      template = el.outerHTML;
    }

    if (template) {
      const render = compileToFunctions(template);
      options.render = render;
    }
  }
}