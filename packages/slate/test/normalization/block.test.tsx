/** @jsx jsx */
import { Editor, Element, Transforms } from 'slate'
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('block', () => {
  test('block-insert-custom-block', () => {
    const input = (
      <editor>
        <element type="body" />
      </editor>
    )

    // patch in a custom normalizer that inserts empty paragraphs in the body instead of text nodes
    // this test also verifies the new node itself is also normalized, because it's inserting a non-normalized node
    const _editor = (input as unknown) as Editor
    const defaultNormalize = _editor.normalizeNode
    _editor.normalizeNode = entry => {
      const [node, path] = entry
      if (
        Element.isElement(node) &&
        node.children.length === 0 &&
        (node as any).type === 'body'
      ) {
        const child = { type: 'paragraph', children: [] }
        Transforms.insertNodes(_editor, child, {
          at: path.concat(0),
          voids: true,
        })
      } else {
        defaultNormalize(entry)
      }
    }

    const output = (
      <editor>
        <element type="body">
          <element type="paragraph">
            <text />
          </element>
        </element>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('block-insert-text', () => {
    const input = (
      <editor>
        <block />
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('block-remove-block', () => {
    const input = (
      <editor>
        <block>
          <text>one</text>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <text>one</text>
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('block-remove-inline', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
          <inline>two</inline>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>one</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
