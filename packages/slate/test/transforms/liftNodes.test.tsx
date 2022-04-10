/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Transforms } from 'slate'
import { jsx } from '../jsx'
import { withTest } from '../with-test'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('liftNodes', () => {
  test('liftNodes-path-block', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { at: [0, 0] })
    }
    const input = (
      <editor>
        <block>
          <block>word</block>
        </block>
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

  test('liftNodes-path-first-block', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { at: [0, 0] })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>one</block>
        <block>
          <block>two</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('liftNodes-path-last-block', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>two</block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('liftNodes-path-middle-block', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { at: [0, 1] })
    }
    const input = (
      <editor>
        <block>
          <block>one</block>
          <block>two</block>
          <block>three</block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <block>one</block>
        </block>
        <block>two</block>
        <block>
          <block>three</block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('liftNodes-selection-block-full', () => {
    const run = editor => {
      Transforms.liftNodes(editor)
    }
    const input = (
      <editor>
        <block>
          <block>
            <anchor />
            one
          </block>
          <block>two</block>
          <block>three</block>
          <block>four</block>
          <block>five</block>
          <block>
            six
            <focus />
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block>
          <anchor />
          one
        </block>
        <block>two</block>
        <block>three</block>
        <block>four</block>
        <block>five</block>
        <block>
          six
          <focus />
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('liftNodes-selection-block-nested', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { match: n => n.c })
    }
    const input = (
      <editor>
        <block a>
          <block b>
            <block c>
              <cursor />
              one
            </block>
          </block>
        </block>
      </editor>
    )
    const output = (
      <editor>
        <block a>
          <block c>
            <cursor />
            one
          </block>
        </block>
      </editor>
    )

    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })

  test('liftNodes-voids-true-block', () => {
    const run = editor => {
      Transforms.liftNodes(editor, { at: [0, 0], voids: true })
    }
    const input = (
      <editor>
        <block void>
          <block>word</block>
        </block>
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
})
