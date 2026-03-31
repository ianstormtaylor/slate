const { performance } = require('node:perf_hooks')

const {
  createEditor,
  Editor,
  Element,
  Node,
  Path,
  PathRef,
  PointRef,
  RangeRef,
  Transforms,
} = require('../../src')
const { isBatchingDirtyPaths } = require('../../src/core/batch-dirty-paths')
const { updateDirtyPaths } = require('../../src/core/update-dirty-paths')
const { FLUSHING } = require('../../src/utils/weak-maps')
const { modifyDescendant } = require('../../src/utils/modify')

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

const createSetNodeBatchUpdates = targetPaths =>
  targetPaths.map((path, index) => ({
    at: path,
    props: { id: `id-${index}` },
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

const installTimedApply = editor => {
  const metrics = {
    applyCount: 0,
    totalMs: 0,
    pathRefsMs: 0,
    pointRefsMs: 0,
    rangeRefsMs: 0,
    dirtyPathsMs: 0,
    transformMs: 0,
    normalizeMs: 0,
  }

  editor.apply = op => {
    const applyStart = performance.now()
    let start = applyStart

    metrics.applyCount++

    for (const ref of Editor.pathRefs(editor)) {
      PathRef.transform(ref, op)
    }
    metrics.pathRefsMs += performance.now() - start

    start = performance.now()
    for (const ref of Editor.pointRefs(editor)) {
      PointRef.transform(ref, op)
    }
    metrics.pointRefsMs += performance.now() - start

    start = performance.now()
    for (const ref of Editor.rangeRefs(editor)) {
      RangeRef.transform(ref, op)
    }
    metrics.rangeRefsMs += performance.now() - start

    start = performance.now()
    if (!isBatchingDirtyPaths(editor)) {
      const transform = Path.operationCanTransformPath(op)
        ? path => Path.transform(path, op)
        : undefined
      updateDirtyPaths(editor, editor.getDirtyPaths(op), transform)
    }
    metrics.dirtyPathsMs += performance.now() - start

    start = performance.now()
    Transforms.transform(editor, op)
    metrics.transformMs += performance.now() - start

    editor.operations.push(op)

    start = performance.now()
    Editor.normalize(editor, { operation: op })
    metrics.normalizeMs += performance.now() - start

    if (op.type === 'set_selection') {
      editor.marks = null
    }

    if (!FLUSHING.get(editor)) {
      FLUSHING.set(editor, true)

      Promise.resolve().then(() => {
        FLUSHING.set(editor, false)
        editor.onChange({ operation: op })
        editor.operations = []
      })
    }

    metrics.totalMs += performance.now() - applyStart
  }

  return metrics
}

const median = values => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

const summarizeMetrics = runs => {
  const keys = Object.keys(runs[0].metrics)
  const summary = {}

  for (const key of keys) {
    summary[key] = median(runs.map(run => run.metrics[key]))
  }

  return summary
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

    Transforms.setNodesBatch(
      batchedEditor,
      createSetNodeBatchUpdates(testCase.targetPaths)
    )

    assertEquivalentChildren(
      `setNodesBatch(${testCase.label})`,
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

const runScenario = async ({ benchmark, blockCount, groupSize, repeats }) => {
  const runs = []

  for (let repeat = 0; repeat < repeats; repeat++) {
    const editor = createEditorWithValue(
      benchmark.shape === 'flat'
        ? buildFlatValue(blockCount)
        : buildGroupedValue(blockCount, groupSize)
    )
    const targetPaths = collectTargetPaths(editor)
    const applyMetrics = installTimedApply(editor)

    const start = performance.now()
    benchmark.run({ editor, targetPaths })
    const durationMs = performance.now() - start

    await waitForMicrotasks()

    runs.push({
      durationMs,
      metrics: applyMetrics,
    })
  }

  return {
    applyMetrics: summarizeMetrics(runs),
    durationMs: median(runs.map(run => run.durationMs)),
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
    id: 'batched-exact-flat',
    label: 'Transforms.setNodesBatch exact-path batch',
    shape: 'flat',
    run: ({ editor, targetPaths }) => {
      Transforms.setNodesBatch(editor, createSetNodeBatchUpdates(targetPaths))
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
    label: 'editor.apply(set_node) per path inside Editor.withoutNormalizing on grouped document',
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
    id: 'batched-exact-grouped',
    label: 'Transforms.setNodesBatch exact-path batch on grouped document',
    shape: 'grouped',
    run: ({ editor, targetPaths }) => {
      Transforms.setNodesBatch(editor, createSetNodeBatchUpdates(targetPaths))
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
      applyCount: result.applyMetrics.applyCount,
      applyTotalMs: Number(result.applyMetrics.totalMs.toFixed(2)),
      dirtyPathsMs: Number(result.applyMetrics.dirtyPathsMs.toFixed(2)),
      transformMs: Number(result.applyMetrics.transformMs.toFixed(2)),
      normalizeMs: Number(result.applyMetrics.normalizeMs.toFixed(2)),
      pathRefsMs: Number(result.applyMetrics.pathRefsMs.toFixed(2)),
      pointRefsMs: Number(result.applyMetrics.pointRefsMs.toFixed(2)),
      rangeRefsMs: Number(result.applyMetrics.rangeRefsMs.toFixed(2)),
    })
  }

  console.table(results)
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
