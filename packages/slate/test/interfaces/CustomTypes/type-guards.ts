import { Element, Text, Operation } from 'slate'
import { CustomText, CustomOperation, HeadingElement } from './custom-types'

export const isBoldText = (text: Text): text is CustomText =>
  !!(text as CustomText).bold

export const isCustomText = (text: Text): text is CustomText =>
  !!(text as CustomText).placeholder

export const isCustomOperation = (
  op: Operation
): Operation is CustomOperation => (op as CustomOperation).type === 'custom_op'

export const isHeadingElement = (element: Element): element is HeadingElement =>
  element.type === 'heading'
