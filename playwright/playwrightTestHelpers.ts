import { Page } from '@playwright/test'

export type DisptachDropEvent = {
  page: Page
  element: Element
  droppedText: string
  clientX: number
  clientY: number
}

export const dispatchDropEvent = async ({
  page,
  element,
  droppedText,
  clientX,
  clientY,
}: DisptachDropEvent) =>
  page.evaluate(
    ({
      element,
      droppedText,
      clientX,
      clientY,
    }: Omit<DisptachDropEvent, 'page'>) => {
      const fragmentData = JSON.stringify([{ type: 'text', text: droppedText }])
      const encodedFragment = btoa(encodeURIComponent(fragmentData))

      const dataTransfer = new DataTransfer()
      dataTransfer.setData(`application/x-slate-fragment`, encodedFragment)
      const eventInit: DragEventInit = {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
        dataTransfer: dataTransfer,
      }

      const event = new DragEvent('drop', eventInit)

      element.dispatchEvent(event)
    },
    { element, droppedText, clientX, clientY }
  )
