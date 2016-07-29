
import React from 'react'

class Bold extends React.Component {
  render() {
    return <strong>{this.props.children}</strong>
  }
}

export function renderMark(mark) {
  if (mark.type == 'bold') return Bold
}
