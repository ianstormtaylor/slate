/*
This example is intended to be a super basic mentions implementation that
people can work off of. What is show here is how to detect when a user starts
typing a mention, making a search query, and then inserting a mention when
the user selects an item. There are a few improvements that can be made in a
production implementation:

1. Serialization - in an actual implementation, you will probably want to
   serialize the mentions out in a manner that your DB can parse, in order
   to send notifications on the back end.
2. Anchored suggestion list - You can see how to do something like this in
   the `hovering-menu` example.
3. Linkifying the mentions - There isn't really a good place to link to for
   this example. But in most cases you would probably want to link to the
   user's profile on click.

The list of characters was extracted from this list on Wikipedia:
https://en.wikipedia.org/wiki/List_of_Star_Wars_characters
*/

import { Editor } from 'slate-react'
import { Value } from 'slate'
import _ from 'lodash'
import React from 'react'
import styled from 'react-emotion'

import initialValue from './value.json'
import users from './users.json'

const SuggestionContainer = styled('div')`
  border-top: 2px solid #eee;
  position: relative;
  padding: 0 20px;
  margin: 0 -20px;
  margin-top: 20px;
`

const SuggestionList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`

const Suggestion = styled('li')`
  height: 32px;

  &:hover {
    background: #87cefa;
  }
`

const USER_MENTION_TYPE = 'userMention'

const schema = {
  inlines: {
    [USER_MENTION_TYPE]: {
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
          schema={schema}
        />
        <SuggestionContainer>
          <h2>Select a user</h2>
          <SuggestionList>
            {this.state.users.map(user => {
              return (
                <Suggestion
                  key={user.id}
                  onClick={() => this.insertMention(user)}
                >
                  {user.username}
                </Suggestion>
              )
            })}
          </SuggestionList>
        </SuggestionContainer>
      </div>
    )
  }

  renderNode = props => {
    const { attributes, node } = props

    if (node.type === USER_MENTION_TYPE) {
      // This is where you could turn the mention into a link to the user's
      // profile or something.
      return <b {...attributes}>{props.node.text}</b>
    }
  }

  insertMention(user) {
    const value = this.state.value
    const inputValue = getInput(value)

    // Delete the captured value, including the `@` symbol
    this.editorRef.current.change(change => {
      change = change.deleteBackward(inputValue.length + 1)

      const selectedRange = change.value.selection

      change
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
          type: USER_MENTION_TYPE,
        })
        .focus()

      this.setState({
        value: change.value,
      })
    })
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    const inputValue = getInput(value)

    if (inputValue !== this.lastInputValue && hasValidAncestors(value)) {
      this.lastInputValue = inputValue
      this.search(inputValue)
    }

    this.setState({ value })
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
        users: result,
      })
    }, 50)
  }
}

/**
 * Determine if the current selection has valid ancestors for a context.
 *
 * @type {Value}
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

/**
 * Export.
 */

export default MentionsExample
