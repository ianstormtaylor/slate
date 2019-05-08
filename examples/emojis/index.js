import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'
import styled from 'react-emotion'
import { Button, Icon, Toolbar } from '../components'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * A styled emoji inline component.
 *
 * @type {Component}
 */

const Emoji = styled('span')`
  outline: ${props => (props.selected ? '2px solid blue' : 'none')};
`

/**
 * Emojis.
 *
 * @type {Array}
 */

const EMOJIS = [
  '😃',
  '😬',
  '😂',
  '😅',
  '😆',
  '😍',
  '😱',
  '👋',
  '👏',
  '👍',
  '🙌',
  '👌',
  '🙏',
  '👻',
  '🍔',
  '🍑',
  '🔑',
]

/**
 * No ops.
 *
 * @type {Function}
 */

const noop = e => e.preventDefault()

/**
 * The links example.
 *
 * @type {Component}
 */

class Emojis extends React.Component {
  /**
   * The editor's schema.
   *
   * @type {Object}
   */

  schema = {
    inlines: {
      emoji: {
        isVoid: true,
      },
    },
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <div>
        <Toolbar>
          {EMOJIS.map((emoji, i) => (
            <Button key={i} onMouseDown={e => this.onClickEmoji(e, emoji)}>
              <Icon>{emoji}</Icon>
            </Button>
          ))}
        </Toolbar>
        <Editor
          placeholder="Write some 😍👋🎉..."
          ref={this.ref}
          defaultValue={initialValue}
          schema={this.schema}
          renderBlock={this.renderBlock}
          renderInline={this.renderInline}
        />
      </div>
    )
  }

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      default:
        return next()
    }
  }

  /**
   * Render a Slate inline.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderInline = (props, editor, next) => {
    const { attributes, node, isFocused } = props

    switch (node.type) {
      case 'emoji':
        return (
          <Emoji
            {...attributes}
            selected={isFocused}
            contentEditable={false}
            onDrop={noop}
          >
            {node.data.get('code')}
          </Emoji>
        )
      default:
        return next()
    }
  }

  /**
   * When clicking a emoji, insert it
   *
   * @param {Event} e
   */

  onClickEmoji = (e, code) => {
    e.preventDefault()

    this.editor
      .insertInline({ type: 'emoji', data: { code } })
      .moveToStartOfNextText()
      .focus()
  }
}

/**
 * Export.
 */

export default Emojis
