import type { Page } from '@playwright/test'

export const enableCompositionKeyEvents = async (page: Page) => {
  await page.evaluate(() => {
    window.addEventListener(
      'compositionstart',
      () => {
        document.activeElement?.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Unidentified',
            keyCode: 220,
          })
        )
      },
      true
    )
  })
}

export const composeText = async (
  page: Page,
  steps: readonly string[],
  committedText: string
) => {
  const browserName = page.context().browser()?.browserType().name()

  if (browserName !== 'chromium') {
    await page.evaluate(
      ({ composedSteps, finalText }) => {
        const active = document.activeElement as HTMLElement | null
        const selection = document.getSelection()

        if (!active || !selection || selection.rangeCount === 0) {
          throw new Error('Missing active editable selection for composition')
        }

        const dispatchCompositionEvent = (
          type: 'compositionstart' | 'compositionupdate' | 'compositionend',
          data: string
        ) => {
          active.dispatchEvent(
            new CompositionEvent(type, {
              bubbles: true,
              cancelable: true,
              data,
            })
          )
        }

        dispatchCompositionEvent('compositionstart', composedSteps[0] ?? '')

        composedSteps.forEach((text) => {
          dispatchCompositionEvent('compositionupdate', text)
        })

        const range = selection.getRangeAt(0)

        range.deleteContents()

        const textNode = document.createTextNode(finalText)

        range.insertNode(textNode)
        range.setStart(textNode, finalText.length)
        range.setEnd(textNode, finalText.length)
        selection.removeAllRanges()
        selection.addRange(range)

        dispatchCompositionEvent('compositionend', finalText)
      },
      { composedSteps: steps, finalText: committedText }
    )

    return
  }

  const client = await page.context().newCDPSession(page)

  for (const text of steps) {
    await client.send('Input.imeSetComposition', {
      selectionStart: text.length,
      selectionEnd: text.length,
      text,
    })
  }

  await client.send('Input.insertText', {
    text: committedText,
  })
}

export const composeTextDirect = async (page: Page, committedText: string) => {
  await page.keyboard.insertText(committedText)
}
