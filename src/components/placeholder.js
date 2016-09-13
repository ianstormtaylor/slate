
import React from 'react'

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
    const { node, parent } = this.props
    if (node.text) return false
    if (parent.nodes.size > 1) return false

    const isFirst = parent.nodes.first() === node
    if (isFirst) return true

    return false
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
    const isVisible = this.isVisible()
    if (!isVisible) return null

    const { children, className } = this.props
    let { style } = this.props

    if (typeof children === 'string' && style == null && className == null) {
      style = { opacity: '0.333'}
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
 */

export default Placeholder
