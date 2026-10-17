const clearEditor = async ctx => {
  await ctx.key('cmd+a')
  await ctx.key('delete')
  await ctx.wait(200)
}

const expectText = async (ctx, expected) => {
  const { model } = await ctx.state()
  const text = model.join('\n')
  return text === expected
    ? []
    : [`expected text ${JSON.stringify(expected)}, got ${JSON.stringify(text)}`]
}

const expectIncludesOnce = async (ctx, fragment) => {
  const { model } = await ctx.state()
  const count = model.join('\n').split(fragment).length - 1
  return count === 1
    ? []
    : [`expected ${JSON.stringify(fragment)} once, found ${count} times`]
}

const expectCaretAtEnd = async ctx => {
  const atEnd = await ctx.editor(editor => {
    const { selection } = editor
    if (!selection) return 'no selection'
    const end = editor.end([])
    const same =
      JSON.stringify(selection.anchor) === JSON.stringify(end) &&
      JSON.stringify(selection.focus) === JSON.stringify(end)
    return same ? null : JSON.stringify(selection)
  })
  return atEnd ? [`caret is not at the end: ${atEnd}`] : []
}

const typeIntoTextarea = async (ctx, ime, steps) => {
  await ctx.clickOutside()
  await ctx.ime(ime)
  for (const step of steps) {
    if (step.type) await ctx.type(step.type)
    if (step.key) await ctx.key(step.key)
  }
  await ctx.ime('us')
  await ctx.wait(300)
  return ctx.outsideValue()
}

const controlScenario = (name, ime, steps, expected) => ({
  name: `control-${name}`,
  issues: [],
  example: 'plaintext',
  run: async ctx => {
    const value = await typeIntoTextarea(ctx, ime, steps)
    return value === expected
      ? []
      : [
          `harness control: textarea got ${JSON.stringify(
            value
          )}, expected ${JSON.stringify(expected)}`,
        ]
  },
})

module.exports = [
  controlScenario(
    'korean-textarea',
    'korean',
    [{ type: 'dkssud' }, { key: 'space' }, { type: 'gktpdy' }],
    '안녕 하세요'
  ),
  controlScenario(
    'japanese-textarea',
    'japanese',
    [{ type: 'nihongo' }, { key: 'return' }],
    '日本語'
  ),
  controlScenario(
    'pinyin-textarea',
    'pinyin',
    [{ type: 'nihao' }, { key: 'space' }],
    '你好'
  ),
  {
    name: 'pinyin-empty-richtext',
    issues: [5014, 3882, 3587],
    example: 'richtext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.type('shijie')
      await ctx.key('space')
      await ctx.wait(300)
      const problems = await expectText(ctx, '你好世界')
      await ctx.ime('us')
      await ctx.key('delete', 3)
      await ctx.wait(300)
      return [...problems, ...(await expectText(ctx, '你'))]
    },
  },
  {
    name: 'japanese-empty-confirm',
    issues: [4031, 4136],
    example: 'richtext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.ime('japanese')
      await ctx.type('nihongo')
      await ctx.key('return')
      await ctx.wait(300)
      const problems = await expectIncludesOnce(ctx, '日本語')
      await ctx.key('return')
      await ctx.type('a')
      await ctx.key('return')
      await ctx.wait(300)
      const { model } = await ctx.state()
      if (model.length !== 2 || model[1] !== 'あ') {
        problems.push(
          `expected two blocks ending in あ, got ${JSON.stringify(model)}`
        )
      }
      return problems
    },
  },
  {
    name: 'japanese-empty-plaintext',
    issues: [4136],
    example: 'plaintext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.ime('japanese')
      await ctx.type('aiueo')
      await ctx.key('return')
      await ctx.key('return')
      await ctx.wait(300)
      const { model } = await ctx.state()
      return JSON.stringify(model) === JSON.stringify(['あいうえお', ''])
        ? []
        : [`expected ["あいうえお",""], got ${JSON.stringify(model)}`]
    },
  },
  {
    name: 'korean-empty-richtext',
    issues: [3882],
    example: 'richtext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.ime('korean')
      await ctx.type('dkssud')
      await ctx.key('space')
      await ctx.type('gktpdy')
      await ctx.wait(300)
      await ctx.ime('us')
      await ctx.wait(300)
      return expectText(ctx, '안녕 하세요')
    },
  },
  {
    name: 'korean-blur-while-composing',
    issues: [5830],
    example: 'richtext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.ime('korean')
      await ctx.type('i')
      await ctx.wait(200)
      await ctx.clickOutside()
      await ctx.wait(300)
      const { model, focused } = await ctx.state()
      const problems = []
      if (focused)
        problems.push('editor still has focus after clicking outside')
      if (model.join('').split('ㅑ').length - 1 > 1)
        problems.push(`composed text duplicated: ${JSON.stringify(model)}`)
      return problems
    },
  },
  {
    name: 'pinyin-blur-while-composing',
    issues: [5653, 5173],
    example: 'richtext',
    run: async ctx => {
      await ctx.caret({ endOf: [0] })
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.wait(200)
      await ctx.clickOutside()
      await ctx.wait(400)
      const { model } = await ctx.state()
      const first = model[0]
      const problems = []
      for (const fragment of ['你好', 'ni hao', 'nihao']) {
        if (first.split(fragment).length - 1 > 1) {
          problems.push(
            `${JSON.stringify(fragment)} duplicated: ${JSON.stringify(first)}`
          )
        }
      }
      return problems
    },
  },
  {
    name: 'pinyin-before-mention',
    issues: [5066],
    example: 'mentions',
    run: async ctx => {
      await ctx.caret({
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [1, 0], offset: 32 },
      })
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.wait(300)
      const { children } = await ctx.state()
      const second = children[1]
      const problems = []
      if (second.children[0].text !== '你好') {
        problems.push(
          `expected 你好 before the mention, got ${JSON.stringify(
            second.children[0].text
          )}`
        )
      }
      if (second.children[1]?.type !== 'mention')
        problems.push('mention moved or removed')
      return problems
    },
  },
  {
    name: 'pinyin-after-bold-arrow-left',
    issues: [3695],
    example: 'richtext',
    run: async ctx => {
      await ctx.caret({ path: [0, 2], offset: 1 })
      await ctx.key('left')
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.wait(300)
      return expectIncludesOnce(ctx, '你好')
    },
  },
  {
    name: 'pinyin-on-selected-void',
    issues: [3611],
    example: 'images',
    run: async ctx => {
      await ctx.click('[data-slate-node="element"] img')
      await ctx.wait(200)
      const before = (await ctx.state()).model
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.wait(300)
      const after = (await ctx.state()).model
      const inserted = after.join('').length - before.join('').length
      return inserted > 0 && after.join('').includes('nihao')
        ? [`raw pinyin letters were inserted: ${JSON.stringify(after)}`]
        : []
    },
  },
  {
    name: 'pinyin-list-item-caret',
    issues: [4030, 3943],
    example: 'markdown-shortcuts',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.type('- ')
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.type('shijie')
      await ctx.key('space')
      await ctx.ime('us')
      await ctx.type('x')
      await ctx.wait(300)
      return [
        ...(await expectText(ctx, '你好世界x')),
        ...(await expectCaretAtEnd(ctx)),
      ]
    },
  },
  {
    name: 'pinyin-end-of-paragraph-caret',
    issues: [3943],
    example: 'richtext',
    run: async ctx => {
      await ctx.caret({ endOf: [0] })
      await ctx.ime('pinyin')
      await ctx.type('nihao')
      await ctx.key('space')
      await ctx.ime('us')
      await ctx.type('x')
      await ctx.wait(300)
      const { model } = await ctx.state()
      return model[0].endsWith('你好x')
        ? []
        : [
            `expected the first block to end with 你好x, got ${JSON.stringify(
              model[0]
            )}`,
          ]
    },
  },
  {
    name: 'dead-key-after-select-all',
    issues: [4067, 4232],
    example: 'richtext',
    run: async ctx => {
      await ctx.key('cmd+a')
      await ctx.key('alt+`')
      await ctx.type('e')
      await ctx.type('abc')
      await ctx.wait(300)
      return expectText(ctx, 'èabc')
    },
  },
  {
    name: 'dead-key-in-empty-plaintext',
    issues: [4232, 4001],
    example: 'plaintext',
    run: async ctx => {
      await clearEditor(ctx)
      await ctx.key('alt+e')
      await ctx.type('e')
      await ctx.type('abc')
      await ctx.wait(300)
      const problems = await expectText(ctx, 'éabc')
      await ctx.clickOutside()
      await ctx.wait(300)
      return [...problems, ...(await expectText(ctx, 'éabc'))]
    },
  },
  {
    name: 'dead-key-first-letter-new-line',
    issues: [3777],
    example: 'richtext',
    run: async ctx => {
      await ctx.caret({ endOf: [0] })
      await ctx.key('return')
      await ctx.key('alt+e')
      await ctx.type('e')
      await ctx.wait(300)
      const { model } = await ctx.state()
      return model[1] === 'é'
        ? []
        : [`expected a new block with é, got ${JSON.stringify(model[1])}`]
    },
  },
  {
    name: 'undo-with-russian-layout',
    issues: [4046],
    example: 'richtext',
    run: async ctx => {
      await ctx.caret({ endOf: [0] })
      const before = (await ctx.state()).model[0]
      await ctx.ime('russian')
      await ctx.type('ghbdtn')
      await ctx.wait(300)
      const typed = (await ctx.state()).model[0]
      await ctx.key('cmd+z')
      await ctx.wait(300)
      const undone = (await ctx.state()).model[0]
      const problems = []
      if (!typed.endsWith('привет'))
        problems.push(
          `expected привет typed, got ${JSON.stringify(typed.slice(-10))}`
        )
      if (undone !== before)
        problems.push(
          `undo did not restore the text: ${JSON.stringify(undone.slice(-10))}`
        )
      return problems
    },
  },
  {
    name: 'copy-paste-void-native',
    issues: [3926],
    example: 'images',
    run: async ctx => {
      const countImages = () =>
        ctx.editor(
          editor => editor.children.filter(node => node.type === 'image').length
        )
      const before = await countImages()
      await ctx.click('[data-slate-node="element"] img')
      await ctx.key('cmd+c')
      await ctx.caret({ endOf: [0] })
      await ctx.key('cmd+v')
      await ctx.wait(500)
      const after = await countImages()
      return after === before + 1
        ? []
        : [`expected ${before + 1} images after pasting, found ${after}`]
    },
  },
]
