import { Node, NodeEntry } from '../interfaces/node'
import { Editor, EditorNodesOptions } from '../interfaces/editor'
import { Span } from '../interfaces/location'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Text } from '../interfaces/text'

export function* nodes<T extends Node>(
  editor: Editor,
  options: EditorNodesOptions<T> = {}
): Generator<NodeEntry<T>, void, undefined> {
  const {
    at = editor.selection,
    mode = 'all',
    universal = false,
    reverse = false,
    voids = false,
    ignoreNonSelectable = false,
  } = options
  let { match } = options

  if (!match) {
    match = () => true
  }

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

  const nodeEntries = Node.nodes(editor, {
    reverse,
    from,
    to,
    pass: ([node]) => {
      if (!Element.isElement(node)) return false
      if (
        !voids &&
        (Editor.isVoid(editor, node) || Editor.isElementReadOnly(editor, node))
      )
        return true
      if (ignoreNonSelectable && !Editor.isSelectable(editor, node)) return true
      return false
    },
  })

  const matches: NodeEntry<T>[] = []
  let hit: NodeEntry<T> | undefined

  for (const [node, path] of nodeEntries) {
    if (
      ignoreNonSelectable &&
      Element.isElement(node) &&
      !Editor.isSelectable(editor, node)
    ) {
      continue
    }

    const isLower = hit && Path.compare(path, hit[1]) === 0

    // In highest mode any node lower than the last hit is not a match.
    if (mode === 'highest' && isLower) {
      continue
    }

    if (!match(node, path)) {
      // If we've arrived at a leaf text node that is not lower than the last
      // hit, then we've found a branch that doesn't include a match, which
      // means the match is not universal.
      if (universal && !isLower && Text.isText(node)) {
        return
      } else {
        continue
      }
    }

    // If there's a match and it's lower than the last, update the hit.
    if (mode === 'lowest' && isLower) {
      hit = [node, path] as NodeEntry<T>
      continue
    }

    // In lowest mode we emit the last hit, once it's guaranteed lowest.
    const emit: NodeEntry<T> | undefined =
      mode === 'lowest' ? hit : ([node, path] as NodeEntry<T>)

    if (emit) {
      if (universal) {
        matches.push(emit)
      } else {
        yield emit
      }
    }

    hit = [node, path] as NodeEntry<T>
  }

  // Since lowest is always emitting one behind, catch up at the end.
  if (mode === 'lowest' && hit) {
    if (universal) {
      matches.push(hit)
    } else {
      yield hit
    }
  }

  // Universal defers to ensure that the match occurs in every branch, so we
  // yield all of the matches after iterating.
  if (universal) {
    yield* matches
  }
}
