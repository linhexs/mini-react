// react/createElement.js

/**
 * 创建虚拟DOM结构
 * @param {*} type 标签
 * @param {*} props 属性
 * @param  {...any} children 自己诶单 
 * @returns 虚拟DOM结构
 */
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" 
          ? child  
          : createTextElement(child) //不是对象说明是文本节点
      ),
    },
  }
}


/**
 * 创建文本节点
 * @param {*} text 文本值
 * @returns 虚拟DOM结构
 */
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}