import parse from "./parse"
/*
 * @Descripttion: 模板转化
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-30 20:55:21
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-08-30 21:05:48
 */
export function compileToFunctions(template, options) {
  // 1.将html代码转化成ast语法树
  const ast = parse(template.trim(), options);

  // 2.优化静态节点
  if (options.optimize !== false) {
    optimize(ast, options); 
  }

  // 3.生成render函数
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}