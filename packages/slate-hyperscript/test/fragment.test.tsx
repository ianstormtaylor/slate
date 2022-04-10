/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('fragment', () => {
  test('fragment-element', () => {
    const input = (
      <fragment>
        <element>word</element>
      </fragment>
    )
    const output = [
      {
        children: [
          {
            text: 'word',
          },
        ],
      },
    ]

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

  test('fragment-empty', () => {
    const input = <fragment />
    const output = []

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

  test('fragment-string', () => {
    const input = <fragment>word</fragment>
    const output = [
      {
        text: 'word',
      },
    ]

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
