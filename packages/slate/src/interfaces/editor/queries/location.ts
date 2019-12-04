import warning from 'tiny-warning'
import { reverse as reverseText } from 'esrever'

import {
  Ancestor,
  AncestorEntry,
  Descendant,
  Editor,
  Element,
  ElementEntry,
  Location,
  Mark,
  MarkEntry,
  Node,
  NodeEntry,
  NodeMatch,
  Path,
  Point,
  Range,
  Span,
  Text,
  TextEntry,
} from '../../..'
import { MarkMatch } from '../../mark'

export const LocationQueries = {
  /**
   * Get the marks that are "active" at a location. These are the
   * marks that will be added to any text that is inserted.
   *
   * The `union: true` option can be passed to create a union of marks across
   * the text nodes in the selection, instead of creating an intersection, which
   * is the default.
   *
   * Note: to obey common rich text behavior, if the selection is collapsed at
   * the start of a text node and there are previous text nodes in the same
   * block, it will carry those marks forward from the previous text node. This
   * allows for continuation of marks from previous words.
   */

  activeMarks(
    editor: Editor,
    options: {
      at?: Location
      union?: boolean
      hanging?: boolean
    } = {}
  ): Mark[] {
    warning(
      false,
      'The `Editor.activeMarks` helper is deprecated, use `Editor.marks` instead.'
    )

    return Array.from(
      Editor.marks(editor, {
        at: options.at,
        mode: options.union ? 'distinct' : 'universal',
        continuing: true,
      }),
      ([m]) => m
    )
  },

  /**
   * Get the point after a location.
   */

  after(
    editor: Editor,
    at: Location,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const anchor = Editor.point(editor, at, { edge: 'end' })
    const focus = Editor.end(editor, [])
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of Editor.positions(editor, { ...options, at: range })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  },

  /**
   * Get the common ancestor node of a location.
   */

  ancestor(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): AncestorEntry {
    if (Path.isPath(at) || Point.isPoint(at)) {
      return Editor.parent(editor, at, options)
    }

    const path = Editor.path(editor, at, options)
    const ancestorPath = Path.equals(at.anchor.path, at.focus.path)
      ? Path.parent(path)
      : path

    const ancestor = Node.get(editor, ancestorPath) as Ancestor
    return [ancestor, ancestorPath]
  },

  /**
   * Get the point before a location.
   */

  before(
    editor: Editor,
    at: Location,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const anchor = Editor.start(editor, [])
    const focus = Editor.point(editor, at, { edge: 'start' })
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of Editor.positions(editor, {
      ...options,
      at: range,
      reverse: true,
    })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  },

  /**
   * Get the start and end points of a location.
   */

  edges(editor: Editor, at: Location): [Point, Point] {
    return [Editor.start(editor, at), Editor.end(editor, at)]
  },

  /**
   * Iterate through all of the elements in the Editor.
   */

  *elements(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      mode?: 'all' | 'highest'
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [node, path] of this.nodes(editor, options)) {
      if (Element.isElement(node)) {
        yield [node, path]
      }
    }
  },

  /**
   * Get the end point of a location.
   */

  end(editor: Editor, at: Location): Point {
    return Editor.point(editor, at, { edge: 'end' })
  },

  /**
   * Get the first node at a location.
   */

  first(editor: Editor, at: Location): NodeEntry {
    const path = Editor.path(editor, at, { edge: 'start' })
    return Editor.node(editor, path)
  },

  /**
   * Get the fragment at a location.
   */

  fragment(editor: Editor, at: Location): Descendant[] {
    const range = Editor.range(editor, at)
    const fragment = Node.fragment(editor, range)
    return fragment
  },

  /**
   * Check if a point the start point of a location.
   */

  isStart(editor: Editor, point: Point, at: Location): boolean {
    // PERF: If the offset isn't `0` we know it's not the start.
    if (point.offset !== 0) {
      return false
    }

    const start = Editor.start(editor, at)
    return Point.equals(point, start)
  },

  /**
   * Check if a point is the end point of a location.
   */

  isEnd(editor: Editor, point: Point, at: Location): boolean {
    const end = Editor.end(editor, at)
    return Point.equals(point, end)
  },

  /**
   * Check if a point is an edge of a location.
   */

  isEdge(editor: Editor, point: Point, at: Location): boolean {
    return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at)
  },

  /**
   * Get the last node at a location.
   */

  last(editor: Editor, at: Location): NodeEntry {
    const path = Editor.path(editor, at, { edge: 'end' })
    return Editor.node(editor, path)
  },

  /**
   * Get the leaf text node at a location.
   */

  leaf(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): TextEntry {
    const path = Editor.path(editor, at, options)
    const node = Node.leaf(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the levels at a location.
   */

  *levels(
    editor: Editor,
    options: {
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { at = editor.selection, reverse = false } = options

    if (!at) {
      return
    }

    const levels: NodeEntry[] = []
    const path = Editor.path(editor, at)

    for (const [n, p] of Node.levels(editor, path)) {
      levels.push([n, p])

      if (Element.isElement(n) && editor.isVoid(n)) {
        break
      }
    }

    if (reverse) {
      levels.reverse()
    }

    yield* levels
  },

  /**
   * Iterate through all of the text nodes in the Editor.
   */

  *marks(
    editor: Editor,
    options: {
      at?: Location
      match?: MarkMatch
      mode?: 'all' | 'first' | 'distinct' | 'universal'
      reverse?: boolean
      continuing?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    const { match, mode = 'all', reverse = false, continuing = false } = options
    let { at = editor.selection } = options

    if (!at) {
      return
    }

    // If the range is collapsed at the start of a text node, it should continue
    // the marks from the previous text node in the same block.
    if (
      continuing &&
      Range.isRange(at) &&
      Range.isCollapsed(at) &&
      at.anchor.offset === 0
    ) {
      const { anchor } = at
      const prev = Editor.previous(editor, anchor, 'text')

      if (prev && Path.isSibling(anchor.path, prev[1])) {
        const [, prevPath] = prev
        at = Editor.range(editor, prevPath)
      }
    }

    const universalMarks: Mark[] = []
    const distinctMarks: Mark[] = []
    const universalEntries: MarkEntry[] = []
    let first = true

    for (const entry of Editor.texts(editor, { reverse, at })) {
      const [node, path] = entry

      if (mode === 'universal') {
        if (first) {
          for (let i = 0; i < node.marks.length; i++) {
            const mark = node.marks[i]
            const markEntry: MarkEntry = [mark, i, node, path]

            if (match == null || Editor.isMarkMatch(editor, markEntry, match)) {
              universalMarks.push(mark)
              universalEntries.push(markEntry)
            }
          }

          first = false
          continue
        }

        // PERF: If we're in universal mode and the eligible marks hits zero
        // it can never increase again, so we can exit early.
        if (universalMarks.length === 0) {
          return
        }

        for (let i = universalMarks.length - 1; i >= 0; i--) {
          const existing = universalMarks[i]

          if (!Mark.exists(existing, node.marks)) {
            universalMarks.splice(i, 1)
            universalEntries.splice(i, 1)
          }
        }
      } else {
        for (let index = 0; index < node.marks.length; index++) {
          const mark = node.marks[index]
          const markEntry: MarkEntry = [mark, index, node, path]

          if (match != null && !Editor.isMarkMatch(editor, markEntry, match)) {
            continue
          }

          if (mode === 'distinct') {
            if (Mark.exists(mark, distinctMarks)) {
              continue
            } else {
              distinctMarks.push(mark)
            }
          }

          yield markEntry

          // After matching a mark, if we're in first mode skip to the next text.
          if (mode === 'first') {
            break
          }
        }
      }
    }

    // In universal mode, the marks are collected while iterating and we can
    // only be certain of which are universal when we've finished.
    if (mode === 'universal') {
      yield* universalEntries
    }
  },

  /**
   * Get the first matching node in a single branch of the document.
   */

  match(editor: Editor, at: Location, match: NodeMatch): NodeEntry | undefined {
    const path = Editor.path(editor, at)

    for (const entry of Editor.levels(editor, { at: path })) {
      if (Editor.isMatch(editor, entry, match)) {
        return entry
      }
    }
  },

  /**
   * Iterate through all of the nodes that match.
   */

  *matches(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      reverse?: boolean
    }
  ): Iterable<NodeEntry> {
    warning(
      false,
      'The `Editor.matches` helper is deprecated, use `Editor.nodes` instead.'
    )

    const { at = editor.selection, reverse = false } = options
    let { match } = options

    if (!at) {
      return
    }

    if (match == null) {
      if (Path.isPath(at)) {
        const path = at
        match = ([, p]) => Path.equals(p, path)
      } else {
        match = () => true
      }
    }

    let prevPath: Path | undefined

    for (const [n, p] of Editor.nodes(editor, { at, reverse })) {
      if (prevPath && Path.compare(p, prevPath) === 0) {
        continue
      }

      if (Editor.isMatch(editor, [n, p], match)) {
        prevPath = p
        yield [n, p]
      }
    }
  },

  /**
   * Get the matching node in the branch of the document after a location.
   */

  next(editor: Editor, at: Location, match: NodeMatch): NodeEntry | undefined {
    const [, from] = Editor.last(editor, at)
    const [, to] = Editor.last(editor, [])
    const span: Span = [from, to]
    let i = 0

    for (const entry of Editor.nodes(editor, {
      at: span,
      match,
      mode: 'highest',
    })) {
      if (i === 1) {
        return entry
      }

      i++
    }
  },

  /**
   * Get the node at a location.
   */

  node(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry {
    const path = Editor.path(editor, at, options)
    const node = Node.get(editor, path)
    return [node, path]
  },

  /**
   * Iterate through all of the nodes in the Editor.
   */

  *nodes(
    editor: Editor,
    options: {
      at?: Location | Span
      match?: NodeMatch
      mode?: 'all' | 'highest'
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const {
      at = editor.selection,
      match,
      mode = 'all',
      reverse = false,
    } = options

    if (!at) {
      return
    }

    let from
    let to

    if (Span.isSpan(at)) {
      from = at[0]
      to = at[1]
    } else {
      const first = Editor.path(editor, at, { edge: 'start' })
      const last = Editor.path(editor, at, { edge: 'end' })
      from = reverse ? last : first
      to = reverse ? first : last
    }

    const iterable = Node.nodes(editor, {
      reverse,
      from,
      to,
      pass: ([n]) => Element.isElement(n) && editor.isVoid(n),
    })

    let prev: NodeEntry | undefined

    for (const entry of iterable) {
      if (match != null) {
        if (mode === 'highest' && prev) {
          const [, prevPath] = prev
          const [, path] = entry

          if (Path.compare(path, prevPath) === 0) {
            continue
          }
        }

        if (!Editor.isMatch(editor, entry, match)) {
          continue
        }

        prev = entry
      }

      yield entry
    }
  },

  /**
   * Get the parent node of a location.
   */

  parent(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): AncestorEntry {
    const path = Editor.path(editor, at, options)
    const parentPath = Path.parent(path)
    const entry = Editor.node(editor, parentPath)
    return entry as AncestorEntry
  },

  /**
   * Get the path of a location.
   */

  path(
    editor: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): Path {
    const { depth, edge } = options

    if (Path.isPath(at)) {
      if (edge === 'start') {
        const [, firstPath] = Node.first(editor, at)
        at = firstPath
      } else if (edge === 'end') {
        const [, lastPath] = Node.last(editor, at)
        at = lastPath
      }
    }

    if (Range.isRange(at)) {
      if (edge === 'start') {
        at = Range.start(at)
      } else if (edge === 'end') {
        at = Range.end(at)
      } else {
        at = Path.common(at.anchor.path, at.focus.path)
      }
    }

    if (Point.isPoint(at)) {
      at = at.path
    }

    if (depth != null) {
      at = at.slice(0, depth)
    }

    return at
  },

  /**
   * Get the start or end point of a location.
   */

  point(
    editor: Editor,
    at: Location,
    options: {
      edge?: 'start' | 'end'
    } = {}
  ): Point {
    const { edge = 'start' } = options

    if (Path.isPath(at)) {
      let path

      if (edge === 'end') {
        const [, lastPath] = Node.last(editor, at)
        path = lastPath
      } else {
        const [, firstPath] = Node.first(editor, at)
        path = firstPath
      }

      const node = Node.get(editor, path)

      if (!Text.isText(node)) {
        throw new Error(
          `Cannot get the ${edge} point in the node at path [${at}] because it has no ${edge} text node.`
        )
      }

      return { path, offset: edge === 'end' ? node.text.length : 0 }
    }

    if (Range.isRange(at)) {
      const [start, end] = Range.edges(at)
      return edge === 'start' ? start : end
    }

    return at
  },

  /**
   * Iterate through all of the positions in the document where a `Point` can be
   * placed.
   *
   * By default it will move forward by individual offsets at a time,  but you
   * can pass the `unit: 'character'` option to moved forward one character, word,
   * or line at at time.
   *
   * Note: void nodes are treated as a single point, and iteration will not
   * happen inside their content.
   */

  *positions(
    editor: Editor,
    options: {
      at?: Location
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
    } = {}
  ): Iterable<Point> {
    const { at = editor.selection, unit = 'offset', reverse = false } = options

    if (!at) {
      return
    }

    const range = Editor.range(editor, at)
    const [start, end] = Range.edges(range)
    const first = reverse ? end : start
    let string = ''
    let available = 0
    let offset = 0
    let distance: number | null = null
    let isNewBlock = false

    const advance = () => {
      if (distance == null) {
        if (unit === 'character') {
          distance = getCharacterDistance(string)
        } else if (unit === 'word') {
          distance = getWordDistance(string)
        } else if (unit === 'line' || unit === 'block') {
          distance = string.length
        } else {
          distance = 1
        }

        string = string.slice(distance)
      }

      // Add or substract the offset.
      offset = reverse ? offset - distance : offset + distance
      // Subtract the distance traveled from the available text.
      available = available - distance!
      // If the available had room to spare, reset the distance so that it will
      // advance again next time. Otherwise, set it to the overflow amount.
      distance = available >= 0 ? null : 0 - available
    }

    for (const [node, path] of Editor.nodes(editor, { at, reverse })) {
      if (Element.isElement(node)) {
        // Void nodes are a special case, since we don't want to iterate over
        // their content. We instead always just yield their first point.
        if (editor.isVoid(node)) {
          yield Editor.start(editor, path)
          continue
        }

        if (editor.isInline(node)) {
          continue
        }

        if (Editor.hasInlines(editor, node)) {
          const e = Path.isAncestor(path, end.path)
            ? end
            : Editor.end(editor, path)
          const s = Path.isAncestor(path, start.path)
            ? start
            : Editor.start(editor, path)

          const text = Editor.text(editor, { anchor: s, focus: e })
          string = reverse ? reverseText(text) : text
          isNewBlock = true
        }
      }

      if (Text.isText(node)) {
        const isFirst = Path.equals(path, first.path)
        available = node.text.length
        offset = reverse ? available : 0

        if (isFirst) {
          available = reverse ? first.offset : available - first.offset
          offset = first.offset
        }

        if (isFirst || isNewBlock || unit === 'offset') {
          yield { path, offset }
        }

        while (true) {
          // If there's no more string, continue to the next block.
          if (string === '') {
            break
          } else {
            advance()
          }

          // If the available space hasn't overflow, we have another point to
          // yield in the current text node.
          if (available >= 0) {
            yield { path, offset }
          } else {
            break
          }
        }

        isNewBlock = false
      }
    }
  },

  /**
   * Get the matching node in the branch of the document before a location.
   */

  previous(
    editor: Editor,
    at: Location,
    match: NodeMatch
  ): NodeEntry | undefined {
    const [, from] = Editor.first(editor, at)
    const [, to] = Editor.first(editor, [])
    const span: Span = [from, to]
    let i = 0

    for (const entry of Editor.nodes(editor, {
      match,
      at: span,
      reverse: true,
      mode: 'highest',
    })) {
      if (i === 1) {
        return entry
      }

      i++
    }
  },

  /**
   * Get a range of a location.
   */

  range(editor: Editor, at: Location, to?: Location): Range {
    if (Range.isRange(at) && !to) {
      return at
    }

    const start = Editor.start(editor, at)
    const end = Editor.end(editor, to || at)
    return { anchor: start, focus: end }
  },

  /**
   * Get the start point of a location.
   */

  start(editor: Editor, at: Location): Point {
    return Editor.point(editor, at, { edge: 'start' })
  },

  /**
   * Get the text content of a location.
   *
   * Note: the text of void nodes is presumed to be an empty string, regardless
   * of what their actual content is.
   */

  text(editor: Editor, at: Location): string {
    const range = Editor.range(editor, at)
    const [start, end] = Range.edges(range)
    let text = ''

    for (const [node, path] of Editor.texts(editor, { at: range })) {
      let t = node.text

      if (Path.equals(path, end.path)) {
        t = t.slice(0, end.offset)
      }

      if (Path.equals(path, start.path)) {
        t = t.slice(start.offset)
      }

      text += t
    }

    return text
  },

  /**
   * Iterate through all of the text nodes in the Editor.
   */

  *texts(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      mode?: 'all' | 'highest'
      reverse?: boolean
    } = {}
  ): Iterable<TextEntry> {
    for (const [node, path] of this.nodes(editor, options)) {
      if (Text.isText(node)) {
        yield [node, path]
      }
    }
  },
}

/**
 * Constants for string distance checking.
 */

const SPACE = /\s/
const PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
const CHAMELEON = /['\u2018\u2019]/
const SURROGATE_START = 0xd800
const SURROGATE_END = 0xdfff

/**
 * Check if a character is a word character. The `remaining` argument is used
 * because sometimes you must read subsequent characters to truly determine it.
 */

const isWordCharacter = (char: string, remaining: string): boolean => {
  if (SPACE.test(char)) {
    return false
  }

  // Chameleons count as word characters as long as they're in a word, so
  // recurse to see if the next one is a word character or not.
  if (CHAMELEON.test(char)) {
    let next = remaining.charAt(0)
    const length = getCharacterDistance(next)
    next = remaining.slice(0, length)
    const rest = remaining.slice(length)

    if (isWordCharacter(next, rest)) {
      return true
    }
  }

  if (PUNCTUATION.test(char)) {
    return false
  }

  return true
}

/**
 * Get the distance to the end of the first character in a string of text.
 */

const getCharacterDistance = (text: string): number => {
  const code = text.charCodeAt(0)
  const isSurrogate = SURROGATE_START <= code && code <= SURROGATE_END
  return isSurrogate ? 2 : 1
}

/**
 * Get the distance to the end of the first word in a string of text.
 */

const getWordDistance = (text: string): number => {
  let length = 0
  let i = 0
  let started = false
  let char

  while ((char = text.charAt(i))) {
    const l = getCharacterDistance(char)
    char = text.slice(i, i + l)
    const rest = text.slice(i + l)

    if (isWordCharacter(char, rest)) {
      started = true
      length += l
    } else if (!started) {
      length += l
    } else {
      break
    }

    i += l
  }

  return length
}
