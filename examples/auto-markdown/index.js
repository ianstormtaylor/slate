
import { Editor, Raw } from '../..'
import React from 'react'
import initialState from './state.json'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'block-quote': props => <blockquote>{props.children}</blockquote>,
    'bulleted-list': props => <ul>{props.children}</ul>,
    'heading-one': props => <h1>{props.children}</h1>,
    'heading-two': props => <h2>{props.children}</h2>,
    'heading-three': props => <h3>{props.children}</h3>,
    'heading-four': props => <h4>{props.children}</h4>,
    'heading-five': props => <h5>{props.children}</h5>,
    'heading-six': props => <h6>{props.children}</h6>,
    'list-item': props => <li>{props.children}</li>,
  }
}

/**
 * The auto-markdown example.
 *
 * @type {Component}
 */

class AutoMarkdown extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * Get the block type for a series of auto-markdown shortcut `chars`.
   *
   * @param {String} chars
   * @return {String} block
   */

  getType = (chars) => {
    switch (chars) {
      case '*':
      case '-':
      case '+': return 'list-item'
      case '>': return 'block-quote'
      case '#': return 'heading-one'
      case '##': return 'heading-two'
      case '###': return 'heading-three'
      case '####': return 'heading-four'
      case '#####': return 'heading-five'
      case '######': return 'heading-six'
      default: return null
    }
  }

  /**
   *
   * Render the example.
   *
   * @return {Component} component
   */

  render = () => {
    return (
      <div className="editor">
        <Editor
          schema={schema}
          state={this.state.state}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {Data} data
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown = (e, data, state) => {
    switch (data.key) {
      case 'space': return this.onSpace(e, state)
      case 'backspace': return this.onBackspace(e, state)
      case 'enter': return this.onEnter(e, state)
    }
  }

  /**
   * On space, if it was after an auto-markdown shortcut, convert the current
   * node into the shortcut's corresponding type.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onSpace = (e, state) => {
    if (state.isExpanded) return
    const { startBlock, startOffset } = state
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
    const type = this.getType(chars)

    if (!type) return
    if (type == 'list-item' && startBlock.type == 'list-item') return
    e.preventDefault()

    let transform = state
      .transform()
      .setBlock(type)

    if (type == 'list-item') transform = transform.wrapBlock('bulleted-list')

    state = transform
      .extendToStartOf(startBlock)
      .delete()
      .apply()

    return state
  }

  /**
   * On backspace, if at the start of a non-paragraph, convert it back into a
   * paragraph node.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onBackspace = (e, state) => {
    if (state.isExpanded) return
    if (state.startOffset != 0) return
    const { startBlock } = state

    if (startBlock.type == 'paragraph') return
    e.preventDefault()

    let transform = state
      .transform()
      .setBlock('paragraph')

    if (startBlock.type == 'list-item') transform = transform.unwrapBlock('bulleted-list')

    state = transform.apply()
    return state
  }

  /**
   * On return, if at the end of a node type that should not be extended,
   * create a new paragraph below it.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onEnter = (e, state) => {
    if (state.isExpanded) return
    const { startBlock, startOffset, endOffset } = state
    if (startOffset == 0 && startBlock.length == 0) return this.onBackspace(e, state)
    if (endOffset != startBlock.length) return

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

    e.preventDefault()
    return state
      .transform()
      .splitBlock()
      .setBlock('paragraph')
      .apply()
  }

}

/**
 * Export.
 */

export default AutoMarkdown
