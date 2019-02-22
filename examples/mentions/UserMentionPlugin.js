import { Text } from 'slate'
import React from 'react'

import MentionPlugin from './MentionPlugin'
import UserMentionSuggestions from './UserMentionSuggestions'

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

/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */

const CAPTURE_REGEX = /@(\S*)$/

export default function UserMentionPlugin() {
  function handleItemSelected(editor, item, inputValue) {
    // Delete the captured value, including the `@` symbol
    editor = editor.deleteBackward(inputValue.length + 1)

    const selectedRange = editor.value.selection

    // Add a space so that the user ends up with the selection
    // focused one space after the mention.
    editor
      .insertText(' ')
      .insertInlineAtRange(selectedRange, {
        data: {
          userId: item.id,
          username: item.username,
        },
        nodes: [Text.create(`@${item.username}`)],
        type: USER_MENTION_NODE_TYPE,
      })
      .focus()
  }

  return [
    MentionPlugin({
      captureRegex: CAPTURE_REGEX,
      contextMarkType: CONTEXT_MARK_TYPE,
      onItemSelected: handleItemSelected,
      SuggestionComponent: UserMentionSuggestions,
    }),
    {
      renderMark(props, editor, next) {
        if (props.mark.type === CONTEXT_MARK_TYPE) {
          return (
            // Adding the className here is important so that the
            // `UserMentionSuggestions` component can find it to use as an
            // anchor for absolute positioning.
            <span {...props.attributes} className="user-mention-context">
              {props.children}
            </span>
          )
        }

        return next()
      },
      renderNode(props, editor, next) {
        const { attributes, node } = props

        if (node.type === USER_MENTION_NODE_TYPE) {
          // This is where you could turn the mention into a link to the user's
          // profile or something.
          return <b {...attributes}>{props.node.text}</b>
        }

        return next()
      },
      schema: {
        inlines: {
          [USER_MENTION_NODE_TYPE]: {
            // It's important that we mark the mentions as void nodes so that
            // users can't edit the text of the mention.
            isVoid: true,
          },
        },
      },
    },
  ]
}
