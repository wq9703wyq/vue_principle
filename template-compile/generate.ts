/*
 * @Descripttion: generate ---- 根据ast模板编译
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-09 20:54:16
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-09 22:55:53
 */

export class CodegenState {
  options: CompilerOptions;
  warn: Function;
  transforms: Array<TransformFunction>;
  dataGenFns: Array<DataGenFunction>;
  directives: { [key: string]: DirectiveFunction };
  maybeComponent: (el: ASTElement) => boolean;
  onceId: number;
  staticRenderFns: Array<string>;
  pre: boolean;

  constructor (options: CompilerOptions) {
    this.options = options
    this.warn = options.warn || baseWarn
    this.transforms = pluckModuleFunction(options.modules, 'transformCode')
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    this.directives = extend(extend({}, baseDirectives), options.directives)
    const isReservedTag = options.isReservedTag || no
    this.maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)
    this.onceId = 0
    this.staticRenderFns = []
    this.pre = false
  }
}

export function generate(ast, options) {
  const state = new CodegenState(options)
  // fix #11483, Root level <script> tags should not be rendered.
  const code = ast ? (ast.tag === 'script' ? 'null' : genElement(ast, state)) : '_c("div")'
  // code的内容类似这样
  // _c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // target._o = markOnce
  // target._n = toNumber
  // target._s = toString
  // target._l = renderList
  // target._t = renderSlot
  // target._q = looseEqual
  // target._i = looseIndexOf
  // target._m = renderStatic
  // target._f = resolveFilter
  // target._k = checkKeyCodes
  // target._b = bindObjectProps
  // target._v = createTextVNode
  // target._e = createEmptyVNode
  // target._u = resolveScopedSlots
  // target._g = bindObjectListeners
  // target._d = bindDynamicKeys
  // target._p = prependModifier
  // target._c = createElement
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

export function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state) /*  */
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}