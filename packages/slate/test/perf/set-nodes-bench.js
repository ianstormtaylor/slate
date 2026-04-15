/* eslint-disable no-console */
const { performance } = require('node:perf_hooks')

const {
  createEditor,
  Editor,
  Element,
  Node,
  Transforms,
  wrapApply,
} = require('../../src')
const {
  finalizeOperation,
  transformOperationRefs,
  transformOperationSelection,
  updateOperationDirtyPaths,
} = require('../../src/core/apply-operation')
const {
  clearExactSetNodeDraft,
  commitExactSetNodeDraft,
  materializeExactSetNodeDraft,
  stageExactSetNodeOperation,
} = require('../../src/core/children')
const {
  clearQueuedBatchNormalize,
  withBatchTrace,
} = require('../../src/core/batch')
const { modifyDescendant } = require('../../src/utils/modify')
const { BATCH_DEPTH } = require('../../src/utils/weak-maps')

const DEFAULT_BLOCKS = 5000
const DEFAULT_GROUP_SIZE = 50
const DEFAULT_REPEATS = 5
const DEFAULT_WARMUPS = 1

const waitForMicrotasks = () => Promise.resolve()

const parseListArg = name => {
  const prefix = `--${name}=`
  const value = process.argv.find(arg => arg.startsWith(prefix))

  if (!value) return null

  return value
    .slice(prefix.length)
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
}

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

const buildFlatValueWithMergedTexts = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'paragraph',
    children: [{ text: `Block ` }, { text: `${index}` }],
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

const buildDeepValue = (blockCount, groupSize) => {
  const columnCount = 5
  const paragraphsPerColumn = Math.max(1, Math.floor(groupSize / columnCount))
  const paragraphsPerSection = columnCount * paragraphsPerColumn
  const sectionCount = Math.ceil(blockCount / paragraphsPerSection)
  let nextIndex = 0

  return Array.from({ length: sectionCount }, (_, sectionIndex) => ({
    type: 'section',
    sectionIndex,
    children: Array.from({ length: columnCount }, (_, columnIndex) => ({
      type: 'column',
      columnIndex,
      children: Array.from({ length: paragraphsPerColumn }, () => {
        if (nextIndex >= blockCount) {
          return null
        }

        const blockIndex = nextIndex
        nextIndex++

        return {
          type: 'paragraph',
          children: [{ text: `Block ${blockIndex}` }],
        }
      }).filter(Boolean),
    })).filter(column => column.children.length > 0),
  }))
}

const createEditorWithValue = value => {
  const editor = createEditor()
  editor.children = value
  return editor
}

const createBenchmarkEditor = ({ benchmark, blockCount, groupSize }) =>
  benchmark.createEditor
    ? benchmark.createEditor({ blockCount, groupSize })
    : createEditorWithValue(
        benchmark.shape === 'flat'
          ? buildFlatValue(blockCount)
          : benchmark.shape === 'grouped'
          ? buildGroupedValue(blockCount, groupSize)
          : benchmark.shape === 'deep'
          ? buildDeepValue(blockCount, groupSize)
          : []
      )

const prepareBenchmark = ({ benchmark, blockCount, editor, groupSize }) => {
  const targetPaths = collectTargetPaths(editor)
  const prepared = benchmark.prepare
    ? benchmark.prepare({ blockCount, editor, groupSize, targetPaths })
    : undefined

  return { prepared, targetPaths }
}

const createSetNodeOps = targetPaths =>
  targetPaths.map((path, index) => ({
    type: 'set_node',
    path,
    properties: {},
    newProperties: { id: `id-${index}` },
  }))

const createDuplicateSetNodeOps = targetPaths =>
  targetPaths.flatMap((path, index) => [
    {
      type: 'set_node',
      path,
      properties: {},
      newProperties: { id: `id-${index}-a` },
    },
    {
      type: 'set_node',
      path,
      properties: {},
      newProperties: { id: `id-${index}-b` },
    },
  ])

const createInsertNodeOps = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'insert_node',
    path: [index],
    node: {
      type: 'paragraph',
      children: [{ text: `Inserted ${index}` }],
    },
  }))

const createPrependInsertNodeOps = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'insert_node',
    path: [0],
    node: {
      type: 'paragraph',
      children: [{ text: `Inserted ${index}` }],
    },
  }))

const createInterleavedInsertMoveOps = blockCount => {
  const ops = [
    {
      type: 'insert_node',
      path: [0],
      node: {
        type: 'paragraph',
        children: [{ text: 'Inserted 0' }],
      },
    },
  ]

  for (let index = 1; index < blockCount; index++) {
    ops.push({
      type: 'insert_node',
      path: [index],
      node: {
        type: 'paragraph',
        children: [{ text: `Inserted ${index}` }],
      },
    })
    ops.push({
      type: 'move_node',
      path: [index],
      newPath: [0],
    })
  }

  return ops
}

const createRemoveNodeOps = children =>
  children
    .map((node, index) => ({
      type: 'remove_node',
      path: [index],
      node: JSON.parse(JSON.stringify(node)),
    }))
    .reverse()

const createMoveNodeOps = blockCount =>
  Array.from({ length: Math.max(blockCount - 1, 0) }, (_, index) => ({
    type: 'move_node',
    path: [index + 1],
    newPath: [0],
  }))

const createMergeNodeOps = blockCount =>
  Array.from({ length: blockCount }, (_, index) => ({
    type: 'merge_node',
    path: [index, 1],
    position: 6,
    properties: {},
  }))

const createSplitNodeOps = targetPaths =>
  targetPaths.map(path => ({
    type: 'split_node',
    path: path.concat(0),
    position: 1,
    properties: {},
  }))

const createInsertTextOps = targetPaths =>
  targetPaths.map(path => ({
    type: 'insert_text',
    path: path.concat(0),
    offset: 1,
    text: 'X',
  }))

const createPasteLines = blockCount =>
  Array.from({ length: blockCount }, (_, index) => `Line ${index}`)

const createPasteEditor = () => {
  const editor = createEditorWithValue([
    { type: 'paragraph', children: [{ text: '' }] },
  ])

  editor.selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  }

  return editor
}

const insertPasteLines = (editor, lines) => {
  let split = false

  for (const line of lines) {
    if (split) {
      Transforms.splitNodes(editor, { always: true })
    }

    editor.insertText(line)
    split = true
  }
}

const installReadAfterEachObserver = editor => {
  const { apply } = editor

  editor.apply = op => {
    apply(op)
    editor.children
  }
}

const installReadAfterEachWrapper = editor => {
  wrapApply(editor, apply => op => {
    apply(op)
    editor.children
  })
}

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
    const duplicateExactOps = createDuplicateSetNodeOps(testCase.targetPaths)
    const baselineEditor = createEditorWithValue(
      JSON.parse(JSON.stringify(testCase.value))
    )
    const batchedEditor = createEditorWithValue(
      JSON.parse(JSON.stringify(testCase.value))
    )
    const duplicateBaselineEditor = createEditorWithValue(
      JSON.parse(JSON.stringify(testCase.value))
    )
    const duplicateBatchedEditor = createEditorWithValue(
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

    Editor.withoutNormalizing(duplicateBaselineEditor, () => {
      duplicateExactOps.forEach(op => {
        duplicateBaselineEditor.apply(op)
      })
    })

    Transforms.applyBatch(
      duplicateBatchedEditor,
      createDuplicateSetNodeOps(testCase.targetPaths)
    )

    assertEquivalentChildren(
      `applyBatch duplicate(${testCase.label})`,
      duplicateBatchedEditor.children,
      duplicateBaselineEditor.children
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
    selection:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          transformOperationSelection(editor, op)
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

const timeOperationLoopBreakdown = ({
  benchmark,
  blockCount,
  groupSize,
  repeats,
}) => {
  if (!benchmark.loopBreakdown) {
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
    selection:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          transformOperationSelection(editor, op)
        }
      },
    dirtyPaths:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          updateOperationDirtyPaths(editor, op)
        }
      },
    transform:
      ({ editor, ops }) =>
      () => {
        for (const op of ops) {
          Transforms.transform(editor, op)
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
  }

  const breakdown = {}

  for (const phase of benchmark.loopBreakdown) {
    const durations = []

    for (let repeat = 0; repeat < repeats; repeat++) {
      const editor = createBenchmarkEditor({
        benchmark,
        blockCount,
        groupSize,
      })
      const { prepared, targetPaths } = prepareBenchmark({
        benchmark,
        blockCount,
        editor,
        groupSize,
      })
      const ops = benchmark.getBreakdownOps
        ? benchmark.getBreakdownOps({
            blockCount,
            editor,
            groupSize,
            prepared,
            targetPaths,
          })
        : prepared
      const run = phaseFactories[phase]({ editor, ops })
      const start = performance.now()

      run()

      durations.push(performance.now() - start)
    }

    breakdown[phase] = Number(median(durations).toFixed(2))
  }

  return breakdown
}

const timeBatchExitBreakdown = ({
  benchmark,
  blockCount,
  groupSize,
  repeats,
}) => {
  if (!benchmark.batchExitBreakdown) {
    return null
  }

  const breakdown = {}

  for (const phase of benchmark.batchExitBreakdown) {
    const durations = []

    for (let repeat = 0; repeat < repeats; repeat++) {
      const editor = createBenchmarkEditor({
        benchmark,
        blockCount,
        groupSize,
      })
      const { prepared, targetPaths } = prepareBenchmark({
        benchmark,
        blockCount,
        editor,
        groupSize,
      })
      const phaseStarts = new Map()
      const phaseTotals = new Map()

      withBatchTrace(
        editor,
        {
          onPhaseEnd(tracedPhase) {
            const start = phaseStarts.get(tracedPhase)

            if (start == null) {
              return
            }

            phaseTotals.set(
              tracedPhase,
              (phaseTotals.get(tracedPhase) ?? 0) + performance.now() - start
            )
            phaseStarts.delete(tracedPhase)
          },
          onPhaseStart(tracedPhase) {
            phaseStarts.set(tracedPhase, performance.now())
          },
        },
        () => {
          benchmark.run({ blockCount, editor, prepared, targetPaths })
        }
      )

      durations.push(phaseTotals.get(phase) ?? 0)
    }

    breakdown[phase] = Number(median(durations).toFixed(2))
  }

  return breakdown
}

const runScenario = async ({ benchmark, blockCount, groupSize, repeats }) => {
  for (let warmup = 0; warmup < DEFAULT_WARMUPS; warmup++) {
    const editor = createBenchmarkEditor({
      benchmark,
      blockCount,
      groupSize,
    })
    const { prepared, targetPaths } = prepareBenchmark({
      benchmark,
      blockCount,
      editor,
      groupSize,
    })

    benchmark.run({ blockCount, editor, prepared, targetPaths })
    await waitForMicrotasks()
  }

  const runs = []

  for (let repeat = 0; repeat < repeats; repeat++) {
    const editor = createBenchmarkEditor({
      benchmark,
      blockCount,
      groupSize,
    })
    const { prepared, targetPaths } = prepareBenchmark({
      benchmark,
      blockCount,
      editor,
      groupSize,
    })

    const start = performance.now()
    benchmark.run({ blockCount, editor, prepared, targetPaths })
    const durationMs = performance.now() - start

    await waitForMicrotasks()

    runs.push({
      durationMs,
    })
  }

  return {
    durationMs: median(runs.map(run => run.durationMs)),
    breakdown: {
      ...(timeExactSetNodeBreakdown({
        benchmark,
        blockCount,
        groupSize,
        repeats,
      }) ?? {}),
      ...(timeBatchExitBreakdown({
        benchmark,
        blockCount,
        groupSize,
        repeats,
      }) ?? {}),
      ...(timeOperationLoopBreakdown({
        benchmark,
        blockCount,
        groupSize,
        repeats,
      }) ?? {}),
    },
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
    id: 'with-batch-flat',
    label: 'Editor.withBatch exact-path set_node manual apply loop',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Editor.withBatch(editor, () => {
        createSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-duplicate',
    label: 'Transforms.applyBatch duplicate-path set_node batch',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Transforms.applyBatch(editor, createDuplicateSetNodeOps(targetPaths))
    },
  },
  {
    id: 'with-batch-flat-duplicate',
    label: 'Editor.withBatch duplicate-path set_node manual apply loop',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Editor.withBatch(editor, () => {
        createDuplicateSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-observe-each',
    label:
      'Transforms.applyBatch exact-path set_node batch with read-after-each observation',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      installReadAfterEachObserver(editor)
      Transforms.applyBatch(editor, createSetNodeOps(targetPaths))
    },
  },
  {
    id: 'with-batch-flat-observe-each',
    label:
      'Editor.withBatch exact-path set_node manual apply loop with read-after-each observation',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      installReadAfterEachObserver(editor)
      Editor.withBatch(editor, () => {
        createSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-wrapper-read',
    label:
      'Transforms.applyBatch exact-path set_node batch with wrapper read-after-each observation',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      installReadAfterEachWrapper(editor)
      Transforms.applyBatch(editor, createSetNodeOps(targetPaths))
    },
  },
  {
    id: 'with-batch-flat-wrapper-read',
    label:
      'Editor.withBatch exact-path set_node manual apply loop with wrapper read-after-each observation',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      installReadAfterEachWrapper(editor)
      Editor.withBatch(editor, () => {
        createSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-deep-no-normalize',
    label:
      'editor.apply(set_node) per path inside Editor.withoutNormalizing on deep document',
    shape: 'deep',
    run: ({ editor, targetPaths }) => {
      Editor.withoutNormalizing(editor, () => {
        createSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-deep',
    label: 'Transforms.applyBatch exact-path set_node batch on deep document',
    shape: 'deep',
    run: ({ editor, targetPaths }) => {
      Transforms.applyBatch(editor, createSetNodeOps(targetPaths))
    },
  },
  {
    id: 'with-batch-deep',
    label: 'Editor.withBatch exact-path set_node loop on deep document',
    shape: 'deep',
    run: ({ editor, targetPaths }) => {
      Editor.withBatch(editor, () => {
        createSetNodeOps(targetPaths).forEach(op => {
          editor.apply(op)
        })
      })
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
    id: 'apply-batch-flat-mixed-set-move',
    label:
      'Transforms.applyBatch exact-path set_node batch plus move_node batch',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
      ])
    },
  },
  {
    id: 'apply-batch-flat-mixed-set-merge',
    label:
      'Transforms.applyBatch exact-path set_node batch plus merge_node batch',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createMergeNodeOps(blockCount),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-set-merge',
    label: 'Editor.withBatch exact-path set_node loop plus merge_node loop',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createMergeNodeOps(blockCount),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-set-split',
    label:
      'Transforms.applyBatch exact-path set_node batch plus split_node batch',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createSplitNodeOps(targetPaths),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-set-split',
    label: 'Editor.withBatch exact-path set_node loop plus split_node loop',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createSplitNodeOps(targetPaths),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-move-merge',
    label: 'Transforms.applyBatch move_node batch plus merge_node batch',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor }) => {
      Transforms.applyBatch(editor, [
        ...createMoveNodeOps(blockCount),
        ...createMergeNodeOps(blockCount),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-move-merge',
    label: 'Editor.withBatch move_node loop plus merge_node loop',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor }) => {
      const ops = [
        ...createMoveNodeOps(blockCount),
        ...createMergeNodeOps(blockCount),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-move-split',
    label: 'Transforms.applyBatch move_node batch plus split_node batch',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createMoveNodeOps(blockCount),
        ...createSplitNodeOps(targetPaths),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-move-split',
    label: 'Editor.withBatch move_node loop plus split_node loop',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createMoveNodeOps(blockCount),
        ...createSplitNodeOps(targetPaths),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-set-move-merge',
    label:
      'Transforms.applyBatch exact-path set_node batch plus move_node batch plus merge_node batch',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
        ...createMergeNodeOps(blockCount),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-set-move-merge',
    label:
      'Editor.withBatch exact-path set_node loop plus move_node loop plus merge_node loop',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
        ...createMergeNodeOps(blockCount),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-set-move-split',
    label:
      'Transforms.applyBatch exact-path set_node batch plus move_node batch plus split_node batch',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
        ...createSplitNodeOps(targetPaths),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-set-move-split',
    label:
      'Editor.withBatch exact-path set_node loop plus move_node loop plus split_node loop',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
        ...createSplitNodeOps(targetPaths),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'with-batch-flat-mixed-set-move',
    label: 'Editor.withBatch exact-path set_node loop plus move_node loop',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
      ]

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-flat-mixed-set-move-observe-each',
    label:
      'Transforms.applyBatch exact-path set_node batch plus move_node batch with read-after-each observation',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      installReadAfterEachObserver(editor)
      Transforms.applyBatch(editor, [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
      ])
    },
  },
  {
    id: 'with-batch-flat-mixed-set-move-observe-each',
    label:
      'Editor.withBatch exact-path set_node loop plus move_node loop with read-after-each observation',
    shape: 'flat',
    run: ({ blockCount, editor, targetPaths }) => {
      const ops = [
        ...createSetNodeOps(targetPaths),
        ...createMoveNodeOps(blockCount),
      ]

      installReadAfterEachObserver(editor)
      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
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
    id: 'paste-lines',
    label: 'splitNodes plus insertText paste-style line insertion',
    shape: 'paste',
    createEditor: createPasteEditor,
    prepare: ({ blockCount }) => createPasteLines(blockCount),
    run: ({ editor, prepared: lines }) => {
      insertPasteLines(editor, lines)
    },
  },
  {
    id: 'with-batch-paste-lines',
    label: 'Editor.withBatch splitNodes plus insertText paste-style insertion',
    shape: 'paste',
    createEditor: createPasteEditor,
    prepare: ({ blockCount }) => createPasteLines(blockCount),
    run: ({ editor, prepared: lines }) => {
      Editor.withBatch(editor, () => {
        insertPasteLines(editor, lines)
      })
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
    id: 'apply-insert-empty-prepend-no-normalize',
    label:
      'editor.apply(insert_node prepend) batch on empty document inside Editor.withoutNormalizing',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      const ops = createPrependInsertNodeOps(blockCount)

      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-insert-empty-prepend',
    label: 'Transforms.applyBatch insert_node prepend batch on empty document',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      Transforms.applyBatch(editor, createPrependInsertNodeOps(blockCount))
    },
  },
  {
    id: 'apply-interleaved-insert-move-empty-no-normalize',
    label:
      'editor.apply(interleaved insert_node + move_node) on empty document inside Editor.withoutNormalizing',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      const ops = createInterleavedInsertMoveOps(blockCount)

      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-interleaved-insert-move-empty',
    label:
      'Transforms.applyBatch interleaved insert_node + move_node on empty document',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      Transforms.applyBatch(editor, createInterleavedInsertMoveOps(blockCount))
    },
  },
  {
    id: 'with-batch-interleaved-insert-move-empty',
    label:
      'Editor.withBatch interleaved insert_node + move_node loop on empty document',
    shape: 'empty',
    run: ({ blockCount, editor }) => {
      const ops = createInterleavedInsertMoveOps(blockCount)

      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-remove-flat-no-normalize',
    label:
      'editor.apply(remove_node) batch on flat document inside Editor.withoutNormalizing',
    shape: 'flat',
    prepare: ({ editor }) => createRemoveNodeOps(editor.children),
    run: ({ editor, prepared: ops }) => {
      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-remove-flat',
    label: 'Transforms.applyBatch remove_node batch on flat document',
    shape: 'flat',
    prepare: ({ editor }) => createRemoveNodeOps(editor.children),
    run: ({ editor, prepared: ops }) => {
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'apply-move-flat-no-normalize',
    label:
      'editor.apply(move_node) batch on flat document inside Editor.withoutNormalizing',
    shape: 'flat',
    prepare: ({ blockCount }) => createMoveNodeOps(blockCount),
    run: ({ editor, prepared: ops }) => {
      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-move-flat',
    label: 'Transforms.applyBatch move_node batch on flat document',
    shape: 'flat',
    loopBreakdown: ['refs', 'dirtyPaths', 'transform', 'finalize'],
    prepare: ({ blockCount }) => createMoveNodeOps(blockCount),
    run: ({ editor, prepared: ops }) => {
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'apply-merge-flat-no-normalize',
    label:
      'editor.apply(merge_node) batch on flat document inside Editor.withoutNormalizing',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ blockCount }) => createMergeNodeOps(blockCount),
    run: ({ editor, prepared: ops }) => {
      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-merge-flat',
    label: 'Transforms.applyBatch merge_node batch on flat document',
    shape: 'flat-merge',
    loopBreakdown: ['refs', 'dirtyPaths', 'transform', 'finalize'],
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ blockCount }) => createMergeNodeOps(blockCount),
    run: ({ editor, prepared: ops }) => {
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'with-batch-merge-flat',
    label: 'Editor.withBatch merge_node loop on flat document',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ blockCount }) => createMergeNodeOps(blockCount),
    run: ({ editor, prepared: ops }) => {
      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-split-flat-no-normalize',
    label:
      'editor.apply(split_node) batch on flat document inside Editor.withoutNormalizing',
    shape: 'flat',
    prepare: ({ targetPaths }) => createSplitNodeOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      Editor.withoutNormalizing(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-split-flat',
    label: 'Transforms.applyBatch split_node batch on flat document',
    shape: 'flat',
    batchExitBreakdown: [
      'flushBeforeNormalize',
      'commitBeforeNormalize',
      'normalize',
      'flushAfterNormalize',
      'commitAfterNormalize',
    ],
    prepare: ({ targetPaths }) => createSplitNodeOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'with-batch-split-flat',
    label: 'Editor.withBatch split_node loop on flat document',
    shape: 'flat',
    batchExitBreakdown: [
      'flushBeforeNormalize',
      'commitBeforeNormalize',
      'normalize',
      'flushAfterNormalize',
      'commitAfterNormalize',
    ],
    prepare: ({ targetPaths }) => createSplitNodeOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'apply-batch-insert-text-flat',
    label:
      'Transforms.applyBatch insert_text batch on merged-text flat document',
    shape: 'flat-merge',
    loopBreakdown: ['refs', 'selection', 'dirtyPaths', 'transform', 'finalize'],
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ targetPaths }) => createInsertTextOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'apply-batch-insert-text-flat-observe-each',
    label:
      'Transforms.applyBatch insert_text batch with read-after-each observation on merged-text flat document',
    shape: 'flat-merge',
    loopBreakdown: ['refs', 'selection', 'dirtyPaths', 'transform', 'finalize'],
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ targetPaths }) => createInsertTextOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      installReadAfterEachObserver(editor)
      Transforms.applyBatch(editor, ops)
    },
  },
  {
    id: 'with-batch-insert-text-flat',
    label: 'Editor.withBatch insert_text loop on merged-text flat document',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ targetPaths }) => createInsertTextOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
    },
  },
  {
    id: 'with-batch-insert-text-flat-observe-each',
    label:
      'Editor.withBatch insert_text loop with read-after-each observation on merged-text flat document',
    shape: 'flat-merge',
    createEditor: ({ blockCount }) =>
      createEditorWithValue(buildFlatValueWithMergedTexts(blockCount)),
    prepare: ({ targetPaths }) => createInsertTextOps(targetPaths),
    run: ({ editor, prepared: ops }) => {
      installReadAfterEachObserver(editor)
      Editor.withBatch(editor, () => {
        ops.forEach(op => {
          editor.apply(op)
        })
      })
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

const REQUIRED_BENCHMARK_IDS = [
  'apply-flat-no-normalize',
  'apply-grouped-no-normalize',
  'apply-batch-flat',
  'with-batch-flat',
  'apply-batch-grouped',
  'apply-batch-flat-duplicate',
  'with-batch-flat-duplicate',
  'apply-batch-flat-observe-each',
  'with-batch-flat-observe-each',
  'apply-batch-flat-wrapper-read',
  'with-batch-flat-wrapper-read',
  'apply-deep-no-normalize',
  'apply-batch-deep',
  'with-batch-deep',
  'apply-batch-flat-mixed-set-move',
  'with-batch-flat-mixed-set-move',
  'apply-batch-flat-mixed-set-merge',
  'with-batch-flat-mixed-set-merge',
  'apply-batch-flat-mixed-set-split',
  'with-batch-flat-mixed-set-split',
  'apply-batch-flat-mixed-move-merge',
  'with-batch-flat-mixed-move-merge',
  'apply-batch-flat-mixed-move-split',
  'with-batch-flat-mixed-move-split',
  'apply-batch-flat-mixed-set-move-merge',
  'with-batch-flat-mixed-set-move-merge',
  'apply-batch-flat-mixed-set-move-split',
  'with-batch-flat-mixed-set-move-split',
  'apply-batch-flat-mixed-set-move-observe-each',
  'with-batch-flat-mixed-set-move-observe-each',
  'apply-batch-insert-empty',
  'apply-batch-insert-empty-prepend',
  'apply-batch-interleaved-insert-move-empty',
  'with-batch-interleaved-insert-move-empty',
  'modify-flat',
  'modify-grouped',
  'paste-lines',
  'with-batch-paste-lines',
  'apply-batch-remove-flat',
  'apply-batch-move-flat',
  'apply-batch-insert-text-flat',
  'apply-batch-insert-text-flat-observe-each',
  'with-batch-insert-text-flat',
  'with-batch-insert-text-flat-observe-each',
]

const main = async () => {
  verifyBatchPrototype()

  const blockCount = parseNumberArg('blocks', DEFAULT_BLOCKS)
  const groupSize = parseNumberArg('group-size', DEFAULT_GROUP_SIZE)
  const repeats = parseNumberArg('repeats', DEFAULT_REPEATS)
  const include = parseListArg('include')
  const selectedBenchmarks = include
    ? benchmarks.filter(benchmark => include.includes(benchmark.id))
    : benchmarks
  const results = []

  for (const benchmark of selectedBenchmarks) {
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

module.exports = {
  benchmarks,
  REQUIRED_BENCHMARK_IDS,
  runScenario,
  verifyBatchPrototype,
}

if (require.main === module) {
  main().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
