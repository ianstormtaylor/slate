import { ReactEditor } from '../../plugin/react-editor'
import { Editor, Node as SlateNode, Path, Range, Transforms } from 'slate'
import { Diff, diffText } from './diff-text'
import { DOMNode } from '../../utils/dom'
import {
  EDITOR_TO_ON_CHANGE,
  EDITOR_TO_RESTORE_DOM,
} from '../../utils/weak-maps'

const debug = (...message: any[]) => {}

/**
 * Unicode String for a ZERO_WIDTH_SPACE
 *
 * @type {String}
 */

const ZERO_WIDTH_SPACE = String.fromCharCode(65279)

function restoreDOM(editor: ReactEditor) {
  try {
    const onRestoreDOM = EDITOR_TO_RESTORE_DOM.get(editor)
    if (onRestoreDOM) {
      onRestoreDOM()
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

function flushController(editor: ReactEditor): void {
  try {
    const onChange = EDITOR_TO_ON_CHANGE.get(editor)
    if (onChange) {
      onChange()
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

function renderSync(editor: ReactEditor, fn: () => void) {
  try {
    fn()
    flushController(editor)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

/**
 * Takes text from a dom node and an offset within that text and returns an
 * object with fixed text and fixed offset which removes zero width spaces
 * and adjusts the offset.
 *
 * Optionally, if an `isLastNode` argument is passed in, it will also remove
 * a trailing newline.
 *
 * @param {String} prevText
 * @param {Number} prevOffset
 * @param {Boolean} isLastNode
 */

function fixTextAndOffset(
  prevText: string,
  prevOffset = 0,
  isLastNode = false
) {
  let nextOffset = prevOffset
  let nextText = prevText
  let index = 0

  while (index !== -1) {
    index = nextText.indexOf(ZERO_WIDTH_SPACE, index)
    if (index === -1) break
    if (nextOffset > index) nextOffset--
    nextText = `${nextText.slice(0, index)}${nextText.slice(index + 1)}`
  }

  // remove the last newline if we are in the last node of a block
  const lastChar = nextText.charAt(nextText.length - 1)

  if (isLastNode && lastChar === '\n') {
    nextText = nextText.slice(0, -1)
  }

  const maxOffset = nextText.length

  if (nextOffset > maxOffset) nextOffset = maxOffset
  return { text: nextText, offset: nextOffset }
}

/**
 * Based loosely on:
 *
 * https://github.com/facebook/draft-js/blob/master/src/component/handlers/composition/DOMObserver.js
 * https://github.com/ProseMirror/prosemirror-view/blob/master/src/domobserver.js
 *
 * But is an analysis mainly for `backspace` and `enter` as we handle
 * compositions as a single operation.
 *
 * @param {} editor
 */

export class AndroidInputManager {
  /**
   * A MutationObserver that flushes to the method `flush`
   *
   * @type {MutationObserver}
   */

  private readonly observer: MutationObserver

  private rootEl?: HTMLElement = undefined

  /**
   * Object that keeps track of the most recent state
   */

  private lastPath?: Path = undefined
  private lastDiff?: Diff = undefined
  private lastRange?: Range = undefined
  private lastDomNode?: Node = undefined

  constructor(private editor: ReactEditor) {
    this.observer = new MutationObserver(this.flush)
  }

  onDidMount = () => {
    this.connect()
  }

  onDidUpdate = () => {
    this.connect()
  }

  /**
   * Connect the MutationObserver to a specific editor root element
   */

  connect = () => {
    debug('connect')

    const rootEl = ReactEditor.toDOMNode(this.editor, this.editor)
    if (this.rootEl === rootEl) return
    this.rootEl = rootEl

    debug('connect:run')

    this.observer.disconnect()
    this.observer.observe(rootEl, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
      characterDataOldValue: true,
    })
  }

  onWillUnmount = () => {
    this.disconnect()
  }

  disconnect = () => {
    debug('disconnect')
    this.observer.disconnect()
    this.rootEl = undefined
  }

  onRender = () => {
    this.disconnect()
    this.clearDiff()
  }

  private clearDiff = () => {
    debug('clearDiff')
    this.bufferedMutations.length = 0
    this.lastPath = undefined
    this.lastDiff = undefined
  }

  /**
   * Clear the `last` properties related to an action only
   */

  private clearAction = () => {
    debug('clearAction')

    this.bufferedMutations.length = 0
    this.lastDiff = undefined
    this.lastDomNode = undefined
  }

  /**
   * Apply the last `diff`
   *
   * We don't want to apply the `diff` at the time it is created because we
   * may be in a composition. There are a few things that trigger the applying
   * of the saved diff. Sometimes on its own and sometimes immediately before
   * doing something else with the Editor.
   *
   * - `onCompositionEnd` event
   * - `onSelect` event only when the user has moved into a different node
   * - The user hits `enter`
   * - The user hits `backspace` and removes an inline node
   * - The user hits `backspace` and merges two blocks
   */

  private applyDiff = () => {
    debug('applyDiff')
    if (this.lastPath === undefined || this.lastDiff === undefined) return
    debug('applyDiff:run')
    const range: Range = {
      anchor: { path: this.lastPath, offset: this.lastDiff.start },
      focus: { path: this.lastPath, offset: this.lastDiff.end },
    }

    Transforms.insertText(this.editor, this.lastDiff.insertText, { at: range })
  }

  /**
   * Handle `enter` that splits block
   */

  private splitBlock = () => {
    debug('splitBlock')

    renderSync(this.editor, () => {
      this.applyDiff()

      Transforms.splitNodes(this.editor, { always: true })
      ReactEditor.focus(this.editor)

      this.clearAction()
      restoreDOM(this.editor)
      flushController(this.editor)
    })
  }

  /**
   * Handle `backspace` that merges blocks
   */

  private mergeBlock = () => {
    debug('mergeBlock')

    /**
     * The delay is required because hitting `enter`, `enter` then `backspace`
     * in a word results in the cursor being one position to the right in
     * Android 9.
     *
     * Slate sets the position to `0` and we even check it immediately after
     * setting it and it is correct, but somewhere Android moves it to the right.
     *
     * This happens only when using the virtual keyboard. Hitting enter on a
     * hardware keyboard does not trigger this bug.
     *
     * The call to `focus` is required because when we switch examples then
     * merge a block, we lose focus in Android 9 (possibly others).
     */

    window.requestAnimationFrame(() => {
      renderSync(this.editor, () => {
        this.applyDiff()

        Transforms.select(this.editor, this.lastRange!)
        Editor.deleteBackward(this.editor)
        ReactEditor.focus(this.editor)

        this.clearAction()
        restoreDOM(this.editor)
        flushController(this.editor)
      })
    })
  }

  /**
   * The requestId used to the save selection
   */

  private onSelectTimeoutId: number | null = null
  private bufferedMutations: MutationRecord[] = []
  private startActionFrameId: number | null = null
  private isFlushing = false

  /**
   * Mark the beginning of an action. The action happens when the
   * `requestAnimationFrame` expires.
   *
   * If `onKeyDown` is called again, it pushes the `action` to a new
   * `requestAnimationFrame` and cancels the old one.
   */

  private startAction = () => {
    debug('startAction')
    if (this.onSelectTimeoutId) {
      window.cancelAnimationFrame(this.onSelectTimeoutId)
      this.onSelectTimeoutId = null
    }

    this.isFlushing = true

    if (this.startActionFrameId) {
      window.cancelAnimationFrame(this.startActionFrameId)
    }

    this.startActionFrameId = window.requestAnimationFrame((): void => {
      if (this.bufferedMutations.length > 0) {
        this.flushAction(this.bufferedMutations)
      }

      this.startActionFrameId = null
      this.bufferedMutations.length = 0
      this.isFlushing = false
    })
  }

  /**
   * Handle MutationObserver flush
   *
   * @param {MutationRecord[]} mutations
   */

  flush = (mutations: MutationRecord[]) => {
    debug('flush')
    this.bufferedMutations.push(...mutations)
    this.startAction()
  }

  /**
   * Handle a `requestAnimationFrame` long batch of mutations.
   *
   * @param {Array} mutations
   */

  private flushAction = (mutations: MutationRecord[]) => {
    try {
      debug('flushAction', mutations.length, mutations)

      const removedNodes = mutations.filter(
        mutation => mutation.removedNodes.length > 0
      ).length
      const addedNodes = mutations.filter(
        mutation => mutation.addedNodes.length > 0
      ).length

      if (removedNodes > addedNodes) {
        this.mergeBlock()
      } else if (addedNodes > removedNodes) {
        this.splitBlock()
      } else {
        this.resolveDOMNode(mutations[0].target.parentNode!)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  /**
   * Takes a DOM Node and resolves it against Slate's Document.
   *
   * Saves the changes to `last.diff` which can be applied later using
   * `applyDiff()`
   *
   * @param {DOMNode} domNode
   */

  private resolveDOMNode = (domNode: DOMNode) => {
    debug('resolveDOMNode')
    let node
    try {
      node = ReactEditor.toSlateNode(this.editor, domNode)
    } catch (e) {
      // not in react model yet.
      return
    }
    const path = ReactEditor.findPath(this.editor, node)
    const prevText = SlateNode.string(node)

    // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
    // we will have added another new line in <Leaf>'s render method to account
    // for browsers collapsing a single trailing new lines, so remove it.
    const [block] = Editor.parent(
      this.editor,
      ReactEditor.findPath(this.editor, node)
    )
    const isLastNode = block.children[block.children.length - 1] === node

    const fix = fixTextAndOffset(domNode.textContent!, 0, isLastNode)

    const nextText = fix.text

    debug('resolveDOMNode:pre:post', prevText, nextText)

    // If the text is no different, there is no diff.
    if (nextText === prevText) {
      this.lastDiff = undefined
      return
    }

    const diff = diffText(prevText, nextText)
    if (diff === null) {
      this.lastDiff = undefined
      return
    }

    this.lastPath = path
    this.lastDiff = diff

    debug('resolveDOMNode:diff', this.lastDiff)
  }

  /**
   * handle `onCompositionStart`
   */

  onCompositionStart = () => {
    debug('onCompositionStart')
  }

  /**
   * handle `onCompositionEnd`
   */

  onCompositionEnd = () => {
    debug('onCompositionEnd')

    /**
     * The timing on the `setTimeout` with `20` ms is sensitive.
     *
     * It cannot use `requestAnimationFrame` because it is too short.
     *
     * Android 9, for example, when you type `it ` the space will first trigger
     * a `compositionEnd` for the `it` part before the mutation for the ` `.
     * This means that we end up with `it` if we trigger too soon because it
     * is on the wrong value.
     */

    window.setTimeout(() => {
      if (this.lastDiff !== undefined) {
        debug('onCompositionEnd:applyDiff')

        renderSync(this.editor, () => {
          this.applyDiff()

          const domRange = window.getSelection()!.getRangeAt(0)
          const domText = domRange.startContainer.textContent!
          const offset = domRange.startOffset

          const fix = fixTextAndOffset(domText, offset)

          let range = ReactEditor.toSlateRange(this.editor, domRange)
          range = {
            ...range,
            anchor: {
              ...range.anchor,
              offset: fix.offset,
            },
            focus: {
              ...range.focus,
              offset: fix.offset,
            },
          }

          /**
           * We must call `restoreDOM` even though this is applying a `diff` which
           * should not require it. But if you type `it me. no.` on a blank line
           * with a block following it, the next line will merge with the this
           * line. A mysterious `keydown` with `input` of backspace appears in the
           * event stream which the user not React caused.
           *
           * `focus` is required as well because otherwise we lose focus on hitting
           * `enter` in such a scenario.
           */

          Transforms.select(this.editor, range)
          ReactEditor.focus(this.editor)

          this.clearAction()
          restoreDOM(this.editor)
        })
      }
    }, 20)
  }

  /**
   * Handle `onSelect` event
   *
   * Save the selection after a `requestAnimationFrame`
   *
   * - If we're not in the middle of flushing mutations
   * - and cancel save if a mutation runs before the `requestAnimationFrame`
   */

  onSelect = () => {
    debug('onSelect:try')

    if (this.onSelectTimeoutId !== null) {
      window.cancelAnimationFrame(this.onSelectTimeoutId)
      this.onSelectTimeoutId = null
    }

    // Don't capture the last selection if the selection was made during the
    // flushing of DOM mutations. This means it is all part of one user action.
    if (this.isFlushing) return

    this.onSelectTimeoutId = window.requestAnimationFrame(() => {
      debug('onSelect:save-selection')

      const domSelection = window.getSelection()
      if (
        domSelection === null ||
        domSelection.anchorNode === null ||
        domSelection.anchorNode.textContent === null ||
        domSelection.focusNode === null ||
        domSelection.focusNode.textContent === null
      )
        return

      const { offset: anchorOffset } = fixTextAndOffset(
        domSelection.anchorNode.textContent,
        domSelection.anchorOffset
      )
      const { offset: focusOffset } = fixTextAndOffset(
        domSelection.focusNode!.textContent!,
        domSelection.focusOffset
      )
      let range = ReactEditor.toSlateRange(this.editor, domSelection)
      range = {
        focus: {
          path: range.focus.path,
          offset: focusOffset,
        },
        anchor: {
          path: range.anchor.path,
          offset: anchorOffset,
        },
      }

      debug('onSelect:save-data', {
        domSelection: normalizeDOMSelection(domSelection),
        range,
      })

      // If the `domSelection` has moved into a new node, then reconcile with
      // `applyDiff`
      if (
        domSelection.isCollapsed &&
        this.lastDomNode !== domSelection.anchorNode &&
        this.lastDiff !== undefined
      ) {
        debug('onSelect:applyDiff', this.lastDiff)
        this.applyDiff()
        Transforms.select(this.editor, range)

        this.clearAction()
        flushController(this.editor)
        restoreDOM(this.editor)
      }

      this.lastRange = range
      this.lastDomNode = domSelection.anchorNode
    })
  }
}

function normalizeDOMSelection(selection: Selection) {
  return {
    anchorNode: selection.anchorNode,
    anchorOffset: selection.anchorOffset,
    focusNode: selection.focusNode,
    focusOffset: selection.focusOffset,
  }
}

export default AndroidInputManager
