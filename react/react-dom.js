// react/react-dom.js

// 下一个功能单元
let nextUnitOfWork = null
// 根节点
let wipRoot = null
// 更新前的根节点fiber树
let currentRoot = null
// 需要删除的节点
let deletions = null

/**
 * 将虚拟 DOM 转换为真实 DOM 并添加到容器中
 * @param {element} 虚拟 DOM
 * @param {container} 真实 DOM
 */
export function render(element, container) {
  // 根节点
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 最后一个fiber树的引用
    alternate: currentRoot
  }
  deletions = []
  // 将根节点设置为下一个将要工作单元
  nextUnitOfWork = wipRoot
}

/**
 * 创建DOM
 * @param {*} fiber fiber节点
 * @returns dom 真实dom节点
 */
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)
  return dom
}

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
// 是否有新属性
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
// 是否有旧属性
const isGone = (prev, next) => key => !(key in next)

/**
 * 更新dom属性
 * @param {*} dom 
 * @param {*} prevProps 老属性
 * @param {*} nextProps 新属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除老的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // 移除老的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // 设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
    
    // 添加新的事件处理
    Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

/**
 * 处理提交的fiber树
 * @param {*} fiber 
 * @returns 
 */
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  // 处理新增节点标记
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
    // 处理删除节点标记
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
    // 处理更新属性
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  }

  // 渲染子节点
  commitWork(fiber.child)
  // 渲染兄弟节点
  commitWork(fiber.sibling)
}

/**
 * 提交任务，将fiber tree 渲染为真实 DOM
 */
function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

/**
 * 工作循环
 * @param {*} deadline 截止时间
 */
function workLoop(deadline) {
  // 停止循环标识
  let shouldYield = false
  // 循环条件为存在下一个工作单元，且没有更高优先级的工作
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    // 当前帧空余时间要没了，停止工作循环
    shouldYield = deadline.timeRemaining() < 1
  }

  // 没有下一个工作单元，提交当前fiber树
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  // 空闲时间执行任务
  requestIdleCallback(workLoop)
}
// 空闲时间执行任务
requestIdleCallback(workLoop)

/**
 * 协调
 * @param {*} wipFiber 
 * @param {*} elements 
 */
function reconcileChildren(wipFiber, elements) {
  // 索引
  let index = 0
  // 上一次渲染的fiber
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  // 上一个兄弟节点
  let prevSibling = null

  // 遍历孩子节点
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    // 创建fiber
    const newFiber = null

    // 类型判断
    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    // 类型相同只更新props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    // 新的存在并且类型和老的不同需要新增
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    // 老的存在并且类型和新的不同需要移除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    // 将第一个孩子节点设置为 fiber 的子节点
    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      // 第一个之外的子节点设置为第一个子节点的兄弟节点
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}
/**
 * 处理工作单元，返回下一个工作单元
 * @param {*} fiber 
 */
function performUnitOfWork(fiber) {
  // 如果fiber上没有dom节点，为其创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // 获取到当前fiber的孩子节点
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)

  // 寻找下一个孩子节点，如果有返回
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    // 如果有兄弟节点，返回兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 否则返回父节点
    nextFiber = nextFiber.parent
  }
}
