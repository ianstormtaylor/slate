/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('selection', () => {
  test('selection-offset-start', () => {
    const input = (
      <editor>
        <element>word</element>
        <selection>
          <anchor path={[0, 0]} offset={0} />
          <focus path={[0, 0]} offset={0} />
        </selection>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'word',
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0],
          offset: 0,
        },
      },
    }

    let actual = {}

    if (Array.isArray(output)) {
      actual = input
    } else {
      for (const key in output) {
        actual[key] = input[key]
      }
    }

    expect(actual).toEqual(output)
  })

  test('selection', () => {
    const input = (
      <editor>
        <element>word</element>
        <selection>
          <anchor path={[0, 0]} offset={1} />
          <focus path={[0, 0]} offset={2} />
        </selection>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'word',
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0],
          offset: 1,
        },
        focus: {
          path: [0, 0],
          offset: 2,
        },
      },
    }

    let actual = {}

    if (Array.isArray(output)) {
      actual = input
    } else {
      for (const key in output) {
        actual[key] = input[key]
      }
    }

    expect(actual).toEqual(output)
  })
})
