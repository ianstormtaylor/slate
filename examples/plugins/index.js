import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import React from 'react'
import CollapseOnEscape from 'slate-collapse-on-escape'
import SoftBreak from 'slate-soft-break'

/**
 * A simple word count plugin.
 *
 * @param {Object} options
 * @return {Object}
 */

function WordCount(options) {
  return {
    renderEditor(props) {
      return (
        <div>
          <div>{props.children}</div>
          <span className="word-counter">
            Word Count: {props.value.document.text.split(' ').length}
          </span>
        </div>
      )
    },
  }
}

/**
 * Plugins.
 */

const plugins = [CollapseOnEscape(), SoftBreak(), WordCount()]

/**
 * The plugins example.
 *
 * @type {Component}
 */

class Plugins extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Plain.deserialize(`This example shows how you can extend Slate with plugins! It uses four fairly simple plugins, but you can use any plugins you want, or write your own!
The first is a simple plugin to collapse the selection whenever the escape key is pressed. Try selecting some text and pressing escape.
The second is another simple plugin that inserts a "soft" break when enter is pressed instead of creating a new block. Try pressing enter!
The third is an example of using the plugin.render property to create a higher-order-component.`),
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
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

/**
 * Export.
 */

export default Plugins
