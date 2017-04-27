
import React from 'react'

/**
 * Placeholder.
 *
 * @type {Component}
 */

class Placeholder extends React.Component {

  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    className: React.PropTypes.string,
    firstOnly: React.PropTypes.bool,
    node: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
  }

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    firstOnly: true
  }

  /**
   * Should the placeholder update?
   *
   * @param {Object} props
   * @param {Object} state
   * @return {Boolean}
   */

  shouldComponentUpdate = (props, state) => {
    return (
      props.children != this.props.children ||
      props.className != this.props.className ||
      props.firstOnly != this.props.firstOnly ||
      props.parent != this.props.parent ||
      props.node != this.props.node ||
      props.style != this.props.style
    )
  }

  /**
   * Is the placeholder visible?
   *
   * @return {Boolean}
   */

  isVisible = () => {
    const { firstOnly, node, parent } = this.props
    if (node.text) return false
    if (parent.nodes.size > 1) return false

    const index = parent.nodes && parent.nodes.indexOf(node)
    const isFirst = index === 0
    if (index === -1) return false
    if (!firstOnly || (firstOnly && isFirst)) return true

    return false
  }

  /**
   * Render.
   *
   * If the placeholder is a string, and no `className` or `style` has been
   * passed, give it a default style of lowered opacity.
   *
   * @return {Element}
   */

  render = () => {
    const isVisible = this.isVisible()
    if (!isVisible) return null

    const { children, className } = this.props
    let { style } = this.props

    if (typeof children === 'string' && style == null && className == null) {
      style = { opacity: '0.333' }
    } else if (style == null) {
      style = {}
    }

    const styles = {
      position: 'absolute',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      pointerEvents: 'none',
      ...style
    }

    return (
      <span contentEditable={false} className={className} style={styles}>
        {children}
      </span>
    )
  }

}

/**
 * Export.
 *
 * @type {Component}
 */

export default Placeholder
