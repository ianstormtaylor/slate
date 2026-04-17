/* eslint-disable no-console */
const { performance } = require('node:perf_hooks')
const { createEditor, Editor, Element, Transforms } = require('../../src')

const DEFAULT_BLOCKS = 5000
const DEFAULT_GROUP_SIZE = 50
const DEFAULT_INSERT_COUNT = 2000
const DEFAULT_MOVE_COUNT = 2000
const DEFAULT_TEXT_COUNT = 2000
const DEFAULT_STRUCTURAL_COUNT = 1000
const DEFAULT_REPEATS = 3
const DEFAULT_WARMUPS = 1

const parseNumberArg = (name, fallback) => {
  const prefix = `--${name}=`
  const value = process.argv.find(arg => arg.startsWith(prefix))
  if (!value) return fallback
  const parsed = Number(value.slice(prefix.length))
  return Number.isFinite(parsed) ? parsed : fallback
}

const buildFlatValue = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'paragraph',
    children: [{ text: `Block ${index}` }],
  }))

const buildGroupedValue = (blockCount, groupSize) => {
  const groupCount = Math.ceil(blockCount / groupSize)

  return Array.from({ length: groupCount }, (_, groupIndex) => ({
    type: 'section',
    children: Array.from(
      { length: Math.min(groupSize, blockCount - groupIndex * groupSize) },
      (_, blockIndex) => ({
        type: 'paragraph',
        children: [{ text: `Block ${groupIndex * groupSize + blockIndex}` }],
      })
    ),
  }))
}

const createEditorWithValue = value => {
  const editor = createEditor()
  editor.children = value
  return editor
}

const collectParagraphPaths = editor =>
  Array.from(
    Editor.nodes(editor, {
      at: [],
      match: node => Element.isElement(node) && node.type === 'paragraph',
      mode: 'lowest',
      voids: true,
    }),
    ([, path]) => path
  )

const median = values => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

const benchmarks = [
  {
    id: 'setnodes-flat',
    setup({ blocks }) {
      const editor = createEditorWithValue(buildFlatValue(blocks))
      return { editor, paths: collectParagraphPaths(editor) }
    },
    run({ editor, paths }) {
      paths.forEach((path, index) => {
        Transforms.setNodes(editor, { id: `id-${index}` }, { at: path })
      })
    },
  },
  {
    id: 'setnodes-grouped',
    setup({ blocks, groupSize }) {
      const editor = createEditorWithValue(buildGroupedValue(blocks, groupSize))
      return { editor, paths: collectParagraphPaths(editor) }
    },
    run({ editor, paths }) {
      paths.forEach((path, index) => {
        Transforms.setNodes(editor, { id: `id-${index}` }, { at: path })
      })
    },
  },
  {
    id: 'insertnodes-append-empty',
    setup() {
      return { editor: createEditorWithValue([]) }
    },
    run({ editor }, { insertCount }) {
      for (let index = 0; index < insertCount; index++) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: `Inserted ${index}` }] },
          { at: [index] }
        )
      }
    },
  },
  {
    id: 'insertnodes-prepend-empty',
    setup() {
      return { editor: createEditorWithValue([]) }
    },
    run({ editor }, { insertCount }) {
      for (let index = 0; index < insertCount; index++) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: `Inserted ${index}` }] },
          { at: [0] }
        )
      }
    },
  },
  {
    id: 'movenodes-flat',
    setup({ moveCount }) {
      const editor = createEditorWithValue(buildFlatValue(moveCount))
      return { editor }
    },
    run({ editor }, { moveCount }) {
      for (let index = 1; index < moveCount; index++) {
        Transforms.moveNodes(editor, { at: [index], to: [0] })
      }
    },
  },
  {
    id: 'inserttext-single-block',
    setup() {
      const editor = createEditorWithValue([
        { type: 'paragraph', children: [{ text: '' }] },
      ])
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      }
      return { editor }
    },
    run({ editor }, { textCount }) {
      for (let index = 0; index < textCount; index++) {
        editor.insertText('x')
      }
    },
  },
  {
    id: 'removenodes-flat',
    setup({ structuralCount }) {
      const editor = createEditorWithValue(buildFlatValue(structuralCount))
      return { editor }
    },
    run({ editor }, { structuralCount }) {
      for (let index = structuralCount - 1; index >= 0; index--) {
        Transforms.removeNodes(editor, { at: [index] })
      }
    },
  },
  {
    id: 'paste-like-lines',
    setup() {
      const editor = createEditorWithValue([
        { type: 'paragraph', children: [{ text: '' }] },
      ])
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      }
      return { editor }
    },
    run({ editor }, { structuralCount }) {
      let split = false

      for (let index = 0; index < structuralCount; index++) {
        if (split) {
          Transforms.splitNodes(editor, { always: true })
        }

        editor.insertText(`Line ${index}`)
        split = true
      }
    },
  },
]

const main = async () => {
  const blocks = parseNumberArg('blocks', DEFAULT_BLOCKS)
  const groupSize = parseNumberArg('group-size', DEFAULT_GROUP_SIZE)
  const insertCount = parseNumberArg('insert-count', DEFAULT_INSERT_COUNT)
  const moveCount = parseNumberArg('move-count', DEFAULT_MOVE_COUNT)
  const textCount = parseNumberArg('text-count', DEFAULT_TEXT_COUNT)
  const structuralCount = parseNumberArg(
    'structural-count',
    DEFAULT_STRUCTURAL_COUNT
  )
  const repeats = parseNumberArg('repeats', DEFAULT_REPEATS)

  const results = []

  for (const benchmark of benchmarks) {
    for (let i = 0; i < DEFAULT_WARMUPS; i++) {
      const input = benchmark.setup({
        blocks,
        groupSize,
        moveCount,
        structuralCount,
      })
      benchmark.run(input, {
        insertCount,
        moveCount,
        textCount,
        structuralCount,
      })
    }

    const durations = []

    for (let i = 0; i < repeats; i++) {
      const input = benchmark.setup({
        blocks,
        groupSize,
        moveCount,
        structuralCount,
      })
      const start = performance.now()
      benchmark.run(input, {
        insertCount,
        moveCount,
        textCount,
        structuralCount,
      })
      durations.push(performance.now() - start)
    }

    results.push({
      id: benchmark.id,
      durationMs: Number(median(durations).toFixed(2)),
    })
  }

  console.table(results)
  console.log(
    JSON.stringify(
      {
        blocks,
        groupSize,
        insertCount,
        moveCount,
        textCount,
        structuralCount,
        repeats,
        results,
      },
      null,
      2
    )
  )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
