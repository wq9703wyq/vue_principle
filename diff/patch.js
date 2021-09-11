/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2021-09-10 22:11:17
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2021-09-11 21:27:46
 */

function sameVnode(a, b) {
  return (
    a.key === b.key && /* key值比较 */
    a.asyncFactory === b.asyncFactory /* asyncFactory是否一致 */ && (
      (
        a.tag === b.tag /* 标签是否一致 */ &&
        a.isComment === b.isComment /* 是否都是注释 */ &&
        isDef(a.data) === isDef(b.data) /* 是否都有定义data */ &&
        sameInputType(a, b) /* 当都是input标签时，type必须相同 */
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (key) map[key] = i
  }
  return map
}

function findIdxInOld (node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (c && sameVnode(node, c)) return i
  }
}

function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      // 跳过空节点
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (!oldEndVnode) {
      // 跳过空节点
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 深度优先diff
      patchVnode(oldStartVnode, newStartVnode, newCh, newStartIdx)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, newCh, newEndIdx)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // newE对比oldS是否右移
      patchVnode(oldStartVnode, newEndVnode, newCh, newEndIdx);
      // 只移动oldS位置
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // newS对比oldE是否左移
      patchVnode(oldEndVnode, newStartVnode, newCh, newStartIdx)
      // 移动oldE
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 获取剩下的旧vdom子节点的key-index的map
      if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      // 根据newS的key获取index或者遍历旧vdom通过sameVnode找到newS对应index
      idxInOld = newStartVnode.key
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (!idxInOld) { // New element
        createElm(newStartVnode, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, newCh, newStartIdx)
          oldCh[idxInOld] = undefined
          nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (oldStartIdx > oldEndIdx) {
    // oldCh比newCh少，创建新的newCh并插入到对应位置
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    // newCh比oldCh少，移除多余的oldCh
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}


function patchVnode(oldVnode, vnode) {
  // 开始diff
  if (oldVnode === vnode) {
    return;
  }
  const elm = vnode.elm = oldVnode.elm; /* 取真实dom对象 */

  // 复用静态节点
  if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
    vnode.componentInstance = oldVnode.componentInstance
    return;
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (!vnode.text) {
    // 新旧vdom都有子节点，并且子节点不一致
    if (oldCh && ch && oldCh !== ch) {
      // 比较子节点并更新
      updateChildren(elm, oldCh, ch, removeOnly);
    } else if (ch) {
      // 存在新vdom子节点，且旧vdom存在文本 => 清除旧vdom文本
      if (oldVnode.text) nodeOps.setTextContent(elm, '')
      // 添加新节点
      addVnodes(elm, null, ch, 0, ch.length - 1)
    } else if (oldCh) {
      // 新vdom为空，清除旧vnode
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      // 新节点为空，清除旧文本
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 直接替换文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}

export function patch(oldVnode, vnode) {
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
  } else {
    const isRealElement = oldVnode.nodeType;
    // 非真实dom，并且oldVnode和vnode为同一个虚拟dom
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode);
    }
  }
}