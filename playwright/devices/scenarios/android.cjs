const clear = ctx =>
  ctx.editor(editor => {
    editor.select([])
    editor.deleteFragment()
  })

const text = async ctx => (await ctx.state()).model.join('\n')

const expectText = async (ctx, expected) => {
  const actual = await text(ctx)
  return actual === expected
    ? []
    : [
        `expected text ${JSON.stringify(expected)}, got ${JSON.stringify(
          actual
        )}`,
      ]
}

const caretOffset = ctx =>
  ctx.editor(editor => {
    const { selection } = editor
    if (!selection) return null
    return {
      path: selection.focus.path,
      offset: selection.focus.offset,
      collapsed:
        JSON.stringify(selection.anchor) === JSON.stringify(selection.focus),
    }
  })

const expectCaret = async (ctx, offset, path = [0, 0]) => {
  const caret = await caretOffset(ctx)
  const ok =
    caret &&
    caret.collapsed &&
    caret.offset === offset &&
    JSON.stringify(caret.path) === JSON.stringify(path)
  return ok
    ? []
    : [
        `expected caret at ${JSON.stringify(
          path
        )}:${offset}, got ${JSON.stringify(caret)}`,
      ]
}

module.exports = [
  {
    name: 'compose-and-commit-words',
    issues: [5019, 3811],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('hello')
      await ctx.commit('hello ')
      await ctx.typeWord('world')
      await ctx.finish()
      return [
        ...(await expectText(ctx, 'hello world')),
        ...(await expectCaret(ctx, 11)),
      ]
    },
  },
  {
    name: 'backspace-while-composing',
    issues: [4959, 3811, 5836],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('hello')
      await ctx.compose('hell')
      await ctx.compose('hel')
      await ctx.commit('hel ')
      await ctx.key('delete')
      await ctx.key('delete')
      await ctx.typeWord('p')
      await ctx.finish()
      return [...(await expectText(ctx, 'hep')), ...(await expectCaret(ctx, 3))]
    },
  },
  {
    name: 'backspace-in-empty-editor',
    issues: [5099],
    example: 'richtext',
    run: async ctx => {
      await clear(ctx)
      await ctx.key('delete', 3)
      await ctx.typeWord('a')
      await ctx.finish()
      return expectText(ctx, 'a')
    },
  },
  {
    name: 'compose-in-empty-editor-control',
    issues: [5099],
    example: 'richtext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('a')
      await ctx.finish()
      return expectText(ctx, 'a')
    },
  },
  {
    name: 'pick-suggestion-replaces-composition',
    issues: [5371, 4531],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('helo')
      await ctx.commit('hello ')
      await ctx.typeWord('there')
      await ctx.finish()
      return [
        ...(await expectText(ctx, 'hello there')),
        ...(await expectCaret(ctx, 11)),
      ]
    },
  },
  {
    name: 'autocorrect-first-line',
    issues: [5891],
    example: 'richtext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('teh')
      await ctx.commit('the ')
      return [
        ...(await expectText(ctx, 'the ')),
        ...(await expectCaret(ctx, 4)),
      ]
    },
  },
  {
    name: 'spellcheck-replaces-earlier-word',
    issues: [4602],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.commit('teh cat ')
      await ctx.region(0, 3)
      await ctx.commit('the')
      await ctx.setSelection(8)
      await ctx.typeWord('sat')
      await ctx.finish()
      return [
        ...(await expectText(ctx, 'the cat sat')),
        ...(await expectCaret(ctx, 11)),
      ]
    },
  },
  {
    name: 'recompose-word-under-caret',
    issues: [4531, 5643],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.commit('hello world')
      await ctx.setSelection(3)
      await ctx.region(0, 5)
      await ctx.compose('help')
      await ctx.finish()
      return expectText(ctx, 'help world')
    },
  },
  {
    name: 'markdown-shortcut-heading',
    issues: [4532],
    example: 'markdown-shortcuts',
    run: async ctx => {
      await clear(ctx)
      await ctx.commit('#')
      await ctx.commit(' ')
      await ctx.typeWord('Title')
      await ctx.finish()
      const type = await ctx.editor(editor => editor.children[0].type)
      const problems = await expectText(ctx, 'Title')
      if (type !== 'heading-one')
        problems.push(`expected heading-one, got ${type}`)
      return problems
    },
  },
  {
    name: 'enter-in-heading',
    issues: [4521],
    example: 'richtext',
    run: async ctx => {
      await clear(ctx)
      await ctx.editor(editor => {
        editor.setNodes({ type: 'heading-one' })
      })
      await ctx.typeWord('Title')
      await ctx.finish()
      await ctx.key('enter')
      await ctx.typeWord('body')
      await ctx.finish()
      const types = await ctx.editor(editor =>
        editor.children.map(node => node.type)
      )
      const problems = await expectText(ctx, 'Title\nbody')
      if (types.length !== 2)
        problems.push(`expected two blocks, got ${JSON.stringify(types)}`)
      return problems
    },
  },
  {
    name: 'chinese-backspace-once',
    issues: [5984],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.compose('ni')
      await ctx.commit('你')
      await ctx.compose('hao')
      await ctx.commit('好')
      await ctx.key('delete')
      return [...(await expectText(ctx, '你')), ...(await expectCaret(ctx, 1))]
    },
  },
  {
    name: 'korean-composition',
    issues: [4693],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      for (const step of ['ㅎ', '하', '한']) await ctx.compose(step)
      await ctx.commit('한')
      for (const step of ['ㄱ', '그', '글']) await ctx.compose(step)
      await ctx.finish()
      return [
        ...(await expectText(ctx, '한글')),
        ...(await expectCaret(ctx, 2)),
      ]
    },
  },
  {
    name: 'type-after-toggling-mark',
    issues: [6022],
    example: 'richtext',
    run: async ctx => {
      await clear(ctx)
      await ctx.typeWord('plain')
      await ctx.commit('plain ')
      await ctx.editor(editor => editor.addMark('bold', true))
      await ctx.typeWord('bold')
      await ctx.finish()
      const leaves = await ctx.editor(editor => editor.children[0].children)
      const problems = await expectText(ctx, 'plain bold')
      const boldText = leaves
        .filter(leaf => leaf.bold)
        .map(leaf => leaf.text)
        .join('')
      if (boldText !== 'bold')
        problems.push(
          `expected bold "bold", got leaves ${JSON.stringify(leaves)}`
        )
      ctx.imeState()
      return problems
    },
  },
  {
    name: 'delete-surrounding-text',
    issues: [4959],
    example: 'plaintext',
    run: async ctx => {
      await clear(ctx)
      await ctx.commit('hello world')
      await ctx.deleteAround(6)
      await ctx.commit('there')
      return [
        ...(await expectText(ctx, 'hellothere')),
        ...(await expectCaret(ctx, 10)),
      ]
    },
  },
]
