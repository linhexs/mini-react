// react/react-dom.js
/**
 * 将虚拟 DOM 转换为真实 DOM 并添加到容器中
 * @param {element} 虚拟 DOM
 * @param {container} 真实 DOM
 */
export function render(element, container) {
  // 处理文本节点和标签节点
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
  // 为节点绑定属性
  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })
  // 处理孩子节点
  element.props.children.forEach(child =>
    render(child, dom)
  )
  // 添加到容器
  container.appendChild(dom)
}

// 下一个功能单元
let nextUnitOfWork = null

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
  // 空闲时间应该任务
  requestIdleCallback(workLoop)
}
// 空闲时间执行任务
requestIdleCallback(workLoop)

// 执行单元事件，返回下一个单元事件
function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
