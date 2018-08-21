import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'
import styled from 'react-emotion'
import { Button, Icon, Toolbar } from '../components'

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
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

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
          value={this.state.value}
          schema={this.schema}
          onChange={this.onChange}
          renderNode={this.renderNode}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>
      }
      case 'emoji': {
        const code = node.data.get('code')
        return (
          <Emoji
            {...props.attributes}
            selected={isFocused}
            contentEditable={false}
            onDrop={noop}
          >
            {code}
          </Emoji>
        )
      }
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
   * When clicking a emoji, insert it
   *
   * @param {Event} e
   */

  onClickEmoji = (e, code) => {
    e.preventDefault()
    const { value } = this.state
    const change = value.change()

    change
      .insertInline({
        type: 'emoji',
        data: { code },
      })
      .moveToStartOfNextText()
      .focus()

    this.onChange(change)
  }
}

/**
 * Export.
 */

export default Emojis
