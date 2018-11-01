/*
This example is intended to be a super basic mentions implementation that
people can work off of. What is show here is how to detect when a user starts
typing a mention, making a search query, and then inserting a mention when
the user selects an item. There are a few improvements that can be made in a
production implementation:

1. Serialization - in an actual implementation, you will probably want to
   serialize the mentions out in a manner that your DB can parse, in order
   to send notifications on the back end.
2. Linkifying the mentions - There isn't really a good place to link to for
   this example. But in most cases you would probably want to link to the
   user's profile on click.
3. Keyboard accessibility - it adds quite a bit of complexity to the
   implementation to add this, as it involves capturing keyboard events like up
   / down / enter and proxying them into the `Suggestions` component using a
   `ref`. I've left this out because this is already a pretty confusing use
   case.
4. Plugin Mentions - in reality, you will probably want to put mentions into a
   plugin, and make them configurable to support more than one kind of mention,
   like users and hashtags. As you can see below it is a bit unweildy to bolt
   all this directly to the editor.

The list of characters was extracted from Wikipedia:
https://en.wikipedia.org/wiki/List_of_Star_Wars_characters
*/

import { Editor } from 'slate-react'
import { Value } from 'slate'
import _ from 'lodash'
import React from 'react'

import initialValue from './value.json'
import users from './users.json'
import Suggestions from './Suggestions'

/**
 * @type {String}
 */

const USER_MENTION_NODE_TYPE = 'userMention'

/**
 * The decoration mark type that the menu will position itself against. The
 * "context" is just the current text after the @ symbol.
 * @type {String}
 */

const CONTEXT_MARK_TYPE = 'mentionContext'

const schema = {
  inlines: {
    [USER_MENTION_NODE_TYPE]: {
      // It's important that we mark the mentions as void nodes so that users
      // can't edit the text of the mention.
      isVoid: true,
    },
  },
}

/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */

const CAPTURE_REGEX = /@(\S*)$/

/**
 * Get get the potential mention input.
 *
 * @type {Value}
 */

function getInput(value) {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return null
  }

  const startOffset = value.selection.start.offset
  const textBefore = value.startText.text.slice(0, startOffset)
  const result = CAPTURE_REGEX.exec(textBefore)

  return result === null ? null : result[1]
}

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
    users: [],
    value: Value.fromJSON(initialValue),
  }

  /**
   * @type {React.RefObject}
   */

  editorRef = React.createRef()

  render() {
    return (
      <div>
        <Editor
          spellCheck
          autoFocus
          placeholder="Try mentioning some people..."
          value={this.state.value}
          onChange={this.onChange}
          ref={this.editorRef}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          schema={schema}
        />
        <Suggestions
          anchor=".mention-context"
          users={this.state.users}
          onSelect={this.insertMention}
        />
      </div>
    )
  }

  renderMark(props, editor, next) {
    if (props.mark.type === CONTEXT_MARK_TYPE) {
      return (
        // Adding the className here is important so taht the `Suggestions`
        // component can find an anchor.
        <span {...props.attributes} className="mention-context">
          {props.children}
        </span>
      )
    }

    return next()
  }

  renderNode(props, editor, next) {
    const { attributes, node } = props

    if (node.type === USER_MENTION_NODE_TYPE) {
      // This is where you could turn the mention into a link to the user's
      // profile or something.
      return <b {...attributes}>{props.node.text}</b>
    }

    return next()
  }

  /**
   * Replaces the current "context" with a user mention node corresponding to
   * the given user.
   * @param {Object} user
   *   @param {string} user.id
   *   @param {string} user.username
   */

  insertMention = user => {
    const value = this.state.value
    const inputValue = getInput(value)
    const editor = this.editorRef.current

    // Delete the captured value, including the `@` symbol
    editor.deleteBackward(inputValue.length + 1)

    const selectedRange = editor.value.selection

    editor
      .insertText(' ')
      .insertInlineAtRange(selectedRange, {
        data: {
          userId: user.id,
          username: user.username,
        },
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: `@${user.username}`,
              },
            ],
          },
        ],
        type: USER_MENTION_NODE_TYPE,
      })
      .focus()
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = change => {
    const inputValue = getInput(change.value)

    if (inputValue !== this.lastInputValue) {
      this.lastInputValue = inputValue

      if (hasValidAncestors(change.value)) {
        this.search(inputValue)
      }

      const { selection } = change.value

      let decorations = change.value.decorations.filter(
        value => value.mark.type !== CONTEXT_MARK_TYPE
      )

      if (inputValue && hasValidAncestors(change.value)) {
        decorations = decorations.push({
          anchor: {
            key: selection.start.key,
            offset: selection.start.offset - inputValue.length,
          },
          focus: {
            key: selection.start.key,
            offset: selection.start.offset,
          },
          mark: {
            type: CONTEXT_MARK_TYPE,
          },
        })
      }

      this.setState({ value: change.value }, () => {
        // We need to set decorations after the value flushes into the editor.
        this.editorRef.current.setDecorations(decorations)
      })
      return
    }

    this.setState({ value: change.value })
  }

  /**
   * Get an array of users that match the given search query
   *
   * @type {String}
   */

  search(searchQuery) {
    // We don't want to show the wrong users for the current search query, so
    // wipe them out.
    this.setState({
      users: [],
    })

    if (!searchQuery) return

    // In order to make this seem like an API call, add a set timeout for some
    // async.
    setTimeout(() => {
      // WARNING: In a production environment you should escape the search query.
      const regex = RegExp(`^${searchQuery}`, 'gi')

      // If you want to get fancy here, you can add some emphasis to the part
      // of the string that matches.
      const result = _.filter(users, user => {
        return user.username.match(regex)
      })

      this.setState({
        // Only return the first 5 results
        users: result.slice(0, 5),
      })
    }, 50)
  }
}

/**
 * Determine if the current selection has valid ancestors for a context. In our
 * case, we want to make sure that the mention is only a direct child of a
 * paragraph. In this simple example it isn't that important, but in a complex
 * editor you wouldn't want it to be a child of another inline like a link.
 *
 * @param {Value} value
 */

function hasValidAncestors(value) {
  const { document, selection } = value

  const invalidParent = document.getClosest(
    selection.start.key,
    // In this simple case, we only want mentions to live inside a paragraph.
    // This check can be adjusted for more complex rich text implementations.
    node => node.type !== 'paragraph'
  )

  return !invalidParent
}

export default MentionsExample
