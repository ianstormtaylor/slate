import {
  evaluatePlaceholderInput,
  extractAgentBrowserDebugSnapshot,
  extractAppiumDebugSnapshot,
} from '../../src/core/proof'

describe('proof helpers', () => {
  it('extracts debug snapshot from an agent-browser batch result', () => {
    const snapshot = extractAgentBrowserDebugSnapshot(
      JSON.stringify([
        {
          command: [
            'open',
            'http://localhost:3100/examples/placeholder?debug=1',
          ],
          error: null,
          result: {
            title: '',
            url: 'http://localhost:3100/examples/placeholder?debug=1',
          },
          success: true,
        },
        {
          command: [
            'eval',
            'document.querySelector("#placeholder-ime-debug-json")?.textContent',
          ],
          error: null,
          result: {
            origin: 'http://localhost:3100/examples/placeholder?debug=1',
            result: JSON.stringify({
              blockTexts: 'sushi',
              domSelection: 'sushi@5|sushi@5',
              events: ['beforeinput:insertText:s'],
              placeholderShape: null,
              slateSelection: '0.0:5|0.0:5',
            }),
          },
          success: true,
        },
      ])
    )

    expect(snapshot).toEqual({
      blockTexts: 'sushi',
      domSelection: 'sushi@5|sushi@5',
      events: ['beforeinput:insertText:s'],
      placeholderShape: null,
      slateSelection: '0.0:5|0.0:5',
    })
  })

  it('extracts debug snapshot from an appium execute payload', () => {
    const snapshot = extractAppiumDebugSnapshot(
      JSON.stringify({
        value: JSON.stringify({
          blockTexts: '',
          domSelection: 'none',
          events: [],
          placeholderShape: {
            hasBr: true,
            hasFEFF: true,
            kind: 'n',
            text: '\uFEFF',
          },
          slateSelection: 'none',
        }),
      })
    )

    expect(snapshot).toEqual({
      blockTexts: '',
      domSelection: 'none',
      events: [],
      placeholderShape: {
        hasBr: true,
        hasFEFF: true,
        kind: 'n',
        text: '\uFEFF',
      },
      slateSelection: 'none',
    })
  })

  it('passes a clean placeholder input snapshot', () => {
    const evaluation = evaluatePlaceholderInput({
      blockTexts: 'sushi',
      domSelection: 'sushi@5|sushi@5',
      events: ['beforeinput:insertText:s', 'mutation'],
      placeholderShape: null,
      slateSelection: '0.0:5|0.0:5',
    })

    expect(evaluation.ok).toBe(true)
    expect(evaluation.issues).toEqual([])
  })

  it('fails a polluted placeholder input snapshot', () => {
    const evaluation = evaluatePlaceholderInput({
      blockTexts: 'sushiType something',
      domSelection: 'sushiType something@5|sushiType something@5',
      events: ['beforeinput:insertText:s'],
      placeholderShape: null,
      slateSelection: '0.0:5|0.0:5',
    })

    expect(evaluation.ok).toBe(false)
    expect(evaluation.issues[0]).toContain('Expected blockTexts')
  })

  it('fails when placeholder residue survives after input commit', () => {
    const evaluation = evaluatePlaceholderInput({
      blockTexts: 'sushi',
      domSelection: 'sushi@5|sushi@5',
      events: ['beforeinput:insertText:s'],
      placeholderShape: {
        hasBr: true,
        hasFEFF: false,
        kind: 'n',
        text: '',
      },
      slateSelection: '0.0:5|0.0:5',
    })

    expect(evaluation.ok).toBe(false)
    expect(evaluation.issues).toContain(
      'Expected placeholderShape to be null after input commit'
    )
  })

  it('passes a clean ime snapshot for non-ASCII committed text', () => {
    const evaluation = evaluatePlaceholderInput(
      {
        blockTexts: 'すし',
        domSelection: 'すし@2|すし@2',
        events: ['beforeinput:insertCompositionText:す'],
        placeholderShape: null,
        slateSelection: '0.0:2|0.0:2',
      },
      'すし'
    )

    expect(evaluation.ok).toBe(true)
    expect(evaluation.issues).toEqual([])
  })
})
