
import React from 'react'

class Bold extends React.Component {
  render() {
    return <strong>{this.props.children}</strong>
  }
}

export const schema = {
  marks: {
    bold: Bold
  }
}
