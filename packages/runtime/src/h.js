import { withoutNulls } from './utils/arrays'
import { assert } from './utils/assert'

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
}

/**
 * Hypertext function: creates a virtual node representing an element with
 * the passed in tag.
 *
 * The props are added to the element as attributes.
 * There are some special props:
 * - `on`: an object containing event listeners to add to the element
 * - `class`: a string or array of strings to add to the element's class list
 * - `style`: an object containing CSS properties to add to the element's style
 *
 * The children are added to the element as child nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {string} tag the tag name of the element
 * @param {object} props the props to add to the element
 * @param {array} children the children to add to the element
 * @returns {object} the virtual node
 */
export function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  }
}

/**
 * Creates a text virtual node.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {string} str the text to add to the text node
 * @returns {object} the virtual node
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str }
}

/**
 * Wraps the virtual nodes in a fragment, adding the passed in props to the
 * individual nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {array} vNodes the virtual nodes to wrap in a fragment
 * @param {object} props the props to add to the fragment's children
 * @returns {object} the virtual node
 */
export function hFragment(vNodes, props = {}) {
  assert(Array.isArray(vNodes), 'hFragment expects an array of vNodes')

  const children = mapTextNodes(withoutNulls(vNodes))

  for (const child of children) {
    if (child.type !== DOM_TYPES.TEXT) {
      child.props = { ...child.props, ...props }
    }
  }

  return {
    type: DOM_TYPES.FRAGMENT,
    children,
  }
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === 'string' ? hString(child) : child
  )
}
