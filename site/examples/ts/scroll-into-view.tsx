import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
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
  return (
    <div
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
        className={css`
          height: 320px;
          overflow-y: scroll;
        `}
      >
        <PlainTextEditor />
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

const PlainTextEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable placeholder="Enter some plain text..." />
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
