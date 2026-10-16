import { test, expect, Page } from '@playwright/test'
import { clearEditor, getEditorHandle } from '../support/editor'

test.describe('paste html example', () => {
  test.beforeEach(async ({ page }) => await page.goto('/examples/paste-html'))

  const pasteHtml = async (page: Page, htmlContent: string) => {
    await clearEditor(page.getByRole('textbox'))
    await page
      .getByRole('textbox')
      .evaluate((el: HTMLElement, htmlContent: string) => {
        const clipboardEvent = Object.assign(
          new Event('paste', { bubbles: true, cancelable: true }),
          {
            clipboardData: {
              getData: (type = 'text/html') => htmlContent,
              types: ['text/html'],
            },
          }
        )
        el.dispatchEvent(clipboardEvent)
      }, htmlContent)
  }

  const imageUrl =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  const image = `<img src="${imageUrl}">`

  for (const [name, html, text, imageCount] of [
    ['between text', `<p>before${image}after</p>`, ['before', 'after'], 1],
    ['at the start', `<p>${image}after</p>`, ['after'], 1],
    ['at the end', `<p>before${image}</p>`, ['before'], 1],
    ['alone', `<p>${image}</p>`, [], 1],
    [
      'consecutive',
      `<p>before${image}${image}after</p>`,
      ['before', 'after'],
      2,
    ],
    ['standalone', image, [], 1],
    [
      'between blocks',
      `<p>before</p>${image}<p>after</p>`,
      ['before', 'after'],
      1,
    ],
  ] as const) {
    test(`pasted image ${name} preserves the surrounding text`, async ({
      page,
    }) => {
      await pasteHtml(page, html)
      const element = page.getByRole('textbox')
      await expect(element.locator('img')).toHaveCount(imageCount)
      await expect(element.locator('p')).toHaveText([...text])
      const editor = await getEditorHandle(element)
      const contents = await editor.evaluate(editor =>
        editor.children.map(node => {
          if (!('children' in node)) return node.text
          if ('url' in node) return node.url
          return node.children
            .map(child => ('text' in child ? child.text : ''))
            .join('')
        })
      )
      const expected =
        name === 'at the start'
          ? [imageUrl, 'after']
          : name === 'at the end'
          ? ['before', imageUrl]
          : name === 'alone' || name === 'standalone'
          ? [imageUrl]
          : name === 'consecutive'
          ? ['before', imageUrl, imageUrl, 'after']
          : ['before', imageUrl, 'after']
      expect(contents).toEqual(expected)
      await editor.dispose()
    })
  }

  test('splitting a paragraph around an image keeps marks and links', async ({
    page,
  }) => {
    await pasteHtml(
      page,
      `<p><strong>before${image}after</strong><a href="https://example.com">link</a></p>`
    )
    const element = page.getByRole('textbox')
    await expect(element.locator('img')).toHaveCount(1)
    await expect(element.locator('p strong')).toHaveText(['before', 'after'])
    await expect(element.locator('p a')).toHaveText('link')
    await expect(element.locator('p')).toHaveText(['before', 'afterlink'])
  })

  test('splitting an image paragraph inside a list keeps one list item', async ({
    page,
  }) => {
    await pasteHtml(page, `<ul><li><p>before${image}after</p></li></ul>`)
    const element = page.getByRole('textbox')
    await expect(element.locator('ul > li')).toHaveCount(1)
    await expect(element.locator('li img')).toHaveCount(1)
    await expect(element.locator('li > p')).toHaveText(['before', 'after'])
  })

  test('pasted bold text uses <strong>', async ({ page }) => {
    await pasteHtml(page, '<strong>Hello Bold</strong>')
    expect(await page.locator('strong').textContent()).toContain('Hello')
  })

  test('pasted link inside bold keeps the link and the bold', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))

    await pasteHtml(
      page,
      '<strong><a href="https://example.com">bold link</a></strong>'
    )

    const link = page
      .getByRole('textbox')
      .locator('a[href^="https://example.com"]')
    await expect(link).toHaveCount(1)
    expect(await link.locator('strong').textContent()).toContain('bold link')
    expect(errors).toEqual([])
  })

  test('pasted code uses <code>', async ({ page }) => {
    await pasteHtml(page, '<code>console.log("hello from slate!")</code>')
    expect(await page.locator('code').textContent()).toContain('slate!')
  })

  for (const container of ['body', 'div', 'blockquote', 'ul', 'ol']) {
    test(`ignores formatting whitespace between blocks in ${container}`, async ({
      page,
    }) => {
      const tag = container === 'ul' || container === 'ol' ? 'li' : 'p'
      const content = `\n  <${tag}>First</${tag}>\n  <${tag}>Second</${tag}>\n`
      await pasteHtml(
        page,
        container === 'body'
          ? content
          : `<${container}>${content}</${container}>`
      )
      const element = page.getByRole('textbox')
      await expect(element.locator(tag)).toHaveText(['First', 'Second'])
      const editor = await getEditorHandle(element)
      expect(
        await editor.evaluate(editor =>
          Array.from(
            editor.nodes({ at: [], match: node => 'text' in node }),
            ([node]) => ('text' in node ? node.text : null)
          )
        )
      ).toEqual(['First', 'Second'])
      expect(await editor.evaluate(editor => editor.selection)).toEqual(
        await editor.evaluate(editor => ({
          anchor: editor.end([]),
          focus: editor.end([]),
        }))
      )
      await page.keyboard.type('!')
      await expect(element.locator(tag).last()).toHaveText('Second!')
      await editor.dispose()
    })
  }

  for (const container of ['p', 'div']) {
    test(`preserves spaces between inline marks in ${container}`, async ({
      page,
    }) => {
      await pasteHtml(
        page,
        `<${container}><strong>First</strong> <em>Second</em></${container}>`
      )
      await expect(page.getByRole('textbox')).toHaveText('First Second')
    })
  }

  test('preserves explicit blank paragraphs and preformatted whitespace', async ({
    page,
  }) => {
    await pasteHtml(
      page,
      '<p>First</p>\n<p><br></p>\n<p>&nbsp;</p>\n<pre><code>  code\n  next  </code></pre>'
    )
    const element = page.getByRole('textbox')
    await expect(element.locator('p')).toHaveCount(3)
    await expect(element.locator('pre')).toHaveText('  code\n  next  ')
    const editor = await getEditorHandle(element)
    expect(
      await editor.evaluate(editor =>
        Array.from(
          editor.nodes({ at: [], match: node => 'text' in node }),
          ([node]) => ('text' in node ? node.text : null)
        )
      )
    ).toEqual(['First', '\n', '\u00a0', '  code\n  next  '])
    await editor.dispose()
  })
})
