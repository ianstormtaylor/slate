import {
  type BrowserMobileDescriptor,
  type BrowserMobileTarget,
  resolveBrowserMobileSurface,
} from './contracts'

export const AGENT_BROWSER_IOS_DEVICE_DEFAULT = 'iPhone 17 Pro'
export const AGENT_BROWSER_IOS_SESSION_DEFAULT = 'ios-proof'

const createUrl = ({
  debugQuery = 'debug=1',
  example,
  port,
}: BrowserMobileTarget) =>
  `http://localhost:${port}/examples/${example}${debugQuery ? `?${debugQuery}` : ''}`

export const createAgentBrowserIosDescriptor = (
  target: BrowserMobileTarget,
  scenario: BrowserMobileDescriptor['scenario']
): BrowserMobileDescriptor => {
  const surface = resolveBrowserMobileSurface(target.example)

  return {
    ...target,
    ...surface,
    hostReadyUrl: createUrl(target),
    scenario,
    transport: 'agent-browser-ios',
    url: createUrl(target),
  }
}

export const buildAgentBrowserIosBatch = (
  descriptor: BrowserMobileDescriptor
) =>
  JSON.stringify(
    [
      ['open', descriptor.url],
      ['wait', '2000'],
      ['click', descriptor.editorSelector],
      ...(descriptor.selectionPrepScript
        ? [['eval', descriptor.selectionPrepScript]]
        : []),
      ['type', descriptor.editorSelector, 'sushi'],
      [
        'eval',
        `document.querySelector("${descriptor.debugJsonSelector}")?.textContent`,
      ],
    ],
    null,
    2
  )
