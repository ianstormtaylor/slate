/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('text', () => {
  test('text-empty', () => {
    const input = <text a />
    const output = {
      text: '',
      a: true,
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

  test('text-full', () => {
    const input = <text a>word</text>
    const output = {
      text: 'word',
      a: true,
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

  test('text-nested', () => {
    const input = (
      <text b>
        <text a>word</text>
      </text>
    )
    const output = {
      text: 'word',
      a: true,
      b: true,
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
