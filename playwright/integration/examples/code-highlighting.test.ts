import { test, expect, Page } from '@playwright/test'

test.describe('code highlighting', () => {
  test.beforeEach(async ({ page }) => {
    page.goto('http://localhost:3000/examples/code-highlighting')
  })

  for (const testCase of getTestCases()) {
    const { language, content, highlights } = testCase

    test(`highlights ${language} tags`, async ({ page }) => {
      await setText(page, content, language)

      const tokens = await page
        .locator('[data-slate-editor] [data-slate-string]')
        .all()

      for (const [index, token] of tokens.entries()) {
        const highlight = highlights[index]
        const textContent = await token.textContent()

        await expect(textContent).toEqual(highlight[0])
        await expect(token).toHaveCSS('color', highlight[1])
      }
    })
  }
})

// it also tests if select works the right way
async function setText(page: Page, text: string, language: string) {
  await page.locator('[data-slate-editor]').click() // focus on the editor
  const isMac = await page.evaluate(() => {
    return /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
  })
  if (isMac) {
    await page.keyboard.press('Meta+A')
  } else {
    await page.keyboard.press('Control+A')
  }
  await page.keyboard.type(text)

  const codeLine = await page
    .locator('[data-slate-element-type="code-line"]')
    .nth(0)

  const select = await codeLine.locator('select').nth(0)

  await select.selectOption({ value: language }) // Select the language option
  await expect(await select.inputValue()).toBe(language) // Confirm value to avoid race condition
}

function getTestCases() {
  const testCases: {
    language: string
    content: string
    highlights: [string, string][]
  }[] = [
    {
      language: 'css',
      content: `body {
  background-color: lightblue;
}`,
      highlights: [
        ['body', 'rgb(102, 153, 0)'],
        [' ', 'rgb(0, 0, 0)'],
        ['{', 'rgb(153, 153, 153)'],
        ['  ', 'rgb(0, 0, 0)'],
        ['background-color', 'rgb(153, 0, 85)'],
        [':', 'rgb(153, 153, 153)'],
        [' lightblue', 'rgb(0, 0, 0)'],
        [';', 'rgb(153, 153, 153)'],
        ['}', 'rgb(153, 153, 153)'],
      ],
    },
    {
      language: 'html',
      content: `<body>
  <h1 class="title">Testing html</h1>
</body>`,
      highlights: [
        ['<', 'rgb(153, 0, 85)'],
        ['body', 'rgb(153, 0, 85)'],
        ['>', 'rgb(153, 0, 85)'],
        ['  ', 'rgb(0, 0, 0)'],
        ['<', 'rgb(153, 0, 85)'],
        ['h1', 'rgb(153, 0, 85)'],
        [' ', 'rgb(153, 0, 85)'],
        ['class', 'rgb(102, 153, 0)'],
        ['=', 'rgb(0, 119, 170)'],
        ['"', 'rgb(0, 119, 170)'],
        ['title', 'rgb(0, 119, 170)'],
        ['"', 'rgb(0, 119, 170)'],
        ['>', 'rgb(153, 0, 85)'],
        ['Testing html', 'rgb(0, 0, 0)'],
        ['</', 'rgb(153, 0, 85)'],
        ['h1', 'rgb(153, 0, 85)'],
        ['>', 'rgb(153, 0, 85)'],
        ['</', 'rgb(153, 0, 85)'],
        ['body', 'rgb(153, 0, 85)'],
        ['>', 'rgb(153, 0, 85)'],
      ],
    },
    {
      language: 'jsx',
      content: `<Title title="title" renderIcon={() => <Icon />} />`,
      highlights: [
        ['<', 'rgb(153, 0, 85)'],
        ['Title', 'rgb(221, 74, 104)'],
        [' ', 'rgb(153, 0, 85)'],
        ['title', 'rgb(102, 153, 0)'],
        ['=', 'rgb(0, 119, 170)'],
        ['"', 'rgb(0, 119, 170)'],
        ['title', 'rgb(0, 119, 170)'],
        ['"', 'rgb(0, 119, 170)'],
        [' ', 'rgb(153, 0, 85)'],
        ['renderIcon', 'rgb(102, 153, 0)'],
        ['=', 'rgb(153, 153, 153)'],
        ['{', 'rgb(153, 153, 153)'],
        ['(', 'rgb(153, 153, 153)'],
        [')', 'rgb(153, 153, 153)'],
        [' ', 'rgb(0, 0, 0)'],
        ['=>', 'rgb(154, 110, 58)'],
        [' ', 'rgb(0, 0, 0)'],
        ['<', 'rgb(153, 0, 85)'],
        ['Icon', 'rgb(221, 74, 104)'],
        [' ', 'rgb(153, 0, 85)'],
        ['/>', 'rgb(153, 0, 85)'],
        ['}', 'rgb(153, 153, 153)'],
        [' ', 'rgb(153, 0, 85)'],
        ['/>', 'rgb(153, 0, 85)'],
      ],
    },
  ]

  return testCases
}
