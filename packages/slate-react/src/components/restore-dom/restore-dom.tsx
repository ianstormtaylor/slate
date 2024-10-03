import React, {
  Component,
  ComponentType,
  ContextType,
  ReactNode,
  RefObject,
} from 'react'
import { EditorContext } from '../../hooks/use-slate-static'
import { IS_ANDROID } from 'slate-dom'
import {
  createRestoreDomManager,
  RestoreDOMManager,
} from './restore-dom-manager'

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true,
}

type RestoreDOMProps = {
  children?: ReactNode
  receivedUserInput: RefObject<boolean>
  node: RefObject<HTMLDivElement>
}

// We have to use a class component here since we rely on `getSnapshotBeforeUpdate` which has no FC equivalent
// to run code synchronously immediately before react commits the component update to the DOM.
class RestoreDOMComponent extends Component<RestoreDOMProps> {
  static contextType = EditorContext
  context: ContextType<typeof EditorContext> = null

  private manager: RestoreDOMManager | null = null
  private mutationObserver: MutationObserver | null = null

  observe() {
    const { node } = this.props
    if (!node.current) {
      throw new Error('Failed to attach MutationObserver, `node` is undefined')
    }

    this.mutationObserver?.observe(node.current, MUTATION_OBSERVER_CONFIG)
  }

  componentDidMount() {
    const { receivedUserInput } = this.props
    const editor = this.context!

    this.manager = createRestoreDomManager(editor, receivedUserInput)
    this.mutationObserver = new MutationObserver(this.manager.registerMutations)

    this.observe()
  }

  getSnapshotBeforeUpdate() {
    const pendingMutations = this.mutationObserver?.takeRecords()
    if (pendingMutations?.length) {
      this.manager?.registerMutations(pendingMutations)
    }

    this.mutationObserver?.disconnect()
    this.manager?.restoreDOM()

    return null
  }

  componentDidUpdate() {
    this.manager?.clear()
    this.observe()
  }

  componentWillUnmount() {
    this.mutationObserver?.disconnect()
  }

  render() {
    return this.props.children
  }
}

export const RestoreDOM: ComponentType<RestoreDOMProps> = IS_ANDROID
  ? RestoreDOMComponent
  : ({ children }) => <>{children}</>
