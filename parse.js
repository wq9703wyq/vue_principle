/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-08-30 21:06:12
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-01 00:03:24
 */

  // 生成AST方法
export function createASTElement(tagName, attrs) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: [] 
  }
}

export function pares(template, options) {
  let root ,currentParent; // 代表根节点、当前父节点
  // 栈结构 表示开始和结束标签
  let stack = [];
  // 标识元素和文本type
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;

  function closeElement(element) {
    // 移除空白子节点
    trimEndingWhitespace(element);
    if (!stack.length && element !== root) {
      if (root.if && (element.elseif || element.else)) {
        addIfCondition(root, {exp: element.elseif, block: element})
      } 
    }
    if (currentParent && !element.forbidden) {
      // 处理elseif模块
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent);
      } else {
        if (element.slotScope) {
          const name = element.slotTarget || '"default"';
          (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        }
        currentParent.children.push(element);
        element.parent = currentParent;
      }
    }
  }

  parseHTML(template, {
    start(tag, attrs, unary, start, end) {
      let element = createASTElement(tag, attrs, currentParent);
      if (!root) {
        root = element;
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },
    end(tag, start, end) {
      const element = stack[stack.length - 1];;
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },
    chars(text, start, end) {
      if (!currentParent) {
        // 没有父元素
        return;
      }
      const children = currentParent.children;
      children.push({
        type: 3,
        text
      });
    }
  })
}