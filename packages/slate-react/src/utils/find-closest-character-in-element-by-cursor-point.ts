import { findTextNodesInNode } from './dom'

export type CursorPoint = {
  x: number
  y: number
}

export type ClosestCharacter = {
  offset: number
  distance: number
  textNode: Text
}

type CharDistanceFromCursorPoint = {
  distanceX: number
  distanceY: number
  charCenterX: number
  charCenterY: number
  isCursorOnSameLine: boolean
}

const calculateCharDistance = (
  cursorPoint: CursorPoint,
  range: Range
): CharDistanceFromCursorPoint => {
  const rect = range.getBoundingClientRect()
  const charCenterX = (rect.left + rect.right) / 2
  const charCenterY = (rect.top + rect.bottom) / 2

  return {
    distanceX: Math.abs(cursorPoint.x - charCenterX),
    distanceY: Math.abs(cursorPoint.y - charCenterY),
    charCenterX,
    charCenterY,
    isCursorOnSameLine:
      rect.top <= cursorPoint.y && rect.bottom >= cursorPoint.y,
  }
}

const findClosestCharacterInSingleTextNode = (
  textNode: Text,
  cursorPoint: CursorPoint
): ClosestCharacter | null => {
  let closestChar: ClosestCharacter | null = null
  let textLength = textNode.textContent?.length ?? 0

  for (let i = 0; i < textLength; i++) {
    const range = document.createRange()
    range.setStart(textNode, i)
    range.setEnd(textNode, i + 1)

    const { distanceX, charCenterX, isCursorOnSameLine } =
      calculateCharDistance(cursorPoint, range)

    if (isCursorOnSameLine) {
      const prevDistance: number = closestChar?.distance ?? Infinity
      const newDistance: number = distanceX
      const isCloser = newDistance < prevDistance

      const isOnLeftSideOfCursor = cursorPoint.x < charCenterX
      const offset = isOnLeftSideOfCursor ? i : i + 1

      closestChar = isCloser
        ? { offset, distance: newDistance, textNode }
        : closestChar
    }
  }

  return closestChar
}

const findClosestCharacterForTextNodes = (
  textNodes: Text[],
  cursorPoint: CursorPoint
): ClosestCharacter | null => {
  let closestInNode = null

  for (const textNode of textNodes) {
    const newResult = findClosestCharacterInSingleTextNode(
      textNode,
      cursorPoint
    )
    const prevDistance: number = closestInNode?.distance ?? Infinity
    const newDistance: number = newResult?.distance ?? Infinity
    const isCloser = newDistance < prevDistance

    closestInNode = isCloser ? newResult : closestInNode
  }

  return closestInNode
}

export const findClosestCharacterToCursorPoint = (
  elementUnderCursor: Element,
  cursorPoint: CursorPoint
): ClosestCharacter | null => {
  const textNodes = findTextNodesInNode(elementUnderCursor)
  return findClosestCharacterForTextNodes(textNodes, cursorPoint)
}
