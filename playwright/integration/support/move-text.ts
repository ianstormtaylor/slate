import { Page, expect } from '@playwright/test'

export type StringPoint = { text: string; offset: number }

export const selectStrings = async (
  page: Page,
  anchor: StringPoint,
  focus: StringPoint
) => {
  await page.waitForFunction(
    texts =>
      texts.every(text =>
        Array.from(document.querySelectorAll('[data-slate-string]')).some(
          element => element.textContent === text
        )
      ),
    [anchor.text, focus.text]
  )
  await page.evaluate(
    ({ anchor, focus }) => {
      const textNodeOf = (text: string) => {
        const strings = Array.from(
          document.querySelectorAll('[data-slate-string]')
        )
        const match = strings.find(element => element.textContent === text)
        if (!match?.firstChild) {
          throw new Error(`No Slate string with text "${text}"`)
        }
        return match.firstChild
      }
      window
        .getSelection()!
        .setBaseAndExtent(
          textNodeOf(anchor.text),
          anchor.offset,
          textNodeOf(focus.text),
          focus.offset
        )
    },
    { anchor, focus }
  )
  await expect
    .poll(() => page.evaluate(() => window.getSelection()!.toString()))
    .not.toBe('')
  await page.waitForTimeout(250)
}

const stringBox = async (page: Page, text: string) =>
  page.evaluate(text => {
    const match = Array.from(
      document.querySelectorAll('[data-slate-string]')
    ).find(element => element.textContent === text)
    if (!match) {
      throw new Error(`No Slate string with text "${text}"`)
    }
    const { x, y, width, height } = match.getBoundingClientRect()
    return { x, y, width, height }
  }, text)

export const dragSelection = async (
  page: Page,
  from: string,
  to: { text: string; edge: 'start' | 'middle' | 'end' }
) => {
  const source = await stringBox(page, from)
  const target = await stringBox(page, to.text)
  const sourceY = source.y + source.height / 2
  const targetY = target.y + target.height / 2
  const targetX =
    to.edge === 'start'
      ? target.x + 1
      : to.edge === 'end'
      ? target.x + target.width - 1
      : target.x + target.width / 2

  await page.mouse.move(source.x + 8, sourceY)
  await page.mouse.down()
  await page.mouse.move(source.x + 12, sourceY, { steps: 3 })
  await page.mouse.move(targetX + 3, targetY, { steps: 15 })
  await page.mouse.move(targetX, targetY, { steps: 5 })
  await page.mouse.up()
}

export const cutWithShortcut = async (page: Page) => {
  await page.evaluate(() => {
    const capture = window as unknown as { cutHtml?: string }
    document.addEventListener(
      'cut',
      event => {
        capture.cutHtml = event.clipboardData?.getData('text/html') ?? ''
      },
      { once: true }
    )
  })
  await page.keyboard.press('ControlOrMeta+X')
  const html = await page.evaluate(
    () => (window as unknown as { cutHtml?: string }).cutHtml ?? ''
  )
  const [, encoded] = html.match(/data-slate-fragment="([^"]+)"/) ?? []
  return encoded
    ? JSON.parse(decodeURIComponent(Buffer.from(encoded, 'base64').toString()))
    : null
}

export const blockTexts = async (page: Page) =>
  (
    await page
      .getByRole('textbox')
      .locator(':scope > [data-slate-node="element"]')
      .allTextContents()
  ).map(text => text.replace(/﻿/g, ''))
