import { Editor, getEventTransfer } from '@gitbook/slate-react'
import { Value } from '@gitbook/slate'

import React from 'react'
import initialValue from './value.json'
import isUrl from 'is-url'
import { Button, Icon, Toolbar } from '../components'

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Change} change
 * @param {String} href
 */

function wrapLink(change, href) {
  change.wrapInline({
    type: 'link',
    data: { href },
  })

  change.collapseToEnd()
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Change} change
 */

function unwrapLink(change) {
  change.unwrapInline('link')
}

/**
 * The links example.
 *
 * @type {Component}
 */

class Links extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */

  hasLinks = () => {
    const { value } = this.state
    return value.inlines.some(inline => inline.type == 'link')
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    return (
      <div>
        <Toolbar>
          <Button active={this.hasLinks()} onMouseDown={this.onClickLink}>
            <Icon>link</Icon>
          </Button>
        </Toolbar>
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          onPaste={this.onPaste}
          renderNode={this.renderNode}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'link': {
        const { data } = node
        const href = data.get('href')
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        )
      }
    }
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   */

  onClickLink = event => {
    event.preventDefault()
    const { value } = this.state
    const hasLinks = this.hasLinks()
    const change = value.change()

    if (hasLinks) {
      change.call(unwrapLink)
    } else if (value.isExpanded) {
      const href = window.prompt('Enter the URL of the link:')
      change.call(wrapLink, href)
    } else {
      const href = window.prompt('Enter the URL of the link:')
      const text = window.prompt('Enter the text for the link:')

      change
        .insertText(text)
        .extend(0 - text.length)
        .call(wrapLink, href)
    }

    this.onChange(change)
  }

  /**
   * On paste, if the text is a link, wrap the selection in a link.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onPaste = (event, change) => {
    if (change.value.isCollapsed) return

    const transfer = getEventTransfer(event)
    const { type, text } = transfer
    if (type != 'text' && type != 'html') return
    if (!isUrl(text)) return

    if (this.hasLinks()) {
      change.call(unwrapLink)
    }

    change.call(wrapLink, text)
    return true
  }
}

/**
 * Export.
 */

export default Links
