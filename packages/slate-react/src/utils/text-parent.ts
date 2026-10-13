import { Element, Node, Text } from 'slate'

const hasSameProperties = (prev: Element, next: Element) => {
  const prevKeys = Object.keys(prev).filter(key => key !== 'children')
  const nextKeys = Object.keys(next).filter(key => key !== 'children')

  return (
    prevKeys.length === nextKeys.length &&
    prevKeys.every(
      key =>
        key in next && prev[key as keyof Element] === next[key as keyof Element]
    )
  )
}

const isLastChild = (parent: Element, text: Text) =>
  parent.children[parent.children.length - 1] === text

export const isTextParentEquivalent = (
  prevParent: Element,
  nextParent: Element,
  prevText: Text,
  nextText: Text
) => {
  if (prevParent === nextParent) {
    return true
  }

  return (
    hasSameProperties(prevParent, nextParent) &&
    isLastChild(prevParent, prevText) === isLastChild(nextParent, nextText) &&
    (nextText.text !== '' ||
      (Node.string(prevParent) === '') === (Node.string(nextParent) === ''))
  )
}
