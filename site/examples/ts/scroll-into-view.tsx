import React, { useMemo, useRef } from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { Slate, Editable, ReactEditor, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'
import range from 'lodash/range'

/**
 * This is an example we can use to test the scrollIntoView functionality in
 * `Editable`. Keeping it here for now as we may need it to make sure it is
 * working properly after adding it.
 *
 * If all is good, we can remove this example.
 *
 * Note:
 * The example needs to be added to `[example].tsx` before it can be used.
 */

const ScrollIntoViewExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const innerRef = useRef<HTMLDivElement | null>(null)

  const scrollCurrentSelectionIntoView = () => {
    const container = innerRef.current
    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    const node = range?.endContainer
    const target =
      node?.nodeType === Node.ELEMENT_NODE
        ? (node as HTMLElement)
        : node?.parentElement

    if (!container || !target) {
      return
    }

    const targetRect = target.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const deltaTop = targetRect.top - containerRect.top - 24
    const deltaBottom = targetRect.bottom - containerRect.bottom + 24

    if (deltaTop < 0) {
      container.scrollTop += deltaTop
    } else if (deltaBottom > 0) {
      container.scrollTop += deltaBottom
    }
  }

  return (
    <div
      data-test-id="scroll-outer"
      className={css`
        height: 320px;
        overflow-y: scroll;
      `}
    >
      <div
        className={css`
          height: 160px;
          background: #e0e0e0;
        `}
      />
      <div
        data-test-id="scroll-inner"
        ref={innerRef}
        className={css`
          height: 320px;
          overflow-y: scroll;
        `}
      >
        <button
          data-test-id="scroll-to-bottom-selection"
          onMouseDown={event => event.preventDefault()}
          onClick={() => {
            Transforms.select(editor, {
              anchor: { path: [4, 0], offset: 0 },
              focus: { path: [4, 0], offset: 30 },
            })
            ReactEditor.focus(editor)
            requestAnimationFrame(() => {
              scrollCurrentSelectionIntoView()
            })
          }}
          type="button"
        >
          Select bottom paragraph
        </button>
        <PlainTextEditor
          editor={editor}
          innerRef={innerRef}
          scrollCurrentSelectionIntoView={scrollCurrentSelectionIntoView}
        />
      </div>
      <div
        className={css`
          height: 160px;
          background: #e0e0e0;
        `}
      />
    </div>
  )
}

const PlainTextEditor = ({
  editor,
  innerRef,
  scrollCurrentSelectionIntoView,
}: {
  editor: ReturnType<typeof createEditor>
  innerRef: React.MutableRefObject<HTMLDivElement | null>
  scrollCurrentSelectionIntoView: () => void
}) => {
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        placeholder="Enter some plain text..."
        scrollSelectionIntoView={(_editor, domRange) => {
          void domRange
          void innerRef
          scrollCurrentSelectionIntoView()
        }}
      />
    </Slate>
  )
}

const initialValue: Descendant[] = range(5).map(() => ({
  type: 'paragraph',
  children: [
    {
      text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`,
    },
  ],
}))

export default ScrollIntoViewExample
