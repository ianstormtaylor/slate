import { Element, Text } from 'slate'
import { BoldCustomText, CustomText, HeadingElement } from './custom-types'

export const isBoldText = (text: Text): text is BoldCustomText =>
  !!(text as BoldCustomText).bold

export const isCustomText = (text: Text): text is CustomText =>
  !!(text as CustomText).placeholder

export const isHeadingElement = (element: Element): element is HeadingElement =>
  element.type === 'heading'
