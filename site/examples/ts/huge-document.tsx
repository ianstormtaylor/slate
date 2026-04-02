import { faker } from '@faker-js/faker'
import React, {
  CSSProperties,
  Dispatch,
  StrictMode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Ancestor,
  createEditor as slateCreateEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Node,
  Operation,
  Path,
  Transforms,
} from 'slate'
import {
  Editable,
  RenderElementProps,
  RenderChunkProps,
  Slate,
  withReact,
  useSelected,
} from 'slate-react'

import { HeadingElement, ParagraphElement } from './custom-types.d'

const SUPPORTS_EVENT_TIMING =
  typeof window !== 'undefined' && 'PerformanceEventTiming' in window

const SUPPORTS_LOAF_TIMING =
  typeof window !== 'undefined' &&
  'PerformanceLongAnimationFrameTiming' in window

interface Config {
  blocks: number
  chunking: boolean
  chunkSize: number
  chunkDivs: boolean
  chunkOutlines: boolean
  contentVisibilityMode: 'none' | 'element' | 'chunk'
  showSelectedHeadings: boolean
  strictMode: boolean
}

type BenchmarkMode =
  | 'applyBatch'
  | 'applySetNode'
  | 'pathTraversal'
  | 'directRewrite'
  | 'setNodes'
  | 'setNodesWithoutNormalizing'

interface BenchmarkResult {
  blocks: number
  durationMs: number
  label: string
  propValue: string
}

interface BenchmarkMetric {
  averageMs: number
  label: string
  maxMs: number
  minMs: number
  mode: BenchmarkMode
  vsDirectRewrite: number | null
}

interface BenchmarkSuiteResult {
  blocks: number
  metrics: BenchmarkMetric[]
  repeats: number
}

const blocksOptions = [
  2, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
  100000, 200000,
]

const chunkSizeOptions = [3, 10, 100, 1000]

const searchParams =
  typeof document === 'undefined'
    ? null
    : new URLSearchParams(document.location.search)

const parseNumber = (key: string, defaultValue: number) =>
  parseInt(searchParams?.get(key) ?? '', 10) || defaultValue

const parseBoolean = (key: string, defaultValue: boolean) => {
  const value = searchParams?.get(key)
  if (value) return value === 'true'
  return defaultValue
}

const parseEnum = <T extends string>(
  key: string,
  options: T[],
  defaultValue: T
): T => {
  const value = searchParams?.get(key) as T | null | undefined
  if (value && options.includes(value)) return value
  return defaultValue
}

const initialConfig: Config = {
  blocks: parseNumber('blocks', 10000),
  chunking: parseBoolean('chunking', true),
  chunkSize: parseNumber('chunk_size', 1000),
  chunkDivs: parseBoolean('chunk_divs', true),
  chunkOutlines: parseBoolean('chunk_outlines', false),
  contentVisibilityMode: parseEnum(
    'content_visibility',
    ['none', 'element', 'chunk'],
    'chunk'
  ),
  showSelectedHeadings: parseBoolean('selected_headings', false),
  strictMode: parseBoolean('strict', false),
}

const setSearchParams = (config: Config) => {
  if (searchParams) {
    searchParams.set('blocks', config.blocks.toString())
    searchParams.set('chunking', config.chunking ? 'true' : 'false')
    searchParams.set('chunk_size', config.chunkSize.toString())
    searchParams.set('chunk_divs', config.chunkDivs ? 'true' : 'false')
    searchParams.set('chunk_outlines', config.chunkOutlines ? 'true' : 'false')
    searchParams.set('content_visibility', config.contentVisibilityMode)
    searchParams.set(
      'selected_headings',
      config.showSelectedHeadings ? 'true' : 'false'
    )
    searchParams.set('strict', config.strictMode ? 'true' : 'false')
    history.replaceState({}, '', `?${searchParams.toString()}`)
  }
}

const cachedInitialValue: Descendant[] = []

const getInitialValue = (blocks: number) => {
  if (cachedInitialValue.length >= blocks) {
    return cachedInitialValue.slice(0, blocks)
  }

  faker.seed(1)

  for (let i = cachedInitialValue.length; i < blocks; i++) {
    if (i % 100 === 0) {
      const heading: HeadingElement = {
        type: 'heading-one',
        children: [{ text: faker.lorem.sentence() }],
      }
      cachedInitialValue.push(heading)
    } else {
      const paragraph: ParagraphElement = {
        type: 'paragraph',
        children: [{ text: faker.lorem.paragraph() }],
      }
      cachedInitialValue.push(paragraph)
    }
  }

  return cachedInitialValue.slice()
}

const initialInitialValue =
  typeof window === 'undefined' ? [] : getInitialValue(initialConfig.blocks)

const BENCHMARK_PROP = 'benchmarkRun'

const benchmarkLabels: Record<BenchmarkMode, string> = {
  applyBatch: 'Transforms.applyBatch with exact-path set_node ops',
  applySetNode: 'editor.apply(set_node) on every top-level block',
  directRewrite: 'Direct immutable rewrite of editor.children',
  pathTraversal: 'Traverse every top-level path with Node.get',
  setNodes: 'Transforms.setNodes on every top-level block',
  setNodesWithoutNormalizing:
    'Transforms.setNodes on every top-level block inside Editor.withoutNormalizing',
}

const interactiveBenchmarkModes: BenchmarkMode[] = [
  'applyBatch',
  'setNodes',
  'setNodesWithoutNormalizing',
  'applySetNode',
]

const comparisonBenchmarkModes: BenchmarkMode[] = [
  'applyBatch',
  'pathTraversal',
  'directRewrite',
  'setNodes',
  'setNodesWithoutNormalizing',
  'applySetNode',
]

const createEditor = (config: Config) => {
  const editor = withReact(slateCreateEditor())

  editor.getChunkSize = (node: Ancestor) =>
    config.chunking && node === editor ? config.chunkSize : null

  return editor
}

const cloneValue = <V,>(value: V): V => JSON.parse(JSON.stringify(value)) as V

const createDetachedBenchmarkEditor = (children: Descendant[]) => {
  const editor = slateCreateEditor()

  editor.children = cloneValue(children)

  return editor
}

const runTopLevelBenchmark = (
  editor: Editor,
  mode: BenchmarkMode
): BenchmarkResult => {
  const propValue = `${mode}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
  const paths = editor.children.map(
    (_: Descendant, index: number) => [index] as Path
  )
  const start = performance.now()

  const applyToAllBlocks = () => {
    for (const path of paths) {
      if (mode === 'pathTraversal') {
        Node.get(editor, path)
        continue
      }

      if (mode === 'directRewrite') {
        editor.children = editor.children.map((node: Descendant) =>
          SlateElement.isElement(node)
            ? ({
                ...node,
                [BENCHMARK_PROP]: propValue,
              } as unknown as Descendant)
            : node
        )
        return
      }

      if (mode === 'applySetNode') {
        const node = Node.get(editor, path)

        if (!SlateElement.isElement(node)) continue

        const previousValue = (node as Record<string, unknown>)[BENCHMARK_PROP]

        editor.apply({
          type: 'set_node',
          path,
          properties:
            previousValue === undefined
              ? {}
              : { [BENCHMARK_PROP]: previousValue },
          newProperties: { [BENCHMARK_PROP]: propValue },
        } as any)
        continue
      }

      if (mode === 'applyBatch') {
        Transforms.applyBatch(
          editor,
          paths.map((batchPath: Path) => ({
            type: 'set_node',
            path: batchPath,
            properties: {},
            newProperties: { [BENCHMARK_PROP]: propValue },
          })) as any
        )
        return
      }

      Transforms.setNodes(
        editor,
        { [BENCHMARK_PROP]: propValue } as Partial<SlateElement>,
        { at: path }
      )
    }
  }

  if (mode === 'setNodesWithoutNormalizing') {
    Editor.withoutNormalizing(editor, applyToAllBlocks)
  } else {
    applyToAllBlocks()
  }

  return {
    blocks: paths.length,
    durationMs: Math.round((performance.now() - start) * 100) / 100,
    label: benchmarkLabels[mode],
    propValue,
  }
}

const runDetachedBenchmarkSuite = (
  children: Descendant[],
  repeats: number
): BenchmarkSuiteResult => {
  const durationsByMode = new Map<BenchmarkMode, number[]>()

  for (const mode of comparisonBenchmarkModes) {
    durationsByMode.set(mode, [])

    for (let index = 0; index < repeats; index++) {
      const benchmarkEditor = createDetachedBenchmarkEditor(children)
      const result = runTopLevelBenchmark(benchmarkEditor, mode)

      durationsByMode.get(mode)!.push(result.durationMs)
    }
  }

  const directRewriteAverage =
    durationsByMode
      .get('directRewrite')!
      .reduce((total: number, duration: number) => {
        return total + duration
      }, 0) / repeats

  return {
    blocks: children.length,
    metrics: comparisonBenchmarkModes.map((mode: BenchmarkMode) => {
      const durations = durationsByMode.get(mode)!
      const averageMs =
        durations.reduce(
          (total: number, duration: number) => total + duration,
          0
        ) / durations.length

      return {
        averageMs: Math.round(averageMs * 100) / 100,
        label: benchmarkLabels[mode],
        maxMs: Math.max(...durations),
        minMs: Math.min(...durations),
        mode,
        vsDirectRewrite:
          mode === 'directRewrite' || directRewriteAverage === 0
            ? null
            : Math.round((averageMs / directRewriteAverage) * 100) / 100,
      }
    }),
    repeats,
  }
}

const HugeDocumentExample = () => {
  const [rendering, setRendering] = useState(false)
  const [config, baseSetConfig] = useState<Config>(initialConfig)
  const [initialValue, setInitialValue] = useState(initialInitialValue)
  const [editor, setEditor] = useState(() => createEditor(config))
  const [editorVersion, setEditorVersion] = useState(0)

  const setConfig = useCallback(
    (partialConfig: Partial<Config>) => {
      const newConfig = { ...config, ...partialConfig }

      setRendering(true)
      baseSetConfig(newConfig)
      setSearchParams(newConfig)

      setTimeout(() => {
        setRendering(false)
        setInitialValue(getInitialValue(newConfig.blocks))
        setEditor(createEditor(newConfig))
        setEditorVersion(n => n + 1)
      })
    },
    [config]
  )

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <Element
        {...props}
        contentVisibility={config.contentVisibilityMode === 'element'}
        showSelectedHeadings={config.showSelectedHeadings}
      />
    ),
    [config.contentVisibilityMode, config.showSelectedHeadings]
  )

  const renderChunk = useCallback(
    (props: RenderChunkProps) => (
      <Chunk
        {...props}
        contentVisibilityLowest={config.contentVisibilityMode === 'chunk'}
        outline={config.chunkOutlines}
      />
    ),
    [config.contentVisibilityMode, config.chunkOutlines]
  )

  const editable = rendering ? (
    <div>Rendering&hellip;</div>
  ) : (
    <Slate key={editorVersion} editor={editor} initialValue={initialValue}>
      <Editable
        placeholder="Enter some text…"
        renderElement={renderElement}
        renderChunk={config.chunkDivs ? renderChunk : undefined}
        spellCheck
        autoFocus
      />
    </Slate>
  )

  const editableWithStrictMode = config.strictMode ? (
    <StrictMode>{editable}</StrictMode>
  ) : (
    editable
  )

  return (
    <>
      <PerformanceControls
        editor={editor}
        config={config}
        setConfig={setConfig}
      />

      {editableWithStrictMode}
    </>
  )
}

const Chunk = ({
  attributes,
  children,
  lowest,
  contentVisibilityLowest,
  outline,
}: RenderChunkProps & {
  contentVisibilityLowest: boolean
  outline: boolean
}) => {
  const style: CSSProperties = {
    contentVisibility: contentVisibilityLowest && lowest ? 'auto' : undefined,
    border: outline ? '1px solid red' : undefined,
    padding: outline ? 20 : undefined,
    marginBottom: outline ? 20 : undefined,
  }

  return (
    <div {...attributes} style={style}>
      {children}
    </div>
  )
}

const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<'h1'> & { showSelectedHeadings: boolean }
>(({ style: styleProp, showSelectedHeadings = false, ...props }, ref) => {
  // Fine since the editor is remounted if the config changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const selected = showSelectedHeadings ? useSelected() : false
  const style = { ...styleProp, color: selected ? 'green' : undefined }
  return <h1 ref={ref} {...props} aria-selected={selected} style={style} />
})

const Paragraph = 'p'

const Element = ({
  attributes,
  children,
  element,
  contentVisibility,
  showSelectedHeadings,
}: RenderElementProps & {
  contentVisibility: boolean
  showSelectedHeadings: boolean
}) => {
  const style: CSSProperties = {
    contentVisibility: contentVisibility ? 'auto' : undefined,
  }

  switch (element.type) {
    case 'heading-one':
      return (
        <Heading
          {...attributes}
          style={style}
          showSelectedHeadings={showSelectedHeadings}
        >
          {children}
        </Heading>
      )
    default:
      return (
        <Paragraph {...attributes} style={style}>
          {children}
        </Paragraph>
      )
  }
}

const PerformanceControls = ({
  editor,
  config,
  setConfig,
}: {
  editor: Editor
  config: Config
  setConfig: Dispatch<Partial<Config>>
}) => {
  const [configurationOpen, setConfigurationOpen] = useState(true)
  const [keyPressDurations, setKeyPressDurations] = useState<number[]>([])
  const [lastLongAnimationFrameDuration, setLastLongAnimationFrameDuration] =
    useState<number | null>(null)
  const [benchmarkRepeats, setBenchmarkRepeats] = useState(3)
  const [runningBenchmark, setRunningBenchmark] =
    useState<BenchmarkMode | null>(null)
  const [lastBenchmarkResult, setLastBenchmarkResult] =
    useState<BenchmarkResult | null>(null)
  const [runningBenchmarkSuite, setRunningBenchmarkSuite] = useState(false)
  const [lastBenchmarkSuite, setLastBenchmarkSuite] =
    useState<BenchmarkSuiteResult | null>(null)

  const lastKeyPressDuration: number | null = keyPressDurations[0] ?? null

  const averageKeyPressDuration =
    keyPressDurations.length === 10
      ? Math.round(
          keyPressDurations.reduce(
            (total: number, duration: number) => total + duration
          ) / 10
        )
      : null

  useEffect(() => {
    if (!SUPPORTS_EVENT_TIMING) return

    const observer = new PerformanceObserver(
      (list: PerformanceObserverEntryList) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          if (entry.name === 'keypress') {
            const duration = Math.round(
              // @ts-ignore Entry type is missing processingStart and processingEnd
              entry.processingEnd - entry.processingStart
            )
            setKeyPressDurations(durations => [
              duration,
              ...durations.slice(0, 9),
            ])
          }
        })
      }
    )

    // @ts-ignore Options type is missing durationThreshold
    observer.observe({ type: 'event', durationThreshold: 16 })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!SUPPORTS_LOAF_TIMING) return

    const { apply } = editor
    let afterOperation = false

    editor.apply = (operation: Operation) => {
      apply(operation)
      afterOperation = true
    }

    const observer = new PerformanceObserver(
      (list: PerformanceObserverEntryList) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          if (afterOperation) {
            setLastLongAnimationFrameDuration(Math.round(entry.duration))
            afterOperation = false
          }
        })
      }
    )

    // Register the observer for events
    observer.observe({ type: 'long-animation-frame' })

    return () => observer.disconnect()
  }, [editor])

  useEffect(() => {
    setRunningBenchmark(null)
    setLastBenchmarkResult(null)
    setRunningBenchmarkSuite(false)
    setLastBenchmarkSuite(null)
  }, [editor])

  const queueBenchmark = useCallback(
    (mode: BenchmarkMode) => {
      setRunningBenchmark(mode)

      requestAnimationFrame(() => {
        const result = runTopLevelBenchmark(editor, mode)

        setLastBenchmarkResult(result)
        setRunningBenchmark(null)
      })
    },
    [editor]
  )

  const queueBenchmarkSuite = useCallback(() => {
    setRunningBenchmarkSuite(true)

    requestAnimationFrame(() => {
      const result = runDetachedBenchmarkSuite(
        editor.children as Descendant[],
        benchmarkRepeats
      )

      setLastBenchmarkSuite(result)
      setRunningBenchmarkSuite(false)
    })
  }, [benchmarkRepeats, editor])

  return (
    <div className="performance-controls">
      <p>
        <label>
          Blocks:{' '}
          <select
            value={config.blocks}
            onChange={event =>
              setConfig({
                blocks: parseInt(event.target.value, 10),
              })
            }
          >
            {blocksOptions.map(blocks => (
              <option key={blocks} value={blocks}>
                {blocks.toString().replace(/(\d{3})$/, ',$1')}
              </option>
            ))}
          </select>
        </label>
      </p>

      <details
        open={configurationOpen}
        onToggle={event => setConfigurationOpen(event.currentTarget.open)}
      >
        <summary>Configuration</summary>

        <p>
          <label>
            <input
              type="checkbox"
              checked={config.chunking}
              onChange={event =>
                setConfig({
                  chunking: event.target.checked,
                })
              }
            />{' '}
            Chunking enabled
          </label>
        </p>

        {config.chunking && (
          <>
            <p>
              <label>
                <input
                  type="checkbox"
                  checked={config.chunkDivs}
                  onChange={event =>
                    setConfig({
                      chunkDivs: event.target.checked,
                    })
                  }
                />{' '}
                Render each chunk as a separate <code>&lt;div&gt;</code>
              </label>
            </p>

            {config.chunkDivs && (
              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={config.chunkOutlines}
                    onChange={event =>
                      setConfig({
                        chunkOutlines: event.target.checked,
                      })
                    }
                  />{' '}
                  Outline each chunk
                </label>
              </p>
            )}

            <p>
              <label>
                Chunk size:{' '}
                <select
                  value={config.chunkSize}
                  onChange={event =>
                    setConfig({
                      chunkSize: parseInt(event.target.value, 10),
                    })
                  }
                >
                  {chunkSizeOptions.map(chunkSize => (
                    <option key={chunkSize} value={chunkSize}>
                      {chunkSize}
                    </option>
                  ))}
                </select>
              </label>
            </p>
          </>
        )}

        <p>
          <label>
            Set <code>content-visibility: auto</code> on:{' '}
            <select
              value={config.contentVisibilityMode}
              onChange={event =>
                setConfig({
                  contentVisibilityMode: event.target.value as any,
                })
              }
            >
              <option value="none">None</option>
              <option value="element">Elements</option>
              {config.chunking && config.chunkDivs && (
                <option value="chunk">Lowest chunks</option>
              )}
            </select>
          </label>
        </p>

        <p>
          <label>
            <input
              type="checkbox"
              checked={config.showSelectedHeadings}
              onChange={event =>
                setConfig({
                  showSelectedHeadings: event.target.checked,
                })
              }
            />{' '}
            Call <code>useSelected</code> in each heading
          </label>
        </p>

        <p>
          <label>
            <input
              type="checkbox"
              checked={config.strictMode}
              onChange={event =>
                setConfig({
                  strictMode: event.target.checked,
                })
              }
            />{' '}
            React strict mode (only works in localhost)
          </label>
        </p>
      </details>

      <details>
        <summary>Statistics</summary>

        <p>
          Last keypress (ms):{' '}
          {SUPPORTS_EVENT_TIMING
            ? lastKeyPressDuration ?? '-'
            : 'Not supported'}
        </p>

        <p>
          Average of last 10 keypresses (ms):{' '}
          {SUPPORTS_EVENT_TIMING
            ? averageKeyPressDuration ?? '-'
            : 'Not supported'}
        </p>

        <p>
          Last long animation frame (ms):{' '}
          {SUPPORTS_LOAF_TIMING
            ? lastLongAnimationFrameDuration ?? '-'
            : 'Not supported'}
        </p>

        {SUPPORTS_EVENT_TIMING && lastKeyPressDuration === null && (
          <p>Events shorter than 16ms may not be detected.</p>
        )}
      </details>

      <details>
        <summary>Transform benchmark</summary>

        <p>
          The comparison suite runs on detached editors cloned from the current
          document, so it isolates transform cost from React rendering. The live
          buttons below mutate the active editor and make the pause visible in
          the UI.
        </p>

        <p
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <label>
            Repeats:{' '}
            <select
              disabled={runningBenchmarkSuite}
              onChange={event => {
                setBenchmarkRepeats(parseInt(event.target.value, 10))
              }}
              value={benchmarkRepeats}
            >
              {[1, 3, 5].map(repeats => (
                <option key={repeats} value={repeats}>
                  {repeats}
                </option>
              ))}
            </select>
          </label>

          <button
            disabled={runningBenchmarkSuite || runningBenchmark !== null}
            onClick={queueBenchmarkSuite}
            style={{
              cursor:
                runningBenchmarkSuite || runningBenchmark !== null
                  ? 'wait'
                  : 'pointer',
              padding: '6px 10px',
            }}
            type="button"
          >
            {runningBenchmarkSuite
              ? 'Running detached comparison…'
              : 'Run detached comparison'}
          </button>
        </p>

        {lastBenchmarkSuite && (
          <>
            <p>
              Detached comparison over{' '}
              {lastBenchmarkSuite.blocks.toLocaleString()} top-level blocks,
              averaged across {lastBenchmarkSuite.repeats} run
              {lastBenchmarkSuite.repeats === 1 ? '' : 's'}.
            </p>

            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
              }}
            >
              <thead>
                <tr>
                  <th align="left">Lane</th>
                  <th align="right">Avg (ms)</th>
                  <th align="right">Min-Max (ms)</th>
                  <th align="right">Vs rewrite</th>
                </tr>
              </thead>

              <tbody>
                {lastBenchmarkSuite.metrics.map(metric => (
                  <tr key={metric.mode}>
                    <td>{metric.label}</td>
                    <td align="right">{metric.averageMs.toFixed(2)}</td>
                    <td align="right">
                      {metric.minMs.toFixed(2)}-{metric.maxMs.toFixed(2)}
                    </td>
                    <td align="right">
                      {metric.vsDirectRewrite === null
                        ? 'baseline'
                        : `${metric.vsDirectRewrite.toFixed(2)}x`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(() => {
              const directRewrite = lastBenchmarkSuite.metrics.find(
                metric => metric.mode === 'directRewrite'
              )
              const setNodes = lastBenchmarkSuite.metrics.find(
                metric => metric.mode === 'setNodes'
              )
              const applyBatch = lastBenchmarkSuite.metrics.find(
                metric => metric.mode === 'applyBatch'
              )
              const withoutNormalizing = lastBenchmarkSuite.metrics.find(
                metric => metric.mode === 'setNodesWithoutNormalizing'
              )

              if (
                !directRewrite ||
                !setNodes ||
                !applyBatch ||
                !withoutNormalizing
              ) {
                return null
              }

              return (
                <p>
                  On this flat top-level document,{' '}
                  <strong>{setNodes.label}</strong> averages{' '}
                  <strong>{setNodes.vsDirectRewrite?.toFixed(2)}x</strong> the
                  cost of the cheap immutable rewrite baseline,{' '}
                  <strong>
                    {(setNodes.averageMs / applyBatch.averageMs).toFixed(2)}x
                  </strong>{' '}
                  the cost of <strong>{applyBatch.label}</strong>, and{' '}
                  <strong>
                    {(
                      setNodes.averageMs / withoutNormalizing.averageMs
                    ).toFixed(2)}
                    x
                  </strong>{' '}
                  the cost of the same loop inside{' '}
                  <code>Editor.withoutNormalizing</code>.
                </p>
              )
            })()}
          </>
        )}

        <p>
          Live single-run controls. Each run writes a hidden{' '}
          <code>{BENCHMARK_PROP}</code> prop so repeated clicks still do real
          work.
        </p>

        <p
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {interactiveBenchmarkModes.map(mode => (
            <button
              key={mode}
              disabled={runningBenchmark !== null || runningBenchmarkSuite}
              onClick={() => queueBenchmark(mode)}
              style={{
                cursor:
                  runningBenchmark !== null || runningBenchmarkSuite
                    ? 'wait'
                    : 'pointer',
                padding: '6px 10px',
              }}
              type="button"
            >
              {runningBenchmark === mode ? 'Running…' : benchmarkLabels[mode]}
            </button>
          ))}
        </p>

        {lastBenchmarkResult && (
          <>
            <p>
              Last run: <strong>{lastBenchmarkResult.durationMs} ms</strong> for{' '}
              {lastBenchmarkResult.blocks.toLocaleString()} top-level blocks.
            </p>

            <p>{lastBenchmarkResult.label}</p>

            <p>
              Hidden prop value: <code>{lastBenchmarkResult.propValue}</code>
            </p>
          </>
        )}
      </details>
    </div>
  )
}

export default HugeDocumentExample
