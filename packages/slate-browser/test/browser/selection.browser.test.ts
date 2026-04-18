import { expect, it } from 'vitest'

import {
  takeDOMSelectionSnapshot,
  takeEditorSelectionSnapshot,
} from '../../src/browser/selection'

it('captures DOM and editor-shaped selection snapshots for a simple editor tree', () => {
  document.body.innerHTML = `
    <div data-slate-editor="true">
      <span data-slate-node="text"><span data-slate-string>alpha</span></span>
      <span data-slate-node="text"><span data-slate-string>beta</span></span>
    </div>
  `

  const root = document.querySelector('[data-slate-editor="true"]')!
  const first = root.querySelector('[data-slate-string]')!.firstChild as Text
  const selection = document.getSelection()!
  const range = document.createRange()

  range.setStart(first, 2)
  range.setEnd(first, 4)
  selection.removeAllRanges()
  selection.addRange(range)

  expect(takeDOMSelectionSnapshot(selection)).toEqual({
    anchorNodeText: 'alpha',
    anchorOffset: 2,
    focusNodeText: 'alpha',
    focusOffset: 4,
  })

  expect(takeEditorSelectionSnapshot(root, selection)).toEqual({
    anchor: {
      path: [0, 0],
      offset: 2,
    },
    focus: {
      path: [0, 0],
      offset: 4,
    },
  })
})

it('normalizes FEFF zero-width DOM offsets back to editor offset zero', () => {
  document.body.innerHTML = `
    <div data-slate-editor="true">
      <span data-slate-node="text">
        <span data-slate-leaf="true">
          <span data-slate-zero-width="n" data-slate-length="0">\uFEFF<br /></span>
        </span>
      </span>
    </div>
  `

  const root = document.querySelector('[data-slate-editor="true"]')!
  const marker = root.querySelector('[data-slate-zero-width="n"]')!
  const text = marker.firstChild as Text
  const selection = document.getSelection()!
  const range = document.createRange()

  range.setStart(text, 1)
  range.setEnd(text, 1)
  selection.removeAllRanges()
  selection.addRange(range)

  expect(takeDOMSelectionSnapshot(selection)).toEqual({
    anchorNodeText: '\uFEFF',
    anchorOffset: 1,
    focusNodeText: '\uFEFF',
    focusOffset: 1,
  })

  expect(takeEditorSelectionSnapshot(root, selection)).toEqual({
    anchor: {
      path: [0, 0],
      offset: 0,
    },
    focus: {
      path: [0, 0],
      offset: 0,
    },
  })
})
