
import { Editor, Mark, Raw } from '../..'
import Portal from 'react-portal'
import React from 'react'
import position from 'selection-position'
import state from './state.json'

/**
 * Node renderers.
 *
 * @type {Object}
 */

const NODES = {
  paragraph: props => <p>{props.children}</p>
}

/**
 * Mark renderers.
 *
 * @type {Object}
 */

const MARKS = {
  bold: {
    fontWeight: 'bold'
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: '3px',
    borderRadius: '4px'
  },
  italic: {
    fontStyle: 'italic'
  },
  underlined: {
    textDecoration: 'underline'
  }
}

/**
 * The rich text example.
 *
 * @type {Component}
 */

class HoveringMenu extends React.Component {

  state = {
    state: Raw.deserialize(state)
  };

  componentDidMount() {
    this.updateMenu()
  }

  componentDidUpdate() {
    this.updateMenu()
  }

  hasMark(type) {
    const { state } = this.state
    const { marks } = state
    return marks.some(mark => mark.type == type)
  }

  onClickMark(e, type) {
    e.preventDefault()
    const isActive = this.hasMark(type)
    let { state } = this.state

    state = state
      .transform()
      [isActive ? 'unmark' : 'mark'](type)
      .apply()

    this.setState({ state })
  }

  updateMenu() {
    const { menu, state } = this.state
    if (!menu) return

    if (state.isBlurred || state.isCollapsed) {
      menu.removeAttribute('style')
      return
    }

    const rect = position()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
  }

  onOpen(el) {
    this.setState({ menu: el.firstChild })
  }

  render() {
    return (
      <div>
        {this.renderMenu()}
        {this.renderEditor()}
      </div>
    )
  }

  renderMenu() {
    const { state } = this.state
    const isOpen = state.isExpanded && state.isFocused
    return (
      <Portal isOpened={true} onOpen={el => this.onOpen(el)} >
        <div className="menu hover-menu">
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>
      </Portal>
    )
  }

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    return (
      <span className="button" onMouseDown={e => this.onClickMark(e, type)} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderEditor() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => NODES[node.type]}
          renderMark={mark => MARKS[mark.type]}
          onChange={(state) => {
            console.groupCollapsed('Change!')
            console.log('Document:', state.document.toJS())
            console.log('Selection:', state.selection.toJS())
            console.log('Content:', Raw.serialize(state))
            console.groupEnd()
            this.setState({ state })
          }}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default HoveringMenu
