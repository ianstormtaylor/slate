
import React from 'react'
import Types from 'prop-types'

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
    children: Types.any.isRequired,
    className: Types.string,
    firstOnly: Types.bool,
    node: Types.object.isRequired,
    parent: Types.object,
    state: Types.object.isRequired,
    style: Types.object
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

    if (firstOnly) {
      if (parent.nodes.size > 1) return false
      if (parent.nodes.first() === node) return true
      return false
    } else {
      return true
    }
  }

  /**
   * Render.
   *
   * If the placeholder is a string, and no `className` or `style` has been
   * passed, give it a default style of lowered opacity.
   *
   * @return {Element}
   */

  render() {
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
