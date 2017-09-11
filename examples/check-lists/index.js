
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * Check list item.
 *
 * @type {Component}
 */

class CheckListItem extends React.Component {

  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} e
   */

  onChange = (e) => {
    const checked = e.target.checked
    const { editor, node } = this.props
    editor.change(c => c.setNodeByKey(node.key, { data: { checked }}))
  }

  /**
   * Render a check list item, using `contenteditable="false"` to embed the
   * checkbox right next to the block's text.
   *
   * @return {Element}
   */

  render() {
    const { attributes, children, node } = this.props
    const checked = node.data.get('checked')
    return (
      <div
        className={`check-list-item ${checked ? 'checked' : ''}`}
        contentEditable={false}
        {...attributes}
      >
        <span>
          <input
            type="checkbox"
            checked={checked}
            onChange={this.onChange}
          />
        </span>
        <span contentEditable suppressContentEditableWarning>
          {children}
        </span>
      </div>
    )
  }

}

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'check-list-item': CheckListItem,
  },
}

/**
 * The rich text example.
 *
 * @type {Component}
 */

class CheckLists extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState)
  }

  /**
   * On change, save the new state.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * On key down...
   *
   * If enter is pressed inside of a check list item, make sure that when it
   * is split the new item starts unchecked.
   *
   * If backspace is pressed when collapsed at the start of a check list item,
   * then turn it back into a paragraph.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @return {State|Void}
   */

  onKeyDown = (e, data, change) => {
    const { state } = change

    if (
      data.key == 'enter' &&
      state.startBlock.type == 'check-list-item'
    ) {
      return change
        .splitBlock()
        .setBlock({ data: { checked: false }})
    }

    if (
      data.key == 'backspace' &&
      state.isCollapsed &&
      state.startBlock.type == 'check-list-item' &&
      state.selection.startOffset == 0
    ) {
      return change
        .setBlock('paragraph')
    }
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <div className="editor">
          <Editor
            spellCheck
            placeholder={'Enter some text...'}
            schema={schema}
            state={this.state.state}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
      </div>
    )
  }

}

/**
 * Export.
 */

export default CheckLists
