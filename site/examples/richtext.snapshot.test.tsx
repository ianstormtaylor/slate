/** @jsx jsx */

import { assertOutput, buildTestHarness } from 'slate-test-utils'
import RichTextEditor from './richtext'
import { jsx } from '../test-utils'
import { fireEvent } from '@testing-library/dom'

it('snapshot = user triggers bold hotkey and types with a collapsed selection', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          potato
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [
    ,
    { triggerKeyboardEvent, type },
    { container },
  ] = await buildTestHarness(RichTextEditor)({
    editor: input,
  })

  await triggerKeyboardEvent('mod+b')
  await type(' cucumbers')

  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    class="css-1rh39ed"
  >
    <span
      class="css-vbnk1l"
      data-active="true"
      data-testid="bold"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_bold
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="italic"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_italic
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="underline"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_underlined
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="code"
    >
      <span
        class="material-icons css-kxb41r"
      >
        code
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="heading-one"
    >
      <span
        class="material-icons css-kxb41r"
      >
        looks_one
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="heading-two"
    >
      <span
        class="material-icons css-kxb41r"
      >
        looks_two
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="block-quote"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_quote
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="numbered-list"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_list_numbered
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="bulleted-list"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_list_bulleted
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="left"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_align_left
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="center"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_align_center
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="right"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_align_right
      </span>
    </span>
    <span
      class="css-1vdn1ty"
      data-active="false"
      data-testid="justify"
    >
      <span
        class="material-icons css-kxb41r"
      >
        format_align_justify
      </span>
    </span>
  </div>
  <div
    contenteditable="true"
    data-slate-editor="true"
    data-slate-node="value"
    data-testid="slate-content-editable"
    role="textbox"
    spellcheck="true"
    style="position: relative; outline: none; white-space: pre-wrap; word-wrap: break-word;"
    zindex="-1"
  >
    <p
      data-slate-node="element"
    >
      <span
        data-slate-node="text"
      >
        <span
          data-slate-leaf="true"
        >
          <span
            data-slate-string="true"
          >
            potato
          </span>
        </span>
      </span>
      <span
        data-slate-node="text"
      >
        <span
          data-slate-leaf="true"
        >
          <strong>
            <span
              data-slate-string="true"
            >
               cucumbers
            </span>
          </strong>
        </span>
      </span>
    </p>
  </div>
</div>
`)
})
