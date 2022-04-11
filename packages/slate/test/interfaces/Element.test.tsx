import { test, expect, describe } from 'vitest'
import { Element } from '../../src/interfaces/element'

describe.concurrent('Element', () => {
  test('isElement-boolean', () => {
    const input = true
    const test = value => {
      return Element.isElement(value)
    }

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-custom-property', () => {
    const input = {
      children: [],
      custom: 'value',
    }
    const test = value => {
      return Element.isElement(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-editor', () => {
    const input = {
      children: [],
      operations: [],
      selection: null,
      marks: null,
      addMark() {},
      apply() {},
      deleteBackward() {},
      deleteForward() {},
      deleteFragment() {},
      insertBreak() {},
      insertSoftBreak() {},
      insertFragment() {},
      insertNode() {},
      insertText() {},
      isInline() {},
      isVoid() {},
      normalizeNode() {},
      onChange() {},
      removeMark() {},
    }
    const test = value => {
      return Element.isElement(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-element', () => {
    const input = {
      children: [],
    }
    const test = value => {
      return Element.isElement(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-isElementDiscriminant', () => {
    const input = {
      source: 'heading-large',
      children: [{ text: '' }],
    }
    const test = value =>
      Element.isElementType(value, 'heading-large', 'source')

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-isElementDiscriminantFalse', () => {
    const input = {
      type: 'heading-large',
      children: [{ text: '' }],
    }
    const test = value => Element.isElementType(value, 'paragraph', 'source')

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-isElementType', () => {
    const input = {
      type: 'paragraph',
      children: [{ text: '' }],
    }
    const test = value => Element.isElementType(value, 'paragraph')

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-isElementTypeFalse', () => {
    const input = {
      type: 'heading-large',
      children: [{ text: '' }],
    }
    const test = value => Element.isElementType(value, 'paragraph')

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-nodes-full', () => {
    const input = {
      children: [
        {
          children: [],
        },
      ],
    }
    const test = value => {
      return Element.isElement(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-object', () => {
    const input = {}
    const test = value => {
      return Element.isElement(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElement-text', () => {
    const input = {
      text: '',
    }
    const test = value => {
      return Element.isElement(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-boolean', () => {
    const input = true
    const test = value => {
      return Element.isElementList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-element', () => {
    const input = {
      children: [],
    }
    const test = value => {
      return Element.isElementList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-empty', () => {
    const input = []
    const test = value => {
      return Element.isElementList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-full-editor', () => {
    const input = [
      {
        children: [],
        operations: [],
        selection: null,
        marks: null,
        addMark() {},
        apply() {},
        deleteBackward() {},
        deleteForward() {},
        deleteFragment() {},
        insertBreak() {},
        insertSoftBreak() {},
        insertFragment() {},
        insertNode() {},
        insertText() {},
        isInline() {},
        isVoid() {},
        normalizeNode() {},
        onChange() {},
        removeMark() {},
      },
    ]
    const test = value => {
      return Element.isElementList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-full-element', () => {
    const input = [
      {
        children: [],
      },
    ]
    const test = value => {
      return Element.isElementList(value)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-full-text', () => {
    const input = [
      {
        text: '',
      },
    ]
    const test = value => {
      return Element.isElementList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('isElementList-not-full-element', () => {
    const input = [
      {
        children: [],
      },
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: {},
      },
    ]
    const test = value => {
      return Element.isElementList(value)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-custom-prop-match', () => {
    const input = {
      element: { children: [], type: 'bold' },
      props: { type: 'bold' },
    }
    const test = ({ element, props }) => {
      return Element.matches(element, props)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-custom-prop-not-match', () => {
    const input = {
      element: { children: [], type: 'bold' },
      props: { type: 'italic' },
    }
    const test = ({ element, props }) => {
      return Element.matches(element, props)
    }
    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('matches-empty-match', () => {
    const input = {
      element: { children: [] },
      props: {},
    }
    const test = ({ element, props }) => {
      return Element.matches(element, props)
    }
    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })
})
