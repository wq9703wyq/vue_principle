import parse from "./parse"
import { optimize } from './optimizer'
import { generate } from './generate'
/*
 * @Descripttion: 模板转化
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-30 20:55:21
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-09 22:48:34
 */
export function compileToFunctions(template, options) {
  // 1.将html代码转化成ast语法树
  const ast = parse(template.trim(), options);

  // 2.标记静态节点
  if (options.optimize !== false) {
    optimize(ast, options); 
  }

  // 3.生成render函数的code body
  const code = generate(ast, options);
  return {
    ast,
    // render: new Function(`with(this)${return ${code}}`);
    // with(this)改变作用域this，code内的"name"就会变成"this.name"
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}