import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import React from 'react'
import CollapseOnEscape from './collapse-on-escape'
import SoftBreak from './soft-break'
import WordCount from './word-count'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Plain.deserialize(`This example shows how you can extend Slate with plugins! It uses four fairly simple plugins, but you can use any plugins you want, or write your own!
The first is a simple plugin to collapse the selection whenever the escape key is pressed. Try selecting some text and pressing escape.
The second is another simple plugin that inserts a "soft" break when enter is pressed instead of creating a new block. Try pressing enter!
The third is an example of using the plugin.render property to create a higher-order-component.`)

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
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some text..."
        plugins={plugins}
        defaultValue={initialValue}
      />
    )
  }
}

/**
 * Export.
 */

export default Plugins
