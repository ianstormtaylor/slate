/* eslint-disable no-console */
const { performance } = require('node:perf_hooks')

const { createEditor, Editor, Element, Node, Transforms } = require('../../src')
const {
  finalizeOperation,
  transformOperationRefs,
  updateOperationDirtyPaths,
} = require('../../src/core/apply')
const {
  clearExactSetNodeDraft,
  commitExactSetNodeDraft,
  materializeExactSetNodeDraft,
  stageExactSetNodeOperation,
} = require('../../src/core/children')
const { modifyDescendant } = require('../../src/utils/modify')
const { BATCH_DEPTH } = require('../../src/utils/weak-maps')

const DEFAULT_BLOCKS = 5000
const DEFAULT_GROUP_SIZE = 50
const DEFAULT_REPEATS = 5

const waitForMicrotasks = () => Promise.resolve()

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
      {
        length: Math.min(groupSize, blockCount - groupIndex * groupSize),
      },
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

const createSetNodeOps = targetPaths =>
  targetPaths.map((path, index) => ({
    type: 'set_node',
    path,
    properties: {},
    newProperties: { id: `id-${index}` },
  }))

const createInsertNodeOps = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'insert_node',
    path: [index],
    node: {
      type: 'paragraph',
      children: [{ text: `Inserted ${index}` }],
    },
  }))

const collectTargetPaths = editor =>
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

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

const assertEquivalentChildren = (label, received, expected) => {
  const receivedJson = JSON.stringify(received)
  const expectedJson = JSON.stringify(expected)

  if (receivedJson !== expectedJson) {
    throw new Error(
      `${label} produced different children.\nreceived: ${receivedJson}\nexpected: ${expectedJson}`
    )
  }
}

const verifyBatchPrototype = () => {
  const cases = [
    {
      label: 'flat',
      value: buildFlatValue(8),
      targetPaths: [[0], [3], [5], [7]],
    },
    {
      label: 'grouped',
      value: buildGroupedValue(12, 3),
      targetPaths: [
        [0, 0],
        [0, 2],
        [1, 1],
        [3, 2],
      ],
    },
  ]

  for (const testCase of cases) {
    const exactOps = createSetNodeOps(testCase.targetPaths)
    const baselineEditor = createEditorWithValue(
      JSON.parse(JSON.stringify(testCase.value))
    )
    const batchedEditor = createEditorWithValue(
      JSON.parse(JSON.stringify(testCase.value))
    )

    Editor.withoutNormalizing(baselineEditor, () => {
      exactOps.forEach(op => {
        baselineEditor.apply(op)
      })
    })

    Transforms.applyBatch(batchedEditor, createSetNodeOps(testCase.targetPaths))

    assertEquivalentChildren(
      `applyBatch(${testCase.label})`,
      batchedEditor.children,
      baselineEditor.children
    )
  }
}

const rewriteFlatChildren = editor => {
  editor.children = editor.children.map((node, index) => ({
    ...node,
    id: `id-${index}`,
  }))
}

const rewriteGroupedChildren = editor => {
  let index = 0

  editor.children = editor.children.map(group => ({
    ...group,
    children: group.children.map(node => {
      const nextNode = {
        ...node,
        id: `id-${index}`,
      }
      index++
      return nextNode
    }),
  }))
}

const timeExactSetNodeBreakdown = ({
  benchmark,
  blockCount,
  groupSize,
  repeats,
}) => {
  if (!benchmark.breakdown) {
    return null
  }

  const phaseFactories = {
    refs:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          transformOperationRefs(editor, op)
        }
      },
    dirtyPaths:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          updateOperationDirtyPaths(editor, op)
        }
      },
    stage:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          stageExactSetNodeOperation(editor, op)
        }
      },
    finalize:
      ({ editor, ops }) =>
      () => {
        BATCH_DEPTH.set(editor, 1)

        try {
          for (const op of ops) {
            finalizeOperation(editor, op)
          }
        } finally {
          BATCH_DEPTH.delete(editor)
        }
      },
    materialize: ({ editor, ops }) => {
      for (const op of ops) {
        stageExactSetNodeOperation(editor, op)
      }

      return () => {
        materializeExactSetNodeDraft(editor)
      }
    },
    commit: ({ editor, ops }) => {
      for (const op of ops) {
        stageExactSetNodeOperation(editor, op)
      }

      return () => {
        commitExactSetNodeDraft(editor)
      }
    },
  }

  const breakdown = {}

  for (const phase of benchmark.breakdown) {
    const durations = []

    for (let repeat = 0; repeat < repeats; repeat++) {
      const editor = createEditorWithValue(
        benchmark.shape === 'flat'
          ? buildFlatValue(blockCount)
          : buildGroupedValue(blockCount, groupSize)
      )
      const targetPaths = collectTargetPaths(editor)
      const ops = createSetNodeOps(targetPaths)
      const run = phaseFactories[phase]({ editor, ops })
      const start = performance.now()

      run()

      durations.push(performance.now() - start)
      clearExactSetNodeDraft(editor)
    }

    breakdown[phase] = Number(median(durations).toFixed(2))
  }

  return breakdown
}

const runScenario = async ({ benchmark, blockCount, groupSize, repeats }) => {
  const runs = []

  for (let repeat = 0; repeat < repeats; repeat++) {
    const editor = createEditorWithValue(
      benchmark.shape === 'flat'
        ? buildFlatValue(blockCount)
        : benchmark.shape === 'grouped'
        ? buildGroupedValue(blockCount, groupSize)
        : []
    )
    const targetPaths = collectTargetPaths(editor)

    const start = performance.now()
    benchmark.run({ blockCount, editor, targetPaths })
    const durationMs = performance.now() - start

    await waitForMicrotasks()

    runs.push({
      durationMs,
    })
  }

  return {
    durationMs: median(runs.map(run => run.durationMs)),
    breakdown: timeExactSetNodeBreakdown({
      benchmark,
      blockCount,
      groupSize,
      repeats,
    }),
  }
}

const benchmarks = [
  {
    id: 'setnodes-flat',
    label: 'Transforms.setNodes per path',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      targetPaths.forEach((path, index) => {
        Transforms.setNodes(editor, { id: `id-${index}` }, { at: path })
      })
    },
  },
  {
    id: 'setnodes-flat-no-normalize',
    label: 'Transforms.setNodes per path inside Editor.withoutNormalizing',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Editor.withoutNormalizing(editor, () => {
        targetPaths.forEach((path, index) => {
          Transforms.setNodes(editor, { id: `id-${index}` }, { at: path })
        })
      })
    },
  },
  {
    id: 'apply-flat-no-normalize',
    label: 'editor.apply(set_node) per path inside Editor.withoutNormalizing',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Editor.withoutNormalizing(editor, () => {
        targetPaths.forEach((path, index) => {
          editor.apply({
            type: 'set_node',
            path,
            properties: {},
            newProperties: { id: `id-${index}` },
          })
        })
      })
    },
  },
  {
    id: 'apply-batch-flat',
    label: 'Transforms.applyBatch exact-path set_node batch',
    shape: 'flat',
    breakdown: [
      'refs',
      'dirtyPaths',
      'stage',
      'finalize',
      'materialize',
      'commit',
    ],
    run: ({ editor, targetPaths }) => {
      Transforms.applyBatch(
        editor,
        targetPaths.map((path, index) => ({
          type: 'set_node',
          path,
          properties: {},
          newProperties: { id: `id-${index}` },
        }))
      )
    },
  },
  {
    id: 'apply-batch-flat-mixed-insert-tail',
    label: 'Transforms.applyBatch exact-path set_node batch plus tail insert',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        {
          type: 'insert_node',
          path: [blockCount],
          node: { type: 'paragraph', children: [{ text: 'tail' }] },
        },
      ])
    },
  },
  {
    id: 'modify-flat',
    label: 'modifyDescendant per path',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      targetPaths.forEach((path, index) => {
        modifyDescendant(editor, path, node => ({ ...node, id: `id-${index}` }))
      })
    },
  },
  {
    id: 'modify-grouped',
    label: 'modifyDescendant per path on grouped document',
    shape: 'grouped',
    run: ({ editor, targetPaths }) => {
      targetPaths.forEach((path, index) => {
        modifyDescendant(editor, path, node => ({ ...node, id: `id-${index}` }))
      })
    },
  },
  {
    id: 'mutate-flat',
    label: 'direct node mutation per path',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      targetPaths.forEach((path, index) => {
        Node.get(editor, path).id = `id-${index}`
      })
    },
  },
  {
    id: 'rewrite-flat',
    label: 'single-pass rewrite of top-level children',
    shape: 'flat',
    run: ({ editor }) => {
      rewriteFlatChildren(editor)
    },
  },
  {
    id: 'rewrite-grouped',
    label: 'single-pass rewrite of grouped children',
    shape: 'grouped',
    run: ({ editor }) => {
      rewriteGroupedChildren(editor)
    },
  },
  {
    id: 'apply-insert-empty-no-normalize',
    label:
      'editor.apply(insert_node) batch on empty document inside Editor.withoutNormalizing',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      const ops = createInsertNodeOps(blockCount)

      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-insert-empty',
    label: 'Transforms.applyBatch insert_node batch on empty document',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      Transforms.applyBatch(editor, createInsertNodeOps(blockCount))
    },
  },
  {
    id: 'setnodes-grouped',
    label: 'Transforms.setNodes per path on grouped document',
    shape: 'grouped',
    run: ({ editor, targetPaths }) => {
      targetPaths.forEach((path, index) => {
        Transforms.setNodes(editor, { id: `id-${index}` }, { at: path })
      })
    },
  },
  {
    id: 'apply-grouped-no-normalize',
    label:
      'editor.apply(set_node) per path inside Editor.withoutNormalizing on grouped document',
    shape: 'grouped',
    run: ({ editor, targetPaths }) => {
      Editor.withoutNormalizing(editor, () => {
        targetPaths.forEach((path, index) => {
          editor.apply({
            type: 'set_node',
            path,
            properties: {},
            newProperties: { id: `id-${index}` },
          })
        })
      })
    },
  },
  {
    id: 'apply-batch-grouped',
    label:
      'Transforms.applyBatch exact-path set_node batch on grouped document',
    shape: 'grouped',
    breakdown: [
      'refs',
      'dirtyPaths',
      'stage',
      'finalize',
      'materialize',
      'commit',
    ],
    run: ({ editor, targetPaths }) => {
      Transforms.applyBatch(
        editor,
        targetPaths.map((path, index) => ({
          type: 'set_node',
          path,
          properties: {},
          newProperties: { id: `id-${index}` },
        }))
      )
    },
  },
]

const main = async () => {
  verifyBatchPrototype()

  const blockCount = parseNumberArg('blocks', DEFAULT_BLOCKS)
  const groupSize = parseNumberArg('group-size', DEFAULT_GROUP_SIZE)
  const repeats = parseNumberArg('repeats', DEFAULT_REPEATS)
  const results = []

  for (const benchmark of benchmarks) {
    const result = await runScenario({
      benchmark,
      blockCount,
      groupSize,
      repeats,
    })

    results.push({
      id: benchmark.id,
      label: benchmark.label,
      shape: benchmark.shape,
      durationMs: Number(result.durationMs.toFixed(2)),
      breakdown: result.breakdown,
    })
  }

  console.table(results.map(({ breakdown, ...result }) => result))

  const breakdownRows = results
    .filter(result => result.breakdown)
    .map(result => ({
      id: result.id,
      shape: result.shape,
      ...result.breakdown,
    }))

  if (breakdownRows.length > 0) {
    console.table(breakdownRows)
  }

  console.log(
    JSON.stringify(
      {
        blockCount,
        groupSize,
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
