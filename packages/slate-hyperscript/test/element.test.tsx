/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { createHyperscript } from 'slate-hyperscript'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('element', () => {
  test('element-custom', () => {
    const jsx = createHyperscript({
      elements: {
        paragraph: { type: 'paragraph' },
      },
    })
    const input = <paragraph>word</paragraph>
    const output = {
      type: 'paragraph',
      children: [
        {
          text: 'word',
        },
      ],
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

  test('element-empty', () => {
    const input = <element />
    const output = {
      children: [],
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

  test('element-nested-empty', () => {
    const input = (
      <element>
        <element />
      </element>
    )
    const output = {
      children: [
        {
          children: [],
        },
      ],
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

  test('element-nested-string', () => {
    const input = (
      <element>
        <element>word</element>
      </element>
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

  test('element-string', () => {
    const input = <element>word</element>
    const output = {
      children: [
        {
          text: 'word',
        },
      ],
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

  test('element-text-empty', () => {
    const input = (
      <element>
        <text />
      </element>
    )
    const output = {
      children: [
        {
          text: '',
        },
      ],
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

  test('element-text-string', () => {
    const input = (
      <element>
        <text>word</text>
      </element>
    )
    const output = {
      children: [
        {
          text: 'word',
        },
      ],
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
