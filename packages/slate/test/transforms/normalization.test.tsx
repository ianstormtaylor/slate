/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import _ from 'lodash'
import { Editor, Transforms, Element } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('normalization', () => {
  test('normalization-move_node', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.moveNodes(editor, { at: [0, 0], to: [1, 0] })
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>onetwo</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('normalization-set_node', () => {
    const input = (
      <editor>
        <block type="body" attr={{ a: true }}>
          one
        </block>
      </editor>
    )

    const _editor = (input as unknown) as Editor
    const defaultNormalize = _editor.normalizeNode
    _editor.normalizeNode = entry => {
      const [node, path] = entry
      if (
        Element.isElement(node) &&
        (node as any).type === 'body' &&
        Editor.string(_editor, path, { voids: true }) === 'one'
      ) {
        Transforms.setNodes(
          _editor,
          { attr: { a: false } },
          { at: path, compare: (p, n) => !_.isEqual(p, n) }
        )
      }

      defaultNormalize(entry)
    }

    const run = editor => {
      Editor.normalize(editor, { force: true })
    }

    const output = (
      <editor>
        <block type="body" attr={{ a: false }}>
          one
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('normalization-split_node-and-insert_node', () => {
    const input = (
      <editor>
        <block>
          <text />
          <inline>one</inline>
          <text />
        </block>
        <block>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Editor.withoutNormalizing(editor, () => {
        const operations = [
          {
            type: 'split_node',
            path: [0, 1],
            position: 0,
            properties: { inline: true },
          },
          {
            type: 'split_node',
            path: [0],
            position: 1,
            properties: {},
          },
          {
            type: 'split_node',
            path: [2, 1, 0],
            position: 0,
            properties: {},
          },
          {
            type: 'split_node',
            path: [2, 1],
            position: 0,
            properties: { inline: true },
          },
          {
            type: 'split_node',
            path: [2],
            position: 1,
            properties: {},
          },
          { type: 'insert_node', path: [2, 1], node: { text: '' } },
        ]
        operations.forEach(editor.apply)
      })
    }
    const output = (
      <editor>
        <block>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <text />
          </inline>
          <text />
          <inline>one</inline>
          <text />
        </block>
        <block>
          <text />
        </block>
        <block>
          <text />
          <inline>
            <text />
          </inline>
          <text />
          <inline>two</inline>
          <text />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
