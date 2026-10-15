import assert from 'assert'
import * as fc from 'fast-check'
import { isEqual } from 'lodash'
import {
  Editor,
  Element,
  Node,
  Operation,
  Path,
  Point,
  Range,
  Text,
  Transforms,
} from 'slate'
import {
  command,
  create,
  document,
  kinds,
  operationFor,
  pick,
  points,
  rangeFrom,
  rawDocument,
  shortText,
  survives,
  text,
} from './generators'

const settings = {
  seed: Number(process.env.SLATE_FUZZ_SEED || 20261014),
  numRuns: Number(
    process.env.SLATE_FUZZ_RUNS || (process.env.SLATE_FUZZ ? 5000 : 100)
  ),
  ...(process.env.SLATE_FUZZ_PATH ? { path: process.env.SLATE_FUZZ_PATH } : {}),
  includeErrorInReport: true,
}

const marks = ({ text: content, ...properties }: Text) =>
  Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  )

const snapshot = (editor: Editor) =>
  structuredClone({
    children: editor.children,
    selection: editor.selection,
  })

const assertNormalized = (editor: Editor) => {
  for (const [parent] of Node.nodes(editor)) {
    if (Text.isText(parent)) continue
    if (parent !== editor) assert(parent.children.length > 0)
    const inlineChildren =
      Element.isElement(parent) &&
      (editor.isInline(parent) ||
        Text.isText(parent.children[0]) ||
        editor.isInline(parent.children[0]))
    parent.children.forEach((child, index) => {
      assert.strictEqual(
        Text.isText(child) || editor.isInline(child),
        inlineChildren
      )
      const previous = parent.children[index - 1]
      if (Text.isText(child) && previous && Text.isText(previous)) {
        assert.notDeepStrictEqual(marks(child), marks(previous))
        assert(child.text.length > 0 && previous.text.length > 0)
      }
      if (!Text.isText(child) && editor.isInline(child)) {
        assert(Text.isText(previous))
        assert(Text.isText(parent.children[index + 1]))
      }
    })
  }
}

const affinities = ['forward', 'backward'] as const
const rangeAffinities = [...affinities, 'inward', 'outward'] as const

describe('core properties', () => {
  for (const kind of kinds) {
    it(`${kind} applies and inverts without changing surviving selections`, () => {
      fc.assert(
        fc.property(
          document,
          command,
          fc.boolean(),
          (children, input, selected) => {
            const editor = create(children)
            Editor.setNormalizing(editor, false)
            const available = points(editor)
            if (selected) {
              editor.selection = rangeFrom(
                available,
                input.index,
                input.position
              )
            } else {
              Transforms.deselect(editor)
            }
            const operation = operationFor(editor, { ...input, kind })
            assert(operation, `Missing valid ${kind} operation`)
            if (kind !== 'set_selection' && selected) {
              const safe = available.filter(point => survives(point, operation))
              if (safe.length) {
                editor.selection = rangeFrom(safe, input.index, input.position)
              } else {
                Transforms.deselect(editor)
              }
            }
            const before = snapshot(editor)
            const transformed = create(editor.children, false)
            transformed.selection = structuredClone(editor.selection)
            editor.apply(operation)
            Transforms.transform(transformed, operation)
            assert.deepStrictEqual(snapshot(editor), snapshot(transformed))
            editor.apply(Operation.inverse(operation))
            assert.deepStrictEqual(snapshot(editor), before)
          }
        ),
        settings
      )
    })
  }

  it('points, paths and ranges invert outside removed content and merge seams', () => {
    fc.assert(
      fc.property(document, command, (children, input) => {
        const editor = create(children)
        const operation = operationFor(editor, input)!
        const inverse = Operation.inverse(operation)
        const available = points(editor).filter(point =>
          survives(point, operation)
        )
        for (const affinity of affinities) {
          for (const point of available) {
            const moved = Point.transform(point, operation, { affinity })
            assert(moved)
            assert.deepStrictEqual(
              Point.transform(moved, inverse, { affinity }),
              point
            )
          }
          for (const [, path] of Node.nodes(editor)) {
            if (
              operation.type === 'remove_node' &&
              (Path.equals(operation.path, path) ||
                Path.isAncestor(operation.path, path))
            )
              continue
            if (
              operation.type === 'merge_node' &&
              (Path.equals(operation.path, path) ||
                Path.equals(Path.previous(operation.path), path))
            )
              continue
            const moved = Path.transform(path, operation, { affinity })
            assert(moved)
            assert.deepStrictEqual(
              Path.transform(moved, inverse, { affinity }),
              path
            )
          }
        }
        if (available.length) {
          const range = rangeFrom(available, input.index, input.position)
          for (const affinity of rangeAffinities) {
            const moved = Range.transform(range, operation, { affinity })
            assert(moved)
            assert.deepStrictEqual(
              Range.transform(moved, inverse, { affinity }),
              range
            )
          }
        }
      }),
      settings
    )
  })

  it('normalization is idempotent and enforces structural invariants', () => {
    fc.assert(
      fc.property(rawDocument, children => {
        const editor = create(children)
        assertNormalized(editor)
        const before = snapshot(editor)
        Editor.normalize(editor, { force: true })
        assert.deepStrictEqual(snapshot(editor), before)
        assert.deepStrictEqual(editor.operations, [])
      }),
      settings
    )
  })

  it('refs follow every operation in a generated sequence and release themselves', () => {
    fc.assert(
      fc.property(
        document,
        fc.array(command, { minLength: 1, maxLength: 10 }),
        (children, inputs) => {
          const editor = create(children)
          Editor.setNormalizing(editor, false)
          const initialPoints = points(editor)
          const initialPaths = Array.from(
            Node.nodes(editor),
            ([, path]) => path
          )
          const first = inputs[0]
          const point = pick(initialPoints, first.index)
          const path = pick(initialPaths, first.position)
          const range = rangeFrom(initialPoints, first.index, first.position)
          const paths = [...affinities, null].map(affinity => ({
            ref: Editor.pathRef(editor, path, { affinity }),
            expected: path as Path | null,
            affinity,
          }))
          const pointRefs = [...affinities, null].map(affinity => ({
            ref: Editor.pointRef(editor, point, { affinity }),
            expected: point as Point | null,
            affinity,
          }))
          const ranges = [...rangeAffinities, null].map(affinity => ({
            ref: Editor.rangeRef(editor, range, { affinity }),
            expected: range as Range | null,
            affinity,
          }))
          for (const input of inputs) {
            const operation = operationFor(editor, input)
            if (!operation) continue
            for (const entry of paths) {
              entry.expected =
                entry.expected &&
                Path.transform(entry.expected, operation, {
                  affinity: entry.affinity,
                })
            }
            for (const entry of pointRefs) {
              entry.expected =
                entry.expected &&
                Point.transform(entry.expected, operation, {
                  affinity: entry.affinity,
                })
            }
            for (const entry of ranges) {
              entry.expected =
                entry.expected &&
                Range.transform(entry.expected, operation, {
                  affinity: entry.affinity,
                })
            }
            editor.apply(operation)
            for (const { ref, expected } of [
              ...paths,
              ...pointRefs,
              ...ranges,
            ]) {
              assert.deepStrictEqual(ref.current, expected)
            }
          }
          for (const { ref, expected } of [...paths, ...pointRefs, ...ranges]) {
            assert.deepStrictEqual(ref.unref(), expected)
            assert.strictEqual(ref.current, null)
          }
          assert.strictEqual(Editor.pathRefs(editor).size, 0)
          assert.strictEqual(Editor.pointRefs(editor).size, 0)
          assert.strictEqual(Editor.rangeRefs(editor).size, 0)
        }
      ),
      settings
    )
  })

  it('strings and character positions agree at each block grapheme boundary', () => {
    fc.assert(
      fc.property(document, children => {
        const editor = create(children)
        assert.strictEqual(
          Editor.string(editor, [], { voids: true }),
          Node.string(editor)
        )
        const expected: Point[] = []
        for (const [block, path] of Editor.nodes(editor, {
          at: [],
          voids: true,
          match: node =>
            !Editor.isEditor(node) &&
            !Text.isText(node) &&
            !editor.isInline(node) &&
            Editor.hasInlines(editor, node),
        })) {
          const leaves = Array.from(Node.texts(block), ([node, relative]) => ({
            text: node.text,
            path: path.concat(relative),
          }))
          const content = leaves.map(leaf => leaf.text).join('')
          assert.strictEqual(Node.string(block), content)
          assert.strictEqual(
            Editor.string(editor, path, { voids: true }),
            content
          )
          const boundaries = [
            0,
            ...Array.from(
              new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(
                content
              ),
              part => part.index + part.segment.length
            ),
          ]
          for (const offset of boundaries) {
            let consumed = 0
            const leaf = leaves.find(leaf => {
              if (offset <= consumed + leaf.text.length) return true
              consumed += leaf.text.length
              return false
            })!
            expected.push({ path: leaf.path, offset: offset - consumed })
          }
        }
        const actual = Array.from(
          Editor.positions(editor, { at: [], unit: 'character', voids: true })
        )
        assert.deepStrictEqual(actual, expected)
        for (let index = 1; index < actual.length; index++) {
          assert.strictEqual(
            Point.compare(actual[index - 1], actual[index]),
            -1
          )
        }
        const reverse = Array.from(
          Editor.positions(editor, {
            at: [],
            unit: 'character',
            voids: true,
            reverse: true,
          })
        )
        assert.deepStrictEqual(
          reverse.map(point =>
            Editor.string(
              editor,
              { anchor: Editor.start(editor, []), focus: point },
              { voids: true }
            )
          ),
          actual
            .map(point =>
              Editor.string(
                editor,
                { anchor: Editor.start(editor, []), focus: point },
                { voids: true }
              )
            )
            .reverse()
        )
      }),
      settings
    )
  })

  it('loose text equality agrees with an independent mark comparison', () => {
    fc.assert(
      fc.property(
        text,
        text,
        shortText,
        fc.boolean(),
        (left, other, content, sameMarks) => {
          const right = sameMarks
            ? { ...structuredClone(left), text: content }
            : other
          assert.strictEqual(
            Text.equals(left, right, { loose: true }),
            isEqual(marks(left), marks(right))
          )
        }
      ),
      settings
    )
  })
})
