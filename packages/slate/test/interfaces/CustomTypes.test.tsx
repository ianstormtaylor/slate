import { test, expect, describe } from 'vitest'
import {
  BaseEditor,
  BaseSelection,
  BasePoint,
  BaseRange,
  Descendant,
  Operation,
  Element,
  Text,
} from 'slate'

export type HeadingElement = {
  type: 'heading'
  level: number
  children: Descendant[]
}

export type ListItemElement = {
  type: 'list-item'
  depth: number
  children: Descendant[]
}

export type CustomText = {
  placeholder?: string
  bold?: boolean
  italic?: boolean
  text: string
}

export type CustomOperation = {
  type: 'custom_op'
  value: string
}

export type ExtendedOperation = Operation | CustomOperation

export type CustomElement = HeadingElement | ListItemElement

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor
    Element: CustomElement
    Text: CustomText
    Node: CustomElement | CustomText
    Point: BasePoint
    Range: BaseRange
    Selection: BaseSelection
    Operation: ExtendedOperation
  }
}

export const isBoldText = (text: Text): text is CustomText =>
  !!(text as CustomText).bold

export const isCustomText = (text: Text): text is CustomText =>
  !!(text as CustomText).placeholder

export const isCustomOperation = (
  op: Operation
): Operation is CustomOperation => (op as CustomOperation).type === 'custom_op'

export const isHeadingElement = (element: Element): element is HeadingElement =>
  element.type === 'heading'

describe.concurrent('CustomTypes', () => {
  test('boldText-false', () => {
    const input: Text = {
      placeholder: 'heading',
      bold: false,
      italic: false,
      text: 'mytext',
    }

    const test = isBoldText

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('boldText-true', () => {
    // show that regular methods that are imported work as expected

    const input: Text = {
      bold: true,
      text: 'mytext',
    }

    const test = isBoldText

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('customOperation-false', () => {
    const input: Operation = {
      type: 'insert_text',
      path: [0, 0],
      offset: 0,
      text: 'text',
    }

    const test = isCustomOperation

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('customOperation-true', () => {
    const input: Operation = {
      type: 'custom_op',
      value: 'some value',
    }

    const test = isCustomOperation

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('customText-false', () => {
    const input: Text = {
      bold: true,
      text: 'mytext',
    }

    const test = isCustomText

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('customText-true', () => {
    const input: Text = {
      placeholder: 'mystring',
      text: 'mytext',
    }

    const test = isCustomText

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('headingElement-false', () => {
    const input: Element = {
      type: 'list-item',
      depth: 5,
      children: [],
    }

    const test = isHeadingElement

    const output = false

    const result = test(input)
    expect(result).toEqual(output)
  })

  test('headingElement-true', () => {
    const input: Element = {
      type: 'heading',
      level: 5,
      children: [],
    }

    const test = isHeadingElement

    const output = true

    const result = test(input)
    expect(result).toEqual(output)
  })
})
