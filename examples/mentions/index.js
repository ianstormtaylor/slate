/*
This example is generally written as if it were in a production app, with a few
notes indicating where you would want to add business logic.

Note: this example has some rather complicated internal interfaces and it should
not be copy pasted directly into your application. Please use it as a guide and
learn from it instead.

Component overview:

- `<MentionPlugin>` is the core plugin that defines how mentions should be handled
  in slate. It is designed in such a way that you can have multiple instances of
  it in the same editor, like for user mentions and hashtags.

- `<UserMentionPlugin>` is the higher level plugin that defines the business logic
  for the mentions implementation like schema restrictions and how the mentions
  themselves should be rendered. It also provides the `<UserMentionSuggestions>`
  component.

- `<UserMentionSuggestions>` encapsulates business logic around searching for
  suggestions and for handling selection, both with mouse and keybaord.

There are a few improvements that can be made in a production implementation:

1. Serialization - in an actual implementation, you will probably want to
   serialize the mentions out in a manner that your DB can parse, in order
   to send notifications on the back end.

2. Linkifying the mentions - There isn't really a good place to link to for
   this example. But in most cases you would probably want to navigate to the
   user's profile on click.

The list of characters was extracted from Wikipedia:
https://en.wikipedia.org/wiki/List_of_Star_Wars_characters
*/

import { Editor } from 'slate-react'
import { Value } from 'slate'
import React from 'react'

import initialValue from './value.json'
import UserMentionPlugin from './UserMentionPlugin'

/**
 * @extends React.Component
 */

class MentionsExample extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    plugins: [...UserMentionPlugin()],
    users: [],
    value: Value.fromJSON(initialValue),
  }

  render() {
    return (
      <Editor
        spellCheck
        autoFocus
        placeholder="Try mentioning some people..."
        plugins={this.state.plugins}
        value={this.state.value}
        onChange={({ value }) => this.setState({ value })}
      />
    )
  }
}

export default MentionsExample
