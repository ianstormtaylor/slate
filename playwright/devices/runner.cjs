const editorSource = `(() => {
  const element = document.querySelector('[data-slate-editor]')
  const fiberKey = Object.keys(element).find(key => key.startsWith('__reactFiber$'))
  let fiber = element[fiberKey]
  while (fiber && !fiber.memoizedProps?.editor) fiber = fiber.return
  return fiber.memoizedProps.editor
})()`

const watchedEvents = [
  'keydown',
  'compositionstart',
  'compositionupdate',
  'compositionend',
  'beforeinput',
  'input',
  'focus',
  'blur',
]

const installRecorder = page =>
  page.addInitScript(events => {
    window.__slateDeviceEvents = []
    const record = event => {
      if (!event.target?.closest?.('[data-slate-editor]')) return
      window.__slateDeviceEvents.push(
        [event.type, event.inputType || event.key || '', event.data ?? '']
          .filter(Boolean)
          .join(':')
      )
    }
    for (const type of events) document.addEventListener(type, record, true)
  }, watchedEvents)

const withEditor = (page, fn, arg) =>
  page.evaluate(
    ([source, body, value]) => {
      const editor = eval(source)
      return new Function('editor', 'value', body)(editor, value)
    },
    [editorSource, `return (${fn})(editor, value)`, arg]
  )

const readState = page =>
  page.evaluate(source => {
    const editor = eval(source)
    const element = document.querySelector('[data-slate-editor]')
    const blocks = Array.from(
      element.querySelectorAll(':scope > [data-slate-node="element"]')
    )
    const textOf = node =>
      node.text ?? (node.children ? node.children.map(textOf).join('') : '')
    const domTextOf = block => {
      const clone = block.cloneNode(true)
      for (const hidden of clone.querySelectorAll(
        '[contenteditable="false"], [data-slate-placeholder]'
      )) {
        hidden.remove()
      }
      return clone.textContent.replace(/﻿/g, '')
    }
    return {
      dom: blocks.map(domTextOf),
      model: editor.children.map(textOf),
      children: editor.children,
      selection: editor.selection,
      focused: document.activeElement === element,
      events: window.__slateDeviceEvents.slice(),
    }
  }, editorSource)

const placeCaret = (page, where) =>
  withEditor(
    page,
    (editor, where) => {
      const pointAt = spec => {
        if (spec === 'end') return editor.end([])
        if (spec === 'start') return editor.start([])
        if (spec.endOf) return editor.end(spec.endOf)
        if (spec.startOf) return editor.start(spec.startOf)
        return spec
      }
      const anchor = pointAt(where.anchor ?? where)
      const focus = where.focus ? pointAt(where.focus) : anchor
      editor.select({ anchor, focus })
    },
    where
  )

const screenPoint = (page, selector, position = 'start') =>
  page.evaluate(
    ([selector, position]) => {
      const element = document.querySelector(selector)
      const rect = element.getBoundingClientRect()
      const chromeHeight = window.outerHeight - window.innerHeight
      const x =
        position === 'center' ? rect.left + rect.width / 2 : rect.left + 8
      const y =
        position === 'center' ? rect.top + rect.height / 2 : rect.top + 8
      return {
        x: Math.round(window.screenX + x),
        y: Math.round(window.screenY + chromeHeight + y),
      }
    },
    [selector, position]
  )

const consistencyProblems = state => {
  const problems = []
  if (JSON.stringify(state.dom) !== JSON.stringify(state.model)) {
    problems.push(
      `DOM ${JSON.stringify(state.dom)} differs from model ${JSON.stringify(
        state.model
      )}`
    )
  }
  return problems
}

module.exports = {
  consistencyProblems,
  installRecorder,
  placeCaret,
  readState,
  screenPoint,
  withEditor,
}
