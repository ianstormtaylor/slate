
import React from 'react'

/**
 * LeafNode.
 */

class LeafNode extends React.Component {

  static propTypes = {
    styles: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired,
  };

  render() {
    const { text, styles } = this.props
    return (
      <span style={styles} data-type='leaf'>{text}</span>
    )
  }

}

/**
 * Export.
 */

export default LeafNode
