/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('value', () => {
  test('value-empty', () => {
    const input = <editor />
    const output = {
      children: [],
      selection: null,
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
