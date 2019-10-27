/*
This example is intended to be a super basic mentions implementation that
people can work off of. What is shown here is how to detect when a user starts
typing a mention, making a search query, and then inserting a mention when
the user selects an item. There are a few improvements that can be made in a
production implementation:

1. Serialization - in an actual implementation, you will probably want to
   serialize the mentions out in a manner that your DB can parse, in order
   to send notifications on the back end.
2. Linkifying the mentions - There isn't really a good place to link to for
   this example. But in most cases you would probably want to link to the
   user's profile on click.
3. Plugin Mentions - in reality, you will probably want to put mentions into a
   plugin, and make them configurable to support more than one kind of mention,
   like users and hashtags. As you can see below it is a bit unweildy to bolt
   all this directly to the editor.

The list of characters was extracted from Wikipedia:
https://en.wikipedia.org/wiki/List_of_Star_Wars_characters
*/

import { Editor } from 'slate-react'
import { Value } from 'slate'
import React from 'react'

import users from './users.json'

/**
 * @typedef {Object} User
 *   @property {string} username
 *   @property {string} id
 */

const initialEditorValue = {
  object: 'value',
  document: {
    object: 'document',
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'Try mentioning some users, like Luke or Leia.',
          },
        ],
      },
    ],
  },
}

/**
 * @type {String}
 */

const USER_MENTION_NODE_TYPE = 'userMention'

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
 * Get the potential mention input.
 *
 * @param {Value} value
 */

function getMentionInput(value) {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return null
  }

  const startOffset = value.selection.start.offset
  const textBefore = value.startText.text.slice(0, startOffset)
  const result = CAPTURE_REGEX.exec(textBefore)

  return result == null ? null : result[1]
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

  // In this simple case, we only want mentions to live inside a paragraph.
  // This check can be adjusted for more complex rich text implementations.
  return document.getParent(selection.start.key).type === 'paragraph'
}

/**
 * Get an array of users that match the given search query
 *
 * @param {string} searchQuery
 *
 * @returns {User[]} array of users matching the `searchQuery`
 */

function searchUsers(searchQuery) {
  if (!searchQuery) return

  const regex = RegExp(`^${searchQuery}`, 'gi')

  return users.filter(({ username }) => username.match(regex))
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
    value: Value.fromJSON(initialEditorValue),
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
          value={this.state.value}
          onChange={this.onChange}
          ref={this.editorRef}
          renderInline={this.renderInline}
          renderBlock={this.renderBlock}
          schema={schema}
        />
      </div>
    )
  }

  renderBlock(props, editor, next) {
    const { attributes, node } = props

    if (node.type === 'paragraph') {
      return <p {...attributes}>{props.children}</p>
    }

    return next()
  }

  renderInline(props, editor, next) {
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
   * @param {User} user
   */

  insertMention(user) {
    const value = this.state.value
    const inputValue = getMentionInput(value)
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
   * On change, save the new `value` and look for mentions.
   *
   * @param {Change} editor
   */

  onChange = change => {
    this.setState({ value: change.value })

    const mentionInputValue = getMentionInput(change.value)

    if (!mentionInputValue || !hasValidAncestors(change.value)) {
      return
    }

    const searchResult = searchUsers(mentionInputValue)

    if (!searchResult.length) {
      return
    }

    if (searchResult.length === 1) {
      this.insertMention(searchResult[0])
    }

    if (searchResult.length <= 5) {
      const username = window.prompt(
        `Type in the rest of the name, or just more of it. You can choose from these: ${searchResult
          .map(u => u.username)
          .join(', ')}`,
        mentionInputValue
      )

      if (
        !username ||
        username === mentionInputValue ||
        !username.startsWith(mentionInputValue)
      ) {
        return
      }

      const nextSearchResult = searchUsers(username)

      if (nextSearchResult.length === 1) {
        this.insertMention(nextSearchResult[0])
      } else {
        this.setState({ value: change.value })
      }
    }
  }
}

export default MentionsExample
