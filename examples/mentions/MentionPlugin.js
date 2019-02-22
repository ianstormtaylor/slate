import React, { Fragment } from 'react'

/**
 * @param {Object} options
 *   @param {RegExp} options.captureRegex
 *     Regex used to capture the input. The first capture group will be
 *     considered the "input" for search queries. It will be executed using the
 *     string preceeding the current selection.
 *
 *   @param {String} options.captureMarkType
 *     The type of the mark applied to the text captured with `captureRegex`.
 *     This is a decoration, and it's rendering must be handled by the creator
 *     of this plugin.
 *
 *   @param {Function} options.onItemSelected
 *     Called after an item has been selected. The callee should use the
 *     `editor` to delete the captured value and insert their mention node,
 *     whatever that may be. Will receive the following arguments:
 *
 *     -   editor (Slate.Editor)
 *
 *         The current editor with the removal of the context already queued.
 *
 *     -   item (Mixed)
 *
 *         The item that was selected.
 *
 *     -   inputValue (String)
 *
 *         The value that was captured with `captureRegex`
 *
 *   @param {Component} options.SuggestionComponent
 *     A component for rendering suggestions. This component needs to handle the
 *     following props:
 *
 *     -   isDisabled (Boolean)
 *
 *         `true` if the suggestions shouldn't be displayed.
 *
 *     -   onItemSelected (Function)
 *
 *         Method that should be called when an item has been selected. It
 *         accepts the following arguments:
 *
 *         -   item (Mixed)
 *
 *             The item that has been selected.
 *
 *     The component must also provide the following instance methods:
 *
 *     -   updateInputValue (Function)
 *
 *         Called when the input value changes. Accepts the following arguments:
 *
 *         -   inputValue (String)
 *
 *         The latest input value.
 *
 *     -   onKeyDown(Function)
 *
 *         Called when an onKeyDown event is detected, and the context is
 *         active. It should return a truthy value if the event was handled.
 *         Accepts the following arguments:
 *
 *         -   event (Event)
 *
 *             The event that occured.
 *
 *         -   editor (Slate.Editor)
 *
 *             The current editor.
 *
 * @returns {Object}
 *   The plugin object to add to the editor.
 */

export default function MentionPlugin({
  captureRegex,
  contextMarkType,
  onItemSelected,
  SuggestionComponent,
}) {
  const portalRef = React.createRef()

  function handleItemSelected(editor, item) {
    const inputValue = getInput(editor.value)

    return editor.command(onItemSelected, item, inputValue)
  }

  function getInput(value) {
    const { startText } = value

    // In some cases, like if the node that was selected gets deleted,
    // `startText` can be null.
    if (!startText) {
      return null
    }

    const startOffset = value.selection.start.offset
    const textBefore = startText.text.slice(0, startOffset)
    const result = captureRegex.exec(textBefore)

    return result === null ? null : result[1]
  }

  let lastInputValue = null

  function onChange(editor, next) {
    const inputValue = getInput(editor.value)

    if (inputValue !== lastInputValue) {
      const { selection } = editor.value

      lastInputValue = inputValue

      let decorations = editor.value.decorations.filter(
        value => value.mark.type !== contextMarkType
      )

      if (inputValue && hasValidAncestors(editor.value)) {
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
            type: contextMarkType,
          },
        })
      }

      // Making changes within an onChange handler is a little bit of an
      // anti-pattern since making a change could leave the change flow in an
      // odd state. To work around this, we use a setTimeout and queue a change
      // with the editor controller after the current change is flushed.
      setTimeout(() =>
        editor.withoutSaving(() => {
          editor.setDecorations(decorations)
        })
      )

      // This is a bit awkward, but we need to tell the suggestions component
      // what the new value is, so that is can update itself and search for new
      // results. It turns out that proxying in the Suggestions this way is
      // easier than trying to call outside of the plugin to the parent
      // component and pass data back through.
      if (hasValidAncestors(editor.value) && portalRef.current) {
        portalRef.current.updateInputValue(inputValue)
      }
    }

    return next()
  }

  function onKeyDown(event, editor, next) {
    // We need to proxy key events through the suggestions component because it
    // is a sibling to input element and can't listen to key events on its own.
    const isHandled =
      portalRef.current && portalRef.current.onKeyDown(event, editor)

    if (isHandled) {
      return true
    } else {
      return next()
    }
  }

  function renderEditor(props, _, next) {
    const children = next()

    return (
      <Fragment>
        {children}
        <SuggestionComponent
          isDisabled={
            !getInput(props.editor.value) ||
            !hasValidAncestors(props.editor.value)
          }
          onItemSelected={(item, editor) => {
            if (editor) {
              editor.command(handleItemSelected, item)
            } else {
              props.editor.command(handleItemSelected, item)
            }
          }}
          ref={portalRef}
        />
      </Fragment>
    )
  }

  return {
    onChange,
    onKeyDown,
    renderEditor,
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
