import assert from 'assert'
import { createEditor, Editor } from '../src'
import { createMatrixCases, deepClone } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const installApplyWrapper = (editor, wrapperMode) => {
  if (wrapperMode !== 'rewrite') {
    return
  }

  const { apply } = editor

  editor.apply = op => {
    let nextOp = op

    if (op.type === 'set_node') {
      nextOp = {
        ...op,
        newProperties: {
          ...op.newProperties,
          ...('id' in (op.newProperties ?? {}) ? { id: 'orange' } : {}),
        },
      }
    }

    apply(nextOp)
  }
}

const getNodeAtPath = (children, path) => {
  let current = children

  for (const index of path) {
    current = Array.isArray(current) ? current[index] : current.children[index]
  }

  return current
}

const applyStep = (editor, step) => {
  if (step.type === 'assign_children') {
    editor.children = deepClone(step.children)
    return
  }

  if (step.type === 'apply_operation') {
    editor.apply(deepClone(step.op))
    return
  }

  throw new Error(`Unsupported step type: ${step.type}`)
}

const runDirectAssignmentReplayCase = ({
  children,
  steps,
  wrapperMode,
  persistRefPath = null,
}) => {
  const batchEditor = createEditor()
  const replayEditor = createEditor()

  batchEditor.children = deepClone(children)
  replayEditor.children = deepClone(children)

  installApplyWrapper(batchEditor, wrapperMode)
  installApplyWrapper(replayEditor, wrapperMode)

  const initialBatchRefValue =
    persistRefPath == null
      ? null
      : deepClone(getNodeAtPath(batchEditor.children, persistRefPath))
  const initialReplayRefValue =
    persistRefPath == null
      ? null
      : deepClone(getNodeAtPath(replayEditor.children, persistRefPath))
  const publishedBatchRef =
    persistRefPath == null
      ? null
      : getNodeAtPath(batchEditor.children, persistRefPath)
  const publishedReplayRef =
    persistRefPath == null
      ? null
      : getNodeAtPath(replayEditor.children, persistRefPath)

  Editor.withBatch(batchEditor, () => {
    for (const step of steps) {
      applyStep(batchEditor, step)
    }
  })

  for (const step of steps) {
    applyStep(replayEditor, step)
  }

  assert.deepEqual(batchEditor.children, replayEditor.children)
  assert.deepEqual(batchEditor.selection, replayEditor.selection)

  if (persistRefPath != null) {
    assert.deepEqual(publishedBatchRef, initialBatchRefValue)
    assert.deepEqual(publishedReplayRef, initialReplayRefValue)
  }
}

const DIRECT_ASSIGNMENT_SCENARIOS = {
  assignmentOnly: {
    children: [paragraph('one'), paragraph('two')],
    steps: [
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
    ],
  },
  exactSetThenAssignment: {
    children: [paragraph('one'), paragraph('two'), paragraph('three')],
    steps: [
      {
        type: 'apply_operation',
        op: {
          type: 'set_node',
          path: [2],
          properties: {},
          newProperties: { id: 'p2' },
        },
      },
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
    ],
  },
  insertThenAssignment: {
    children: [paragraph('one'), paragraph('two')],
    steps: [
      {
        type: 'apply_operation',
        op: {
          type: 'insert_node',
          path: [2],
          node: paragraph('three'),
        },
      },
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
    ],
  },
  liveMoveThenAssignment: {
    children: [paragraph('one'), paragraph('two'), paragraph('three')],
    steps: [
      {
        type: 'apply_operation',
        op: {
          type: 'move_node',
          path: [2],
          newPath: [0],
        },
      },
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
    ],
  },
  liveInsertMoveThenAssignment: {
    children: [paragraph('zero'), paragraph('one')],
    steps: [
      {
        type: 'apply_operation',
        op: {
          type: 'insert_node',
          path: [2],
          node: paragraph('two'),
        },
      },
      {
        type: 'apply_operation',
        op: {
          type: 'move_node',
          path: [2],
          newPath: [0],
        },
      },
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
    ],
  },
  assignmentThenSetNode: {
    children: [paragraph('one'), paragraph('two')],
    steps: [
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
      {
        type: 'apply_operation',
        op: {
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: { id: 'p0' },
        },
      },
    ],
  },
  assignmentThenInsert: {
    children: [paragraph('one')],
    steps: [
      {
        type: 'assign_children',
        children: [paragraph('replacement')],
      },
      {
        type: 'apply_operation',
        op: {
          type: 'insert_node',
          path: [1],
          node: paragraph('tail'),
        },
      },
    ],
  },
  assignmentThenMove: {
    children: [paragraph('one')],
    steps: [
      {
        type: 'assign_children',
        children: [paragraph('zero'), paragraph('one'), paragraph('two')],
      },
      {
        type: 'apply_operation',
        op: {
          type: 'move_node',
          path: [2],
          newPath: [0],
        },
      },
    ],
  },
}

const DIRECT_ASSIGNMENT_MATRIX = createMatrixCases({
  scenario: Object.keys(DIRECT_ASSIGNMENT_SCENARIOS),
  wrapperMode: ['plain', 'rewrite'],
})

const DIRECT_ASSIGNMENT_OBSERVATION_SCENARIOS = {
  assignmentThenSetNode: {
    persistRefPath: [0],
  },
  liveMoveThenAssignment: {
    persistRefPath: [0],
  },
}

const DIRECT_ASSIGNMENT_OBSERVATION_MATRIX = Object.entries(
  DIRECT_ASSIGNMENT_OBSERVATION_SCENARIOS
).flatMap(([scenario, config]) =>
  createMatrixCases({
    wrapperMode: ['plain', 'rewrite'],
  }).map(matrixCase => ({
    ...matrixCase,
    scenario,
    persistRefPath: config.persistRefPath,
    name: `scenario=${scenario} | ${matrixCase.name}`,
  }))
)

describe('Editor.withBatch direct children assignment', () => {
  it('declares the direct-assignment matrix manifest', () => {
    assertBatchMatrixManifest(
      'directAssignment',
      DIRECT_ASSIGNMENT_MATRIX.length
    )
  })

  for (const matrixCase of DIRECT_ASSIGNMENT_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = DIRECT_ASSIGNMENT_SCENARIOS[matrixCase.scenario]

      runDirectAssignmentReplayCase({
        children: scenario.children,
        steps: scenario.steps,
        wrapperMode: matrixCase.wrapperMode,
      })
    })
  }

  it('declares the direct-assignment observation matrix manifest', () => {
    assertBatchMatrixManifest(
      'directAssignmentObservation',
      DIRECT_ASSIGNMENT_OBSERVATION_MATRIX.length
    )
  })

  for (const matrixCase of DIRECT_ASSIGNMENT_OBSERVATION_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = DIRECT_ASSIGNMENT_SCENARIOS[matrixCase.scenario]

      runDirectAssignmentReplayCase({
        children: scenario.children,
        steps: scenario.steps,
        wrapperMode: matrixCase.wrapperMode,
        persistRefPath: matrixCase.persistRefPath,
      })
    })
  }
})
