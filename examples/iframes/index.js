
import { Editor, Raw } from '../..'
import Frame from 'react-frame-component'
import React from 'react'
import initialState from './state.json'

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
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'block-code': props => <pre><code {...props.attributes}>{props.children}</code></pre>,
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'paragraph': props => <p {...props.attributes}>{props.children}</p>,
  },
  marks: {
    bold: props => <strong>{props.children}</strong>,
    highlight: props => <mark>{props.children}</mark>,
    italic: props => <em>{props.children}</em>,
  }
}

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
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { state } = this.state
    return state.marks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = (type) => {
    const { state } = this.state
    return state.blocks.some(node => node.type == type)
  }

  /**
   * On change, save the new state.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown = (e, data, state) => {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      default:
        return
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply()

    e.preventDefault()
    return state
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark = (e, type) => {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .toggleMark(type)
      .apply()

    this.setState({ state })
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickBlock = (e, type) => {
    e.preventDefault()
    let { state } = this.state
    const isActive = this.hasBlock(type)

    state = state
      .transform()
      .setBlock(isActive ? DEFAULT_NODE : type)
      .apply()

    this.setState({ state })
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    const bootstrap = (
      <link
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossOrigin="anonymous"
      />
    )

    const style = {
      width: '100%',
      height: '500px'
    }

    return (
      <div>
        <p style={{ marginBottom: '10px' }}>This editor is rendered inside of an <code>iframe</code> element, and everything works as usual! This is helpful for scenarios where you need the content to be rendered in an isolated, for example to create a "live example" with a specific set of stylesheets applied.</p>
        <p style={{ marginBottom: '10px' }}>In this example's case, we've added Bootstrap's CSS to the <code>iframe</code> for default styles:</p>
        <Frame head={bootstrap} style={style}>
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
        schema={schema}
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}

export default Iframes
