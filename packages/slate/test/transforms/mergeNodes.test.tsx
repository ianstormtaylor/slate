/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from '../jsx'
import { Editor, Transforms, Text } from 'slate'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('mergeNodes', () => {
  test('mergeNodes-depth-block-block-nested-multi-child', () => {
    const run = editor => {
      Transforms.mergeNodes(editor, {
        at: {
          path: [0, 1, 1, 0, 0, 0],
          offset: 0,
        },
      })
    }

    const input = (
      <editor>
        <block>
          <block>
            <text>123</text>
          </block>
          <block>
            <block>
              <text>45</text>
            </block>
            <block>
              <block>
                <block>
                  <text>c</text>
                </block>
                <block>
                  <block>
                    <text>edf</text>
                  </block>
                </block>
              </block>
            </block>
          </block>
        </block>
      </editor>
    )

    const output = (
      <editor>
        <block>
          <block>
            <text>123</text>
          </block>
          <block>
            <block>
              <text>45c</text>
            </block>
            <block>
              <block>
                <block>
                  <block>
                    <text>edf</text>
                  </block>
                </block>
              </block>
            </block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-depth-block-block-nested-only-child', () => {
    const run = editor => {
      Transforms.mergeNodes(editor, {
        at: {
          path: [0, 1, 1, 0, 0, 0],
          offset: 0,
        },
      })
    }

    const input = (
      <editor>
        <block>
          <block>
            <text>123</text>
          </block>
          <block>
            <block>
              <text>45</text>
            </block>
            <block>
              <block>
                <block>
                  <text>c</text>
                </block>
              </block>
            </block>
          </block>
        </block>
      </editor>
    )

    const output = (
      <editor>
        <block>
          <block>
            <text>123</text>
          </block>
          <block>
            <block>
              <text>45c</text>
            </block>
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-depth-block-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>
          <cursor />
          two
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
    }
    const output = (
      <editor>
        <block>
          one
          <cursor />
          two
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-path-block-nested', () => {
    const input = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, {
        at: [1],
        withMatch: ([, p]) => p.length === 1,
      })
    }
    const output = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-path-block', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { at: [1] })
    }
    const output = (
      <editor>
        <block>onetwo</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-path-text-across', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>two</block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { at: [1, 0], match: Text.isText })
    }
    const output = (
      <editor>
        <block>onetwo</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-path-text-hanging-nested', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>
          <block>
            <cursor />
            <text />
          </block>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { at: [1, 0, 1], match: Text.isText })
    }
    const output = (
      <editor>
        <block>one</block>
        <block>
          <block>
            <cursor />
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-path-text-hanging', () => {
    const input = (
      <editor>
        <block>one</block>
        <block>
          <cursor />
          <text />
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { at: [1, 1], match: Text.isText })
    }
    const output = (
      <editor>
        <block>one</block>
        <block>
          <cursor />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('mergeNodes-voids-true-block', () => {
    const input = (
      <editor>
        <block void>
          <text>one</text>
          <text>two</text>
        </block>
      </editor>
    )
    const run = editor => {
      Transforms.mergeNodes(editor, { at: [0, 1], voids: true })
    }
    const output = (
      <editor>
        <block void>onetwo</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
