import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'

/**
 * The auto-markdown example.
 *
 * @type {Component}
 */

class MarkdownShortcuts extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Get the block type for a series of auto-markdown shortcut `chars`.
   *
   * @param {String} chars
   * @return {String} block
   */

  getType = chars => {
    switch (chars) {
      case '*':
      case '-':
      case '+':
        return 'list-item'
      case '>':
        return 'block-quote'
      case '#':
        return 'heading-one'
      case '##':
        return 'heading-two'
      case '###':
        return 'heading-three'
      case '####':
        return 'heading-four'
      case '#####':
        return 'heading-five'
      case '######':
        return 'heading-six'
      default:
        return null
    }
  }

  /**
   *
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Write some markdown..."
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'heading-three':
        return <h3 {...attributes}>{children}</h3>
      case 'heading-four':
        return <h4 {...attributes}>{children}</h4>
      case 'heading-five':
        return <h5 {...attributes}>{children}</h5>
      case 'heading-six':
        return <h6 {...attributes}>{children}</h6>
      case 'list-item':
        return <li {...attributes}>{children}</li>
    }
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onKeyDown = (event, change) => {
    switch (event.key) {
      case ' ':
        return this.onSpace(event, change)
      case 'Backspace':
        return this.onBackspace(event, change)
      case 'Enter':
        return this.onEnter(event, change)
    }
  }

  /**
   * On space, if it was after an auto-markdown shortcut, convert the current
   * node into the shortcut's corresponding type.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onSpace = (event, change) => {
    const { value } = change
    const { selection } = value
    if (selection.isExpanded) return

    const { startBlock } = value
    const { start } = selection
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
    const type = this.getType(chars)

    if (!type) return
    if (type == 'list-item' && startBlock.type == 'list-item') return
    event.preventDefault()

    change.setBlocks(type)

    if (type == 'list-item') {
      change.wrapBlock('bulleted-list')
    }

    change.moveFocusToStartOfNode(startBlock).delete()
    return true
  }

  /**
   * On backspace, if at the start of a non-paragraph, convert it back into a
   * paragraph node.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onBackspace = (event, change) => {
    const { value } = change
    const { selection } = value
    if (selection.isExpanded) return
    if (selection.start.offset != 0) return

    const { startBlock } = value
    if (startBlock.type == 'paragraph') return

    event.preventDefault()
    change.setBlocks('paragraph')

    if (startBlock.type == 'list-item') {
      change.unwrapBlock('bulleted-list')
    }

    return true
  }

  /**
   * On return, if at the end of a node type that should not be extended,
   * create a new paragraph below it.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onEnter = (event, change) => {
    const { value } = change
    const { selection } = value
    const { start, end, isExpanded } = selection
    if (isExpanded) return

    const { startBlock } = value
    if (start.offset == 0 && startBlock.text.length == 0)
      return this.onBackspace(event, change)
    if (end.offset != startBlock.text.length) return

    if (
      startBlock.type != 'heading-one' &&
      startBlock.type != 'heading-two' &&
      startBlock.type != 'heading-three' &&
      startBlock.type != 'heading-four' &&
      startBlock.type != 'heading-five' &&
      startBlock.type != 'heading-six' &&
      startBlock.type != 'block-quote'
    ) {
      return
    }

    event.preventDefault()
    change.splitBlock().setBlocks('paragraph')
    return true
  }
}

/**
 * Export.
 */

export default MarkdownShortcuts
