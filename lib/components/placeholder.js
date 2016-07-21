
import Portal from 'react-portal'
import React from 'react'
import findDOMNode from '../utils/find-dom-node'

/**
 * Placeholder.
 */

class Placeholder extends React.Component {

  /**
   * Properties.
   */

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    className: React.PropTypes.string,
    node: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  };

  /**
   * Constructor.
   *
   * @param {Object} props
   */

  constructor(props) {
    super(props)
    this.tmp = {}
  }

  /**
   * Should the component update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (props, state) => {
    return (
      props.children != this.props.children ||
      props.className != this.props.className ||
      props.parent != this.props.parent ||
      props.node != this.props.node ||
      props.style != this.props.style
    )
  }

  /**
   * On mount, start listening for resize events.
   */

  componentDidMount = () => {
    window.addEventListener('resize', this.updatePosition)
  }

  /**
   * On unmount, stop listening for resize events.
   */

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updatePosition)
  }

  /**
   * Is the placeholder visible?
   *
   * @return {Boolean}
   */

  isVisible = () => {
    const { onlyFirstChild, node, parent } = this.props
    if (node.text) return false
    if (parent.nodes.size > 1) return false

    const isFirst = parent.nodes.first() === node
    if (isFirst) return true

    return false
  }

  /**
   * On open, update the placeholder element's position.
   *
   * @param {Element} portal
   */

  onOpen = (portal) => {
    this.tmp.placeholder = portal.firstChild
    this.updatePosition()
  }

  /**
   * Update the placeholder element's position.
   */

  updatePosition = () => {
    const { node } = this.props
    const { placeholder } = this.tmp
    if (!placeholder) return

    const el = findDOMNode(node)
    const rect = el.getBoundingClientRect()
    placeholder.style.pointerEvents = 'none'
    placeholder.style.position = 'absolute'
    placeholder.style.top = `${window.scrollY + rect.top}px`
    placeholder.style.left = `${window.scrollX + rect.left}px`
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
  }

  /**
   * Render.
   *
   * If the placeholder is a string, and no `className` or `style` has been
   * passed, give it a default style of lowered opacity.
   *
   * @return {Element} element
   */

  render = () => {
    const isOpen = this.isVisible()
    const { children, className } = this.props
    let { style } = this.props

    if (typeof children === 'string' && style == null && className == null) {
      style = { opacity: '0.333'}
    }

    return (
      <Portal isOpened={isOpen} onOpen={this.onOpen}>
        <span className={className} style={style}>{children}</span>
      </Portal>
    )
  }

}

/**
 * Export.
 */

export default Placeholder
