import type { BrowserMobileScenarioId } from '../core/proof'

export type BrowserMobileTransportId =
  | 'agent-browser-ios'
  | 'appium-android'
  | 'appium-ios'

export type BrowserMobileSurface = {
  debugJsonSelector: string
  editorSelector: string
  selectionPrepScript?: string
}

export type BrowserMobileTarget = {
  debugQuery?: string
  example: string
  port: number
}

export type BrowserMobileDescriptor = BrowserMobileTarget & {
  debugJsonSelector: string
  editorSelector: string
  hostReadyUrl: string
  scenario: BrowserMobileScenarioId
  selectionPrepScript?: string
  transport: BrowserMobileTransportId
  url: string
}

const collapseToLeadingTextSelectionScript = `
(() => {
  const owner = document.querySelector('[data-slate-node="text"]');

  if (!owner) {
    throw new Error('Missing Slate text owner');
  }

  const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT);
  const textLeaf = walker.nextNode();

  if (!textLeaf) {
    throw new Error('Missing Slate text leaf');
  }

  const selection = document.getSelection();

  if (!selection) {
    throw new Error('Missing window selection');
  }

  selection.removeAllRanges();
  selection.collapse(textLeaf, 1);

  return true;
})()
`.trim()

export const resolveBrowserMobileSurface = (
  example: string
): BrowserMobileSurface => {
  switch (example) {
    case 'android-split-join':
      return {
        debugJsonSelector: '#android-split-join-debug-json',
        editorSelector: '[data-slate-editor="true"]',
        selectionPrepScript: `
(() => {
  const owners = Array.from(
    document.querySelectorAll('#android-split-join [data-slate-node="text"]')
  );
  const owner = owners.find((node) => node.textContent?.includes('middle'));

  if (!owner) {
    throw new Error('Missing middle text owner');
  }

  const walker = document.createTreeWalker(owner, NodeFilter.SHOW_TEXT);
  const textNode = walker.nextNode();

  if (!(textNode instanceof Text)) {
    throw new Error('Missing middle text leaf');
  }

  const selection = document.getSelection();

  if (!selection) {
    throw new Error('Missing window selection');
  }

  selection.removeAllRanges();
  selection.collapse(textNode, 3);

  return true;
})()
        `.trim(),
      }
    case 'android-empty-rebuild':
      return {
        debugJsonSelector: '#android-empty-rebuild-debug-json',
        editorSelector: '[data-slate-editor="true"]',
      }
    case 'android-remove-range':
      return {
        debugJsonSelector: '#android-remove-range-debug-json',
        editorSelector: '[data-slate-editor="true"]',
        selectionPrepScript: `
(() => {
  const button = document.querySelector('[data-test-id="prepare-remove-range"]');

  if (!(button instanceof HTMLElement)) {
    throw new Error('Missing prepare remove range button');
  }
  button.click();
  return true;
})()
        `.trim(),
      }
    case 'placeholder':
    case 'placeholder-no-feff':
      return {
        debugJsonSelector: '#placeholder-ime-debug-json',
        editorSelector: '#placeholder-ime',
      }
    case 'inline-edge':
      return {
        debugJsonSelector: '#inline-edge-ime-debug-json',
        editorSelector: '#inline-edge',
        selectionPrepScript: collapseToLeadingTextSelectionScript,
      }
    case 'void-edge':
      return {
        debugJsonSelector: '#void-edge-ime-debug-json',
        editorSelector: '#void-edge',
        selectionPrepScript: collapseToLeadingTextSelectionScript,
      }
    default:
      throw new Error(`Unsupported browser-mobile example: ${example}`)
  }
}
