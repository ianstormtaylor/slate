import React, { useEffect, useRef } from 'react'
import { Editor, Element, NodeEntry, Node, Range, Text } from 'slate'

import useChildren from '../hooks/use-children'
import { useInputReconciler } from '../hooks/input-reconciler'
import { HAS_BEFORE_INPUT_SUPPORT } from '../utils/environment'
import { ReadOnlyContext } from '../hooks/use-read-only'
import { useSlate } from '../hooks/use-slate'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { DecorateContext } from '../hooks/use-decorate'
import { getDefaultView } from '../utils/dom'

import {
  EDITOR_TO_ELEMENT,
  ELEMENT_TO_NODE,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  PLACEHOLDER_SYMBOL,
  EDITOR_TO_WINDOW,
} from '../utils/weak-maps'

/**
 * `RenderElementProps` are passed to the `renderElement` handler.
 */

export interface RenderElementProps {
  children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}

/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */

export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
}

/**
 * `EditableProps` are passed to the `<Editable>` component.
 */

export type EditableProps = {
  decorate?: (entry: NodeEntry) => Range[]
  onDOMBeforeInput?: (event: InputEvent) => void
  placeholder?: string
  readOnly?: boolean
  role?: string
  style?: React.CSSProperties
  renderElement?: (props: RenderElementProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element
  as?: React.ElementType
} & React.TextareaHTMLAttributes<HTMLDivElement>

/**
 * Editable.
 */

export const Editable = (props: EditableProps) => {
  const {
    decorate = defaultDecorate,
    placeholder,
    readOnly = false,
    renderElement,
    renderLeaf,
    renderPlaceholder = props => <DefaultPlaceholder {...props} />,
    style = {},
    as: Component = 'div',
    ...attributes
  } = props
  const {
    onDOMBeforeInput: _onDOMBeforeInput,
    autoFocus: _autoFocus,
    ...passThroughAttributes
  } = attributes
  const editor = useSlate()
  const ref = useRef<HTMLDivElement>(null)

  // Update internal state on each render.
  IS_READ_ONLY.set(editor, readOnly)

  // Update element-related weak maps with the DOM element ref.
  useIsomorphicLayoutEffect(() => {
    let window

    if (ref.current && (window = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window)
      EDITOR_TO_ELEMENT.set(editor, ref.current)
      NODE_TO_ELEMENT.set(editor, ref.current)
      ELEMENT_TO_NODE.set(ref.current, editor)
    } else {
      NODE_TO_ELEMENT.delete(editor)
    }
  })

  const decorations = decorate([editor, []])

  if (
    placeholder &&
    editor.children.length === 1 &&
    Array.from(Node.texts(editor)).length === 1 &&
    Node.string(editor) === ''
  ) {
    const start = Editor.start(editor, [])
    decorations.push({
      [PLACEHOLDER_SYMBOL]: true,
      placeholder,
      anchor: start,
      focus: start,
    })
  }

  const { handlers } = useInputReconciler({
    attributes,
    nodeRef: ref,
    readOnly,
  })

  return (
    <ReadOnlyContext.Provider value={readOnly}>
      <DecorateContext.Provider value={decorate}>
        <Component
          // COMPAT: The Grammarly Chrome extension works by changing the DOM
          // out from under `contenteditable` elements, which leads to weird
          // behaviors so we have to disable it like editor. (2017/04/24)
          data-gramm={false}
          role={readOnly ? undefined : 'textbox'}
          {...passThroughAttributes}
          // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
          // have to use hacks to make these replacement-based features work.
          spellCheck={!HAS_BEFORE_INPUT_SUPPORT ? false : attributes.spellCheck}
          autoCorrect={
            !HAS_BEFORE_INPUT_SUPPORT ? false : attributes.autoCorrect
          }
          autoCapitalize={
            !HAS_BEFORE_INPUT_SUPPORT ? false : attributes.autoCapitalize
          }
          data-slate-editor
          data-slate-node="value"
          contentEditable={readOnly ? undefined : true}
          suppressContentEditableWarning
          ref={ref}
          style={{
            // Allow positioning relative to the editable element.
            position: 'relative',
            // Prevent the default outline styles.
            outline: 'none',
            // Preserve adjacent whitespace and new lines.
            whiteSpace: 'pre-wrap',
            // Allow words to break if they are too long.
            wordWrap: 'break-word',
            // Allow for passed-in styles to override anything.
            ...style,
          }}
          {...handlers}
        >
          {useChildren({
            decorations,
            node: editor,
            renderElement,
            renderPlaceholder,
            renderLeaf,
            selection: editor.selection,
          })}
        </Component>
      </DecorateContext.Provider>
    </ReadOnlyContext.Provider>
  )
}

/**
 * The props that get passed to renderPlaceholder
 */
export type RenderPlaceholderProps = {
  children: any
  attributes: {
    'data-slate-placeholder': boolean
    dir?: 'rtl'
    contentEditable: boolean
    ref: React.RefObject<any>
    style: React.CSSProperties
  }
}

/**
 * The default placeholder element
 */

export const DefaultPlaceholder = ({
  attributes,
  children,
}: RenderPlaceholderProps) => <span {...attributes}>{children}</span>

/**
 * A default memoized decorate function.
 */

const defaultDecorate: (entry: NodeEntry) => Range[] = () => []
