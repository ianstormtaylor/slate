
import { Editor, Plain } from '../..'
import React from 'react'
import AutoReplaceText from 'slate-auto-replace-text'
import CollapseOnEscape from 'slate-collapse-on-escape'
import SoftBreak from 'slate-soft-break'

/**
 * Word Count plugin
 *
 * Example of using plugin.render to create a HOC
 * https://docs.slatejs.org/reference/plugins/plugin.html#render
 */

function WordCount(options) {
  return {
    render(props) {
      return (
        <div>
          <div>
            {props.children}
          </div>
          <span className="word-counter">
            Word Count: {props.state.document.text.split(' ').length}
          </span>
        </div>
      )
    }
  }
}


/**
 * Plugins.
 */

const plugins = [
  AutoReplaceText('(c)', '©'),
  AutoReplaceText('(r)', '®'),
  AutoReplaceText('(tm)', '™'),
  CollapseOnEscape(),
  SoftBreak(),
  WordCount()
]

/**
 * The plugins example.
 *
 * @type {Component}
 */

class Plugins extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Plain.deserialize(`This example shows how you can extend Slate with plugins! It uses four fairly simple plugins, but you can use any plugins you want, or write your own!

The first is an "auto replacer". Try typing "(c)" and you'll see it turn into a copyright symbol automatically!

The second is a simple plugin to collapse the selection whenever the escape key is pressed. Try selecting some text and pressing escape.

The third is another simple plugin that inserts a "soft" break when enter is pressed instead of creating a new block. Try pressing enter!

The fourth is an example of using the plugin.render property to create a higher-order-component.`)
  };

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder={'Enter some text...'}
        plugins={plugins}
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}

/**
 * Export.
 */

export default Plugins
