export type ProofEvidenceClass =
  | 'automated-direct'
  | 'automated-proxy'
  | 'manual-device-blocking'

export type BrowserMobileScenarioId =
  | 'setup'
  | 'placeholder-input'
  | 'edge-input'
  | 'split-join'
  | 'empty-rebuild'
  | 'remove-range'

export type DebugPlaceholderShape = {
  hasBr: boolean
  hasFEFF: boolean
  kind: string | null
  text: string
}

export type DebugSnapshot = {
  blockTexts: string
  domSelection: string
  events: string[]
  placeholderShape: DebugPlaceholderShape | null
  slateSelection: string
}

export type PlaceholderInputEvaluation = {
  issues: string[]
  ok: boolean
  snapshot: DebugSnapshot
}

export type ImeInputEvaluation = PlaceholderInputEvaluation

export type SplitJoinEvaluation = {
  issues: string[]
  ok: boolean
  snapshot: {
    blockCount: number
    blockTexts: string[]
    selection: string
  }
}

export type EmptyRebuildEvaluation = SplitJoinEvaluation

type AgentBrowserBatchItem = {
  command: string[]
  error: string | null
  result?: {
    origin?: string
    result?: string
    text?: string
    title?: string
    url?: string
  } | null
  success: boolean
}

type AppiumExecuteResponse = {
  value: string
}

export const extractAppiumJsonValue = <T>(raw: string) => {
  const parsed = JSON.parse(raw) as AppiumExecuteResponse

  if (typeof parsed?.value !== 'string') {
    throw new Error('Appium execute payload did not return a string value')
  }

  return JSON.parse(parsed.value) as T
}

const isDebugSnapshot = (value: unknown): value is DebugSnapshot => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.blockTexts === 'string' &&
    typeof record.domSelection === 'string' &&
    Array.isArray(record.events) &&
    typeof record.slateSelection === 'string'
  )
}

export const parseDebugSnapshot = (raw: string): DebugSnapshot => {
  const parsed = JSON.parse(raw) as unknown

  if (!isDebugSnapshot(parsed)) {
    throw new Error('Debug snapshot payload is not a recognized snapshot shape')
  }

  return parsed
}

export const parseAgentBrowserBatch = (
  raw: string
): AgentBrowserBatchItem[] => {
  const parsed = JSON.parse(raw) as unknown

  if (!Array.isArray(parsed)) {
    throw new Error('Agent-browser batch output is not an array')
  }

  return parsed as AgentBrowserBatchItem[]
}

export const extractAgentBrowserDebugSnapshot = (raw: string) => {
  const batch = parseAgentBrowserBatch(raw)
  const last = batch.at(-1)
  const debugText = last?.result?.result

  if (!last?.success || typeof debugText !== 'string') {
    throw new Error(
      'Agent-browser batch did not return a debug snapshot string'
    )
  }

  return parseDebugSnapshot(debugText)
}

export const extractAppiumDebugSnapshot = (raw: string) => {
  return parseDebugSnapshot(
    JSON.stringify(extractAppiumJsonValue<DebugSnapshot>(raw))
  )
}

export const evaluateImeInput = (
  snapshot: DebugSnapshot,
  expectedText = 'sushi'
): ImeInputEvaluation => {
  const issues: string[] = []
  const expectedSelection = `0.0:${expectedText.length}|0.0:${expectedText.length}`

  if (snapshot.blockTexts !== expectedText) {
    issues.push(
      `Expected blockTexts to equal "${expectedText}", got "${snapshot.blockTexts}"`
    )
  }

  if (snapshot.slateSelection !== expectedSelection) {
    issues.push(
      `Expected slateSelection to equal "${expectedSelection}", got "${snapshot.slateSelection}"`
    )
  }

  if (snapshot.placeholderShape !== null) {
    issues.push('Expected placeholderShape to be null after input commit')
  }

  if (!snapshot.events.some((event) => event.includes('beforeinput'))) {
    issues.push('Expected at least one beforeinput event in debug snapshot')
  }

  return {
    issues,
    ok: issues.length === 0,
    snapshot,
  }
}

export const evaluatePlaceholderInput = evaluateImeInput

export const evaluateSplitJoin = (
  snapshot: {
    blockCount: number
    blockTexts: string[]
    selection: string
  },
  expectedText = 'One before two middle three after four'
): SplitJoinEvaluation => {
  const issues: string[] = []

  if (snapshot.blockCount !== 1) {
    issues.push(`Expected blockCount to equal 1, got ${snapshot.blockCount}`)
  }

  if (
    snapshot.blockTexts.length !== 1 ||
    snapshot.blockTexts[0] !== expectedText
  ) {
    issues.push(
      `Expected blockTexts to equal ["${expectedText}"], got ${JSON.stringify(
        snapshot.blockTexts
      )}`
    )
  }

  return {
    issues,
    ok: issues.length === 0,
    snapshot,
  }
}

export const evaluateEmptyRebuild = (snapshot: {
  blockCount: number
  blockTexts: string[]
  selection: string
}): EmptyRebuildEvaluation => {
  const issues: string[] = []

  if (snapshot.blockCount !== 1) {
    issues.push(`Expected blockCount to equal 1, got ${snapshot.blockCount}`)
  }

  if (snapshot.blockTexts.length !== 1 || snapshot.blockTexts[0] !== '') {
    issues.push(
      `Expected blockTexts to equal [""], got ${JSON.stringify(snapshot.blockTexts)}`
    )
  }

  return {
    issues,
    ok: issues.length === 0,
    snapshot,
  }
}
