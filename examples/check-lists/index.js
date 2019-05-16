import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { css } from 'emotion'

import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * Check list item.
 *
 * @type {Component}
 */

class CheckListItem extends React.Component {
  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} event
   */

  onChange = event => {
    const checked = event.target.checked
    const { editor, node } = this.props
    editor.setNodeByKey(node.key, { data: { checked } })
  }

  /**
   * Render a check list item, using `contenteditable="false"` to embed the
   * checkbox right next to the block's text.
   *
   * @return {Element}
   */

  render() {
    const { attributes, children, node, readOnly } = this.props
    const checked = node.data.get('checked')
    return (
      <div
        {...attributes}
        className={css`
          display: flex;
          flex-direction: row;
          align-items: center;

          & + & {
            margin-top: 0;
          }
        `}
      >
        <span
          contentEditable={false}
          className={css`
            margin-right: 0.75em;
          `}
        >
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </span>
        <span
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={css`
            flex: 1;
            opacity: ${checked ? 0.666 : 1};
            text-decoration: ${checked ? 'none' : 'line-through'};

            &:focus {
              outline: none;
            }
          `}
        >
          {children}
        </span>
      </div>
    )
  }
}

/**
 * The rich text example.
 *
 * @type {Component}
 */

class CheckLists extends React.Component {
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <Editor
        spellCheck
        placeholder="Get to work..."
        defaultValue={initialValue}
        onKeyDown={this.onKeyDown}
        renderBlock={this.renderBlock}
      />
    )
  }

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    switch (props.node.type) {
      case 'check-list-item':
        return <CheckListItem {...props} />
      default:
        return next()
    }
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
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onKeyDown = (event, editor, next) => {
    const { value } = editor

    if (event.key === 'Enter' && value.startBlock.type === 'check-list-item') {
      editor.splitBlock().setBlocks({ data: { checked: false } })
      return
    }

    if (
      event.key === 'Backspace' &&
      value.isCollapsed &&
      value.startBlock.type === 'check-list-item' &&
      value.selection.startOffset === 0
    ) {
      editor.setBlocks('paragraph')
      return
    }

    next()
  }
}

/**
 * Export.
 */

export default CheckLists
