export type Path = readonly number[]

export type Point = {
  path: Path
  offset: number
}

export type Range = {
  anchor: Point
  focus: Point
}

export const serializePoint = (point: Point) =>
  `${point.path.join('.')}:${point.offset}`

export const serializeRange = (range: Range) =>
  `${serializePoint(range.anchor)}|${serializePoint(range.focus)}`

export const isCollapsed = (range: Range) =>
  range.anchor.offset === range.focus.offset &&
  range.anchor.path.length === range.focus.path.length &&
  range.anchor.path.every(
    (segment, index) => segment === range.focus.path[index]
  )
