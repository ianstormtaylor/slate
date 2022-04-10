/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import assert from 'assert'
import { Transforms, Text, Editor } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('unsetNodes', () => {
  test('unsetNodes-operation-contents-check', () => {
    const run = (editor: Editor) => {
      Transforms.unsetNodes(editor, 'someKey', { at: [0] })

      // unsetNodes uses null to remove properties, but that should not
      // flow through to the operation
      const [setNode] = editor.operations

      if (setNode.type === 'set_node') {
        assert.deepStrictEqual(setNode, {
          type: 'set_node',
          path: [0],
          properties: { someKey: true },
          newProperties: {},
        })
      } else {
        // eslint-disable-next-line no-console
        console.error('operations:', editor.operations)
        assert.fail('operation was not a set node')
      }
    }
    const input = (
      <editor>
        <block someKey>word</block>
      </editor>
    )
    const output = (
      <editor>
        <block>word</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('unsetNodes-text', () => {
    const run = editor => {
      Transforms.unsetNodes(editor, 'someKey', { match: Text.isText })
    }
    const input = (
      <editor>
        <block>
          <text someKey>
            <cursor />
            word
          </text>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <cursor />
          word
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
