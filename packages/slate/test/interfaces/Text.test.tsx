import { test, expect, describe } from 'vitest'
import { Text } from 'slate'

describe.concurrent('Text', () => {
  test('decorations-adjacent', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration1: 'decoration1',
      },
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 3,
        },
        decoration2: 'decoration2',
      },
    ]

    const test = decorations => {
      return Text.decorations({ text: 'abcd', mark: 'mark' }, decorations)
    }

    const output = [
      {
        text: 'a',
        mark: 'mark',
      },
      {
        text: 'b',
        mark: 'mark',
        decoration1: 'decoration1',
      },
      {
        text: 'c',
        mark: 'mark',
        decoration2: 'decoration2',
      },
      {
        text: 'd',
        mark: 'mark',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-collapse', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration1: 'decoration1',
      },
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration2: 'decoration2',
      },
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 3,
        },
        decoration3: 'decoration3',
      },
      {
        anchor: {
          path: [0],
          offset: 4,
        },
        focus: {
          path: [0],
          offset: 4,
        },
        decoration4: 'decoration4',
      },
    ]

    const test = decorations => {
      return Text.decorations({ text: 'abcd', mark: 'mark' }, decorations)
    }

    const output = [
      {
        text: 'a',
        mark: 'mark',
      },
      {
        text: 'b',
        mark: 'mark',
        decoration1: 'decoration1',
      },
      {
        text: '',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration2: 'decoration2',
        decoration3: 'decoration3',
      },
      {
        text: 'c',
        mark: 'mark',
        decoration3: 'decoration3',
      },
      {
        text: 'd',
        mark: 'mark',
      },
      {
        text: '',
        mark: 'mark',
        decoration4: 'decoration4',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-end', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 3,
        },
        decoration: 'decoration',
      },
    ]
    const test = decorations => {
      return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
    }
    const output = [
      {
        text: 'ab',
        mark: 'mark',
      },
      {
        text: 'c',
        mark: 'mark',
        decoration: 'decoration',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-intersect', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 5,
        },
        decoration1: 'decoration1',
      },
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 3,
        },
        decoration2: 'decoration2',
      },
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration3: 'decoration3',
      },
      {
        anchor: {
          path: [0],
          offset: 2,
        },
        focus: {
          path: [0],
          offset: 4,
        },
        decoration4: 'decoration4',
      },
    ]

    const test = decorations => {
      return Text.decorations({ text: 'abcdef', mark: 'mark' }, decorations)
    }

    const output = [
      {
        text: 'a',
        mark: 'mark',
      },
      {
        text: 'b',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration2: 'decoration2',
      },
      {
        text: '',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration2: 'decoration2',
        decoration3: 'decoration3',
        decoration4: 'decoration4',
      },
      {
        text: 'c',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration2: 'decoration2',
        decoration4: 'decoration4',
      },
      {
        text: 'd',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration4: 'decoration4',
      },
      {
        text: 'e',
        mark: 'mark',
        decoration1: 'decoration1',
      },
      {
        text: 'f',
        mark: 'mark',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-middle', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration: 'decoration',
      },
    ]
    const test = decorations => {
      return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
    }
    const output = [
      {
        text: 'a',
        mark: 'mark',
      },
      {
        text: 'b',
        mark: 'mark',
        decoration: 'decoration',
      },
      {
        text: 'c',
        mark: 'mark',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-overlapping', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 1,
        },
        focus: {
          path: [0],
          offset: 2,
        },
        decoration1: 'decoration1',
      },
      {
        anchor: {
          path: [0],
          offset: 0,
        },
        focus: {
          path: [0],
          offset: 3,
        },
        decoration2: 'decoration2',
      },
    ]
    const test = decorations => {
      return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
    }
    const output = [
      {
        text: 'a',
        mark: 'mark',
        decoration2: 'decoration2',
      },
      {
        text: 'b',
        mark: 'mark',
        decoration1: 'decoration1',
        decoration2: 'decoration2',
      },
      {
        text: 'c',
        mark: 'mark',
        decoration2: 'decoration2',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('decorations-start', () => {
    const input = [
      {
        anchor: {
          path: [0],
          offset: 0,
        },
        focus: {
          path: [0],
          offset: 1,
        },
        decoration: 'decoration',
      },
    ]
    const test = decorations => {
      return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
    }
    const output = [
      {
        text: 'a',
        mark: 'mark',
        decoration: 'decoration',
      },
      {
        text: 'bc',
        mark: 'mark',
      },
    ]

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-complex-exact-equals', () => {
    const input = {
      textNodeA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
      textNodeB: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: false })
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-complex-exact-not-equal', () => {
    const input = {
      textNodeA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
      textNodeB: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: true },
      },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: false })
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-complex-loose-equals', () => {
    const input = {
      textNodeA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
      textNodeB: {
        text: 'diff text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: true })
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-complex-loose-not-equal', () => {
    const input = {
      textNodeA: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: false },
      },
      textNodeB: {
        text: 'same text',
        bold: true,
        italic: { origin: 'inherited', value: true },
      },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: false })
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-exact-equals', () => {
    const input = {
      textNodeA: { text: 'same text', bold: true },
      textNodeB: { text: 'same text', bold: true },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: false })
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-exact-not-equal', () => {
    const input = {
      textNodeA: { text: 'same text', bold: true },
      textNodeB: { text: 'same text', bold: true, italic: true },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: false })
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-loose-equals', () => {
    const input = {
      textNodeA: { text: 'some text', bold: true },
      textNodeB: { text: 'diff text', bold: true },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: true })
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('equals-loose-not-equal', () => {
    const input = {
      textNodeA: { text: 'same text', bold: true },
      textNodeB: { text: 'same text', bold: true, italic: true },
    }

    const test = ({ textNodeA, textNodeB }) => {
      return Text.equals(textNodeA, textNodeB, { loose: true })
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-boolean', () => {
    const input = true
    const test = value => {
      return Text.isText(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-custom-property', () => {
    const input = {
      text: '',
      custom: true,
    }
    const test = value => {
      return Text.isText(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-object', () => {
    const input = {}
    const test = value => {
      return Text.isText(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-text-full', () => {
    const input = {
      text: 'string',
    }
    const test = value => {
      return Text.isText(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-text', () => {
    const input = {
      text: '',
    }
    const test = value => {
      return Text.isText(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isText-without-text', () => {
    const input = {}
    const test = value => {
      return Text.isText(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-boolean', () => {
    const input = true
    const test = value => {
      return Text.isTextList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-empty', () => {
    const input = []
    const test = value => {
      return Text.isTextList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-full-element', () => {
    const input = [
      {
        children: [],
      },
    ]
    const test = value => {
      return Text.isTextList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-full-text', () => {
    const input = [
      {
        text: '',
      },
    ]
    const test = value => {
      return Text.isTextList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-full-value', () => {
    const input = [
      {
        children: [],
        selection: null,
      },
    ]
    const test = value => {
      return Text.isTextList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-not-full-text', () => {
    const input = [
      {
        text: '',
      },
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: {},
      },
    ]
    const test = value => {
      return Text.isTextList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isTextList-text', () => {
    const input = {
      text: '',
    }
    const test = value => {
      return Text.isTextList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-empty-true', () => {
    const input = {
      text: { text: '', bold: true },
      props: {},
    }
    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-match-false', () => {
    const input = {
      text: { text: '', bold: true },
      props: { italic: true },
    }
    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-match-true', () => {
    const input = {
      text: { text: '', bold: true },
      props: { bold: true },
    }
    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-partial-false', () => {
    const input = {
      text: { text: '', bold: true, italic: true },
      props: { underline: true },
    }
    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-partial-true', () => {
    const input = {
      text: { text: '', bold: true, italic: true },
      props: { bold: true },
    }
    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-undefined-false', () => {
    const input = {
      text: { foo: undefined },
      props: { bar: undefined },
    }

    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-undefined-true', () => {
    const input = {
      text: { foo: undefined },
      props: { foo: undefined },
    }

    const test = ({ text, props }) => {
      return Text.matches(text, props)
    }

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })
})
