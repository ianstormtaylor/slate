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

const clearAndSettle = async ctx => {
  await clear(ctx)
  await ctx.wait(400)
}

const addMention = async ctx => {
  await clearAndSettle(ctx)
  await ctx.editor(editor => {
    editor.insertText('before ')
    editor.insertNodes({
      type: 'mention',
      character: 'R2-D2',
      children: [{ text: '' }],
    })
    editor.select(editor.end([]))
    editor.insertText(' ')
  })
  await ctx.wait(400)
}

const expectKeyboard = (ctx, expected = true) =>
  ctx.keyboardShown() === expected
    ? []
    : [`expected keyboard ${expected ? 'visible' : 'hidden'}`]

const changeComposingParagraph = async (ctx, mode) => {
  await clearAndSettle(ctx)
  await ctx.commit('existing')
  await ctx.setSelection(0)
  await ctx.key('enter')
  await ctx.setSelection(0)
  await ctx.typeWord('new')
  if (mode === 'finished-control') await ctx.finish()
  if (mode === 'move-away-control') {
    await ctx.tap(ctx.page.locator('[data-slate-editor] > *').nth(1))
    await ctx.tap(ctx.page.locator('[data-slate-editor] > *').first())
  }
  await ctx.tap(
    ctx.page.getByRole('button', { name: 'looks_one', exact: true })
  )
  const problems = await expectText(ctx, 'new\nexisting')
  const type = await ctx.editor(editor => editor.children[0].type)
  if (type !== 'heading-one') problems.push(`expected heading-one, got ${type}`)
  await ctx.compose('more')
  await ctx.finish()
  problems.push(...(await expectText(ctx, 'newmore\nexisting')))
  return problems
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
  ...[true, false].map(newLine => ({
    name: `item35-second-composing-character${
      newLine ? '-new-line' : '-empty-control'
    }`,
    issues: [6051],
    example: 'richtext',
    run: async ctx => {
      await clearAndSettle(ctx)
      if (newLine) {
        await ctx.commit('first')
        await ctx.key('enter')
      }
      await ctx.compose('Y')
      await ctx.compose('Yo')
      await ctx.finish()
      return [
        ...(await expectText(ctx, newLine ? 'first\nYo' : 'Yo')),
        ...(await expectCaret(ctx, 2, [newLine ? 1 : 0, 0])),
      ]
    },
  })),
  ...[
    ['letters', ['A', 'AB', 'ABC'], 'ABC', ['a', 'ab', 'abc'], 'abc'],
    ['digits-control', ['1', '12', '123'], '123', ['!', '!@', '!@#'], '!@#'],
  ].map(([name, first, firstText, second, secondText]) => ({
    name: `item35-fast-composition-${name}`,
    issues: [5666],
    example: 'richtext',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.composeSequence(first)
      await ctx.finish()
      await ctx.key('enter')
      await ctx.composeSequence(second)
      await ctx.finish()
      return [
        ...(await expectText(ctx, `${firstText}\n${secondText}`)),
        ...(await expectCaret(ctx, secondText.length, [1, 0])),
      ]
    },
  })),
  {
    name: 'item35-multiword-suggestion',
    issues: [5643],
    example: 'richtext',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.typeWord('hel')
      await ctx.commit('help me')
      return [
        ...(await expectText(ctx, 'help me')),
        ...(await expectCaret(ctx, 7)),
      ]
    },
  },
  ...[true, false].map(scroll => ({
    name: `item35-tall-block-${scroll ? 'scroll' : 'control'}`,
    issues: [5291],
    example: 'plaintext',
    run: async ctx => {
      await clearAndSettle(ctx)
      const initial = Array.from({ length: 40 }, (_, i) => `line ${i}`).join(
        '\n'
      )
      await ctx.editor((editor, value) => editor.insertText(value), initial)
      await ctx.page
        .locator('[data-slate-editor]')
        .evaluate((element, scrolling) => {
          element.style.height = scrolling ? '160px' : 'auto'
          element.style.overflow = scrolling ? 'scroll' : 'visible'
        }, scroll)
      await ctx.caret({ anchor: 'end' })
      await ctx.wait(400)
      await ctx.typeWord('tail')
      await ctx.finish()
      await ctx.key('enter')
      await ctx.typeWord('next')
      await ctx.finish()
      const problems = await expectText(ctx, `${initial}tail\nnext`)
      const visible = await ctx.page
        .locator('[data-slate-editor]')
        .evaluate(element => {
          const selection = window.getSelection()
          if (!selection?.rangeCount) return false
          const caret = selection.getRangeAt(0).getBoundingClientRect()
          const box = element.getBoundingClientRect()
          const viewport = window.visualViewport
          const top = viewport?.offsetTop ?? 0
          const bottom = top + (viewport?.height ?? innerHeight)
          return (
            caret.height > 0 &&
            caret.top >= Math.max(box.top, top) - 1 &&
            caret.bottom <= Math.min(box.bottom, bottom) + 1
          )
        })
      problems.push(...(await expectCaret(ctx, 4, [1, 0])))
      if (!visible) problems.push('caret outside editor or visible viewport')
      return problems
    },
  })),
  {
    name: 'item35-backspace-inline-keyboard',
    issues: [5680],
    example: 'mentions',
    run: async ctx => {
      await addMention(ctx)
      const problems = expectKeyboard(ctx)
      for (let i = 0; i < 2; i++) {
        await ctx.key('delete')
        problems.push(...expectKeyboard(ctx))
      }
      const mentions = await ctx.editor(
        editor =>
          editor.children[0].children.filter(node => node.type === 'mention')
            .length
      )
      if (mentions)
        problems.push('mention remains after deleting space and mention')
      await ctx.compose('ok')
      await ctx.finish()
      problems.push(...(await expectText(ctx, 'before ok')))
      return problems
    },
  },
  ...[true, false].map(mention => ({
    name: `item35-tap-${mention ? 'mention' : 'text-control'}-keyboard`,
    issues: [5183, 5680],
    example: 'mentions',
    run: async ctx => {
      await addMention(ctx)
      await ctx.hideKeyboard()
      const problems = expectKeyboard(ctx, false)
      await ctx.tap(
        ctx.page
          .locator(
            mention ? '[data-cy="mention-R2-D2"]' : '[data-slate-string]'
          )
          .first()
      )
      problems.push(...expectKeyboard(ctx))
      if (mention) {
        const caret = await caretOffset(ctx)
        if (JSON.stringify(caret?.path) !== '[0,1,0]')
          problems.push(`mention not selected: ${JSON.stringify(caret)}`)
      }
      return problems
    },
  })),
  ...['tap', 'key-control'].map(method => ({
    name: `item35-insert-last-mention-${method}`,
    issues: [5175],
    example: 'mentions',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.compose('@R2')
      await ctx.finish()
      const suggestion = ctx.page
        .locator('[data-cy="mentions-portal"]')
        .getByText('R2-D2', { exact: true })
      await suggestion.waitFor()
      if (method === 'tap') await ctx.tap(suggestion)
      else await ctx.key('enter')
      const children = await ctx.editor(editor => editor.children[0].children)
      const problems = []
      if (
        !children.some(
          node => node.type === 'mention' && node.character === 'R2-D2'
        )
      )
        problems.push(`mention not inserted: ${JSON.stringify(children)}`)
      const selected = await ctx.state()
      if (!selected.focused)
        problems.push(`editor lost focus after ${method} suggestion selection`)
      await ctx.compose('after')
      await ctx.finish()
      problems.push(...(await expectText(ctx, 'after')))
      return problems
    },
  })),
  {
    name: 'item35-predictive-prefixes',
    issues: [5130],
    example: 'richtext',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.composeSequence(['h', 'he', 'hel', 'hell', 'hello'])
      await ctx.commit('hello ')
      await ctx.composeSequence(['w', 'wo', 'wor', 'worl', 'world'])
      await ctx.commit('world')
      return [
        ...(await expectText(ctx, 'hello world')),
        ...(await expectCaret(ctx, 11)),
      ]
    },
  },
  ...[false, true].map(finish => ({
    name: `item35-send-${finish ? 'finished-control' : 'while-composing'}`,
    issues: [5019],
    example: 'plaintext',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.editor(editor => {
        const plain = nodes =>
          nodes.map(node => node.text ?? plain(node.children)).join('')
        window.__lastValue = plain(editor.children)
        const onChange = editor.onChange
        editor.onChange = options => {
          window.__lastValue = plain(editor.children)
          onChange(options)
        }
        const button = document.createElement('button')
        button.id = 'item35-send'
        button.textContent = 'Send'
        button.style.cssText =
          'position:fixed;top:0;left:0;z-index:99999;width:80px;height:40px'
        button.onclick = () => {
          window.__sentValue = window.__lastValue
        }
        document.body.append(button)
      })
      await ctx.typeWord('hello')
      await ctx.commit('hello ')
      await ctx.typeWord('world')
      if (finish) await ctx.finish()
      await ctx.tap(ctx.page.locator('#item35-send'))
      const sent = await ctx.page.evaluate(() => window.__sentValue)
      return sent === 'hello world'
        ? []
        : [`send captured ${JSON.stringify(sent)}`]
    },
  })),
  ...['while-composing', 'move-away-control', 'finished-control'].map(mode => ({
    name: `item35-change-paragraph-${mode}`,
    issues: [4861],
    example: 'richtext',
    run: ctx => changeComposingParagraph(ctx, mode),
  })),
  ...[true, false].map(image => ({
    name: `item35-tap-${image ? 'image' : 'image-text-control'}`,
    issues: [4719],
    example: 'images',
    localImages: true,
    run: async ctx => {
      const target = ctx.page
        .locator(image ? '[data-slate-editor] img' : '[data-slate-string]')
        .first()
      await ctx.tap(target)
      const state = await ctx.state()
      const path = state.selection?.anchor.path
      const node = path && state.children[path[0]]
      const problems = []
      if (!node || (node.type === 'image') !== image)
        problems.push(`tap selected ${JSON.stringify(state.selection)}`)
      if (image) {
        const shadow = await target.evaluate(
          element => getComputedStyle(element).boxShadow
        )
        if (shadow === 'none') problems.push('image has no selected outline')
      }
      return problems
    },
  })),
  {
    name: 'item35-suggestion-context-after-replacement',
    issues: [4531],
    example: 'plaintext',
    run: async ctx => {
      await clearAndSettle(ctx)
      await ctx.commit('it ')
      await ctx.typeWord('worjs')
      await ctx.commit('works')
      await ctx.region(3, 8)
      await ctx.compose('worked')
      await ctx.finish()
      const input = ctx.imeState()
      const problems = await expectText(ctx, 'it worked')
      if (!input.trimEnd().endsWith(':it worked'))
        problems.push(`unexpected input context ${input}`)
      problems.push(...expectKeyboard(ctx), ...(await expectCaret(ctx, 9)))
      return problems
    },
  },
]
