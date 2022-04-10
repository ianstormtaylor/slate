/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { jsx } from 'slate-hyperscript'

// eslint-disable-next-line no-redeclare
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

describe.concurrent('cursor', () => {
  test('cursor-across-element', () => {
    const input = (
      <editor>
        <element>
          w<anchor />
          or
          <focus />d
        </element>
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
          offset: 3,
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

  test('cursor-across-elements-empty', () => {
    const input = (
      <editor>
        <element>
          <text>
            <anchor />
          </text>
        </element>
        <element>
          <text>
            <focus />
          </text>
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: '',
            },
          ],
        },
        {
          children: [
            {
              text: '',
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
          path: [1, 0],
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

  test('cursor-across-elements-end', () => {
    const input = (
      <editor>
        <element>
          one
          <anchor />
        </element>
        <element>
          two
          <focus />
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
            },
          ],
        },
        {
          children: [
            {
              text: 'two',
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0],
          offset: 3,
        },
        focus: {
          path: [1, 0],
          offset: 3,
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

  test('cursor-across-elements-middle', () => {
    const input = (
      <editor>
        <element>
          on
          <anchor />e
        </element>
        <element>
          t<focus />
          wo
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
            },
          ],
        },
        {
          children: [
            {
              text: 'two',
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0],
          offset: 2,
        },
        focus: {
          path: [1, 0],
          offset: 1,
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

  test('cursor-across-elements-start', () => {
    const input = (
      <editor>
        <element>
          <anchor />
          one
        </element>
        <element>
          <focus />
          two
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
            },
          ],
        },
        {
          children: [
            {
              text: 'two',
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
          path: [1, 0],
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

  test('cursor-element-empty', () => {
    const input = (
      <editor>
        <element>
          <cursor />
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: '',
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

  test('cursor-element-end', () => {
    const input = (
      <editor>
        <element>
          one
          <cursor />
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0],
          offset: 3,
        },
        focus: {
          path: [0, 0],
          offset: 3,
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

  test('cursor-element-middle', () => {
    const input = (
      <editor>
        <element>
          o<cursor />
          ne
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
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
          offset: 1,
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

  test('cursor-element-nested-end', () => {
    const input = (
      <editor>
        <element>
          <element>
            word
            <cursor />
          </element>
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              children: [
                {
                  text: 'word',
                },
              ],
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0, 0],
          offset: 4,
        },
        focus: {
          path: [0, 0, 0],
          offset: 4,
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

  test('cursor-element-nested-middle', () => {
    const input = (
      <editor>
        <element>
          <element>
            wo
            <cursor />
            rd
          </element>
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              children: [
                {
                  text: 'word',
                },
              ],
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0, 0],
          offset: 2,
        },
        focus: {
          path: [0, 0, 0],
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

  test('cursor-element-nested-start', () => {
    const input = (
      <editor>
        <element>
          <element>
            <cursor />
            word
          </element>
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              children: [
                {
                  text: 'word',
                },
              ],
            },
          ],
        },
      ],
      selection: {
        anchor: {
          path: [0, 0, 0],
          offset: 0,
        },
        focus: {
          path: [0, 0, 0],
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

  test('cursor-element-start', () => {
    const input = (
      <editor>
        <element>
          <cursor />
          one
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: 'one',
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

  test('cursor-text-empty', () => {
    const input = (
      <editor>
        <element>
          <text>
            <cursor />
          </text>
        </element>
      </editor>
    )
    const output = {
      children: [
        {
          children: [
            {
              text: '',
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
})
