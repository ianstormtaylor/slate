import { Editor } from 'slate-react'
import { Value } from 'slate'

import Frame from 'react-frame-component'
import React from 'react'
import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'

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
 * Injector to make `onSelect` work in iframes in React.
 */

import injector from 'react-frame-aware-selection-plugin'

injector()

/**
 * Define the default node type.
 */

const DEFAULT_NODE = 'paragraph'

/**
 * The iframes example.
 *
 * @type {Component}
 */

class Iframes extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = (type) => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
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
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @return {State}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const isActive = this.hasBlock(type)
    change.setBlocks(isActive ? DEFAULT_NODE : type)
    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    const initialContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
          <title>test</title>
          <meta name="description" content="testing">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="author" content="OpenGov">
          <meta name="robots" content="index, follow">
          <link
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossOrigin="anonymous"
          />
        </head>
        <body>
        <div id="wrapper"></div>
          <script>
            (function (ElementProto) {
              if (typeof ElementProto.matches !== 'function') {
                ElementProto.matches = ElementProto.msMatchesSelector ||
                  ElementProto.mozMatchesSelector ||
                  ElementProto.webkitMatchesSelector ||
                  function matches(selector) {
                    var element = this;
                    var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
                    var index = 0;
                    while (elements[index] && elements[index] !== element) {
                      ++index;
                    }
                    return Boolean(elements[index]);
                  };
              }
              if (typeof ElementProto.closest !== 'function') {
                ElementProto.closest = function closest(selector) {
                  var element = this;
                  while (element && element.nodeType === 1) {
                    if (element.matches(selector)) {
                      return element;
                    }
                    element = element.parentNode;
                  }
                  return null;
                };
              }
            })(window.Element.prototype);
          </script>
        </body>
      </html>
    `;

    const style = {
      width: '100%',
      height: '500px'
    }

    return (
      <div>
        <p style={{ marginBottom: '10px' }}>This editor is rendered inside of an <code>iframe</code> element, and everything works as usual! This is helpful for scenarios where you need the content to be rendered in an isolated, for example to create a "live example" with a specific set of stylesheets applied.</p>
        <p style={{ marginBottom: '10px' }}>In this example's case, we've added Bootstrap's CSS to the <code>iframe</code> for default styles:</p>
        <Frame initialContent={initialContent} style={style} mountTarget="#wrapper">
          <div style={{ padding: '20px' }}>
            {this.renderToolbar()}
            {this.renderEditor()}
          </div>
        </Frame>
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {
    return (
      <div className="btn-group" style={{ marginBottom: '20px' }}>
        {this.renderMarkButton('bold', 'bold')}
        {this.renderMarkButton('italic', 'italic')}
        {this.renderMarkButton('highlight', 'pencil')}
        {this.renderBlockButton('heading-two', 'header')}
        {this.renderBlockButton('block-code', 'console')}
        {this.renderBlockButton('block-quote', 'comment')}
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
    const onMouseDown = e => this.onClickMark(e, type)
    let className = 'btn btn-primary'
    if (isActive) className += ' active'

    return (
      <button className={className} onMouseDown={onMouseDown}>
        <span className={`glyphicon glyphicon-${icon}`} />
      </button>
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
    const isActive = this.hasBlock(type)
    const onMouseDown = e => this.onClickBlock(e, type)
    let className = 'btn btn-primary'
    if (isActive) className += ' active'

    return (
      <button className={className} onMouseDown={onMouseDown}>
        <span className={`glyphicon glyphicon-${icon}`} />
      </button>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <Editor
        placeholder={'Enter some rich text...'}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
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
      case 'block-code':
        return <pre><code {...attributes}>{children}</code></pre>
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold':
        return <strong>{children}</strong>
      case 'highlight':
        return <mark>{children}</mark>
      case 'italic':
        return <em>{children}</em>
    }
  }

}

export default Iframes
