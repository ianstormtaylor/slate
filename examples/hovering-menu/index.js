
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'

const root = window.document.querySelector('main')

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
  }
}

/**
 * The menu.
 *
 * @type {Component}
 */

class Menu extends React.Component {

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type) {
    const { state } = this.props
    return state.activeMarks.some(mark => mark.type == type)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event, type) {
    const { state, onChange } = this.props
    event.preventDefault()
    const change = state.change().toggleMark(type)
    onChange(change)
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      ReactDOM.createPortal(
        <div className="menu hover-menu" ref={this.props.menuRef}>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>,
        root
      )
    )
  }

}


/**
 * The hovering menu example.
 *
 * @type {Component}
 */

class HoveringMenu extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState)
  }

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * Save the `menu` ref.
   *
   * @param {Menu} menu
   */

  menuRef = (menu) => {
    this.menu = menu
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Menu
          menuRef={this.menuRef}
          state={this.state.state}
          onChange={this.onChange}
        />
        <div className="editor">
          <Editor
            placeholder="Enter some text..."
            schema={schema}
            state={this.state.state}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const { state } = this.state
    const menu = this.menu
    if (!menu) return

    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
  }

}

/**
 * Export.
 */

export default HoveringMenu
