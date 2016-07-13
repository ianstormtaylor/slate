
import { Editor, Mark, Raw } from '../..'
import Portal from 'react-portal'
import React from 'react'
import position from 'selection-position'
import initialState from './state.json'

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
    state: Raw.deserialize(initialState)
  };

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  render = () => {
    return (
      <div>
        {this.renderMenu()}
        {this.renderEditor()}
      </div>
    )
  }

  renderMenu = () => {
    const { state } = this.state
    const isOpen = state.isExpanded && state.isFocused
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="menu hover-menu">
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>
      </Portal>
    )
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderMark={this.renderMark}
          onChange={this.onChange}
        />
      </div>
    )
  }

  renderMark = (mark) => {
    return MARKS[mark.type]
  }

  updateMenu = () => {
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

  hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type == type)
  }

  onChange = (state) => {
    this.setState({ state })
  }

  onClickMark = (e, type) => {
    e.preventDefault()
    const isActive = this.hasMark(type)
    let { state } = this.state

    state = state
      .transform()
      [isActive ? 'unmark' : 'mark'](type)
      .apply()

    this.setState({ state })
  }

  onOpen = (el) => {
    this.setState({ menu: el.firstChild })
  }

}

/**
 * Export.
 */

export default HoveringMenu
