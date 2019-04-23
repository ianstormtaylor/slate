import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import styled from 'react-emotion'
import { Link, Redirect } from 'react-router-dom'
import splitJoin from './split-join.js'
import insert from './insert.js'
import special from './special.js'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Icon, Toolbar } from '../components'
import { ANDROID_API_VERSION } from 'slate-dev-environment'

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Some styled components.
 *
 * @type {Component}
 */

const Instruction = styled('div')`
  white-space: pre-wrap;
  margin: -1em -1em 1em;
  padding: 0.5em;
  background: #eee;
`

const Tabs = styled('div')`
  margin-bottom: 0.5em;
`

const TabLink = ({ active, ...props }) => <Link {...props} />

const Tab = styled(TabLink)`
  display: inline-block;
  text-decoration: none;
  color: black;
  background: ${p => (p.active ? '#AAA' : '#DDD')};
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  margin-right: 0.25em;
`

const Version = styled('div')`
  float: right;
  padding: 0.5em;
  font-size: 75%;
  color: #808080;
`

const EditorText = styled('div')`
  color: #808080;
  background: #f0f0f0;
  font: 12px monospace;
  white-space: pre-wrap;
  margin: 1em -1em;
  padding: 0.5em;
  div {
    margin: 0 0 0.5em;
  }
`

const EditorTextCaption = styled('div')`
  color: white;
  background: #808080;
  padding: 0.5em;
`

/**
 * Extract lines of text from `Value`
 *
 * @return {String[]}
 */

function getTextLines(value) {
  return value.document.nodes.map(node => node.text).toArray()
}

/**
 * Subpages which are each a smoke test.
 *
 * @type {Array}
 */

const SUBPAGES = [
  ['Split/Join', splitJoin, 'split-join'],
  ['Insertion', insert, 'insert'],
  ['Special', special, 'special'],
]

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * The rich text example.
 *
 * @type {Component}
 */

class RichTextExample extends React.Component {
  state = {}

  /**
   * Select and deserialize the initial editor value.
   *
   * @param  {Object} nextProps
   * @param  {Object} prevState
   * @return {Object}
   */

  static getDerivedStateFromProps(nextProps, prevState) {
    const { subpage } = nextProps.params
    if (subpage === prevState.subpage) return null
    const found = SUBPAGES.find(
      ([name, value, iSubpage]) => iSubpage === subpage
    )
    if (found == null) return {}
    const { text, document } = found[1]
    return {
      subpage,
      text,
      value: Value.fromJSON({ document }),
    }
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
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
   * Render.
   *
   * @return {Element}
   */

  render() {
    const { text } = this.state
    if (text == null) return <Redirect to="/composition/split-join" />
    const textLines = getTextLines(this.state.value)
    return (
      <div>
        <Instruction>
          <Tabs>
            {SUBPAGES.map(([name, Component, subpage]) => {
              const active = subpage === this.props.params.subpage
              return (
                <Tab
                  key={subpage}
                  to={`/composition/${subpage}`}
                  active={active}
                >
                  {name}
                </Tab>
              )
            })}
            <Version>
              {ANDROID_API_VERSION
                ? `Android API ${ANDROID_API_VERSION}`
                : null}
            </Version>
          </Tabs>
          <div>{this.state.text}</div>
        </Instruction>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
        <EditorText>
          <EditorTextCaption>Text in Slate's `Value`</EditorTextCaption>
          {textLines.map((line, index) => (
            <div key={index}>{line.length > 0 ? line : ' '}</div>
          ))}
        </EditorText>
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
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
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
}

/**
 * Export.
 */

export default RichTextExample
