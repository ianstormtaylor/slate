import { Editor } from '@gitbook/slate-react'
import { Value } from '@gitbook/slate'

import React from 'react'
import initialValue from './value.json'
import styled from 'react-emotion'

/**
 * Create a few styling components.
 *
 * @type {Component}
 */

const ItemWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;

  & + & {
    margin-top: 0;
  }
`

const CheckboxWrapper = styled('span')`
  margin-right: 0.75em;
`

const ContentWrapper = styled('span')`
  flex: 1;
  opacity: ${props => (props.checked ? 0.666 : 1)};
  text-decoration: ${props => (props.checked ? 'none' : 'line-through')};

  &:focus {
    outline: none;
  }
`

/**
 * Check list item.
 *
 * @type {Component}
 */

class CheckListItem extends React.Component {
  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} event
   */

  onChange = event => {
    const checked = event.target.checked
    const { editor, node } = this.props
    editor.change(c => c.setNodeByKey(node.key, { data: { checked } }))
  }

  /**
   * Render a check list item, using `contenteditable="false"` to embed the
   * checkbox right next to the block's text.
   *
   * @return {Element}
   */

  render() {
    const { attributes, children, node, readOnly } = this.props
    const checked = node.data.get('checked')
    return (
      <ItemWrapper {...attributes}>
        <CheckboxWrapper contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </CheckboxWrapper>
        <ContentWrapper
          checked={checked}
          contentEditable={!readOnly}
          suppressContentEditableWarning
        >
          {children}
        </ContentWrapper>
      </ItemWrapper>
    )
  }
}

/**
 * The rich text example.
 *
 * @type {Component}
 */

class CheckLists extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <Editor
        spellCheck
        placeholder="Get to work..."
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    switch (props.node.type) {
      case 'check-list-item':
        return <CheckListItem {...props} />
    }
  }

  /**
   * On change, save the new value.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On key down...
   *
   * If enter is pressed inside of a check list item, make sure that when it
   * is split the new item starts unchecked.
   *
   * If backspace is pressed when collapsed at the start of a check list item,
   * then turn it back into a paragraph.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Value|Void}
   */

  onKeyDown = (event, change) => {
    const { value } = change

    if (event.key == 'Enter' && value.startBlock.type == 'check-list-item') {
      change.splitBlock().setBlocks({ data: { checked: false } })
      return true
    }

    if (
      event.key == 'Backspace' &&
      value.isCollapsed &&
      value.startBlock.type == 'check-list-item' &&
      value.selection.startOffset == 0
    ) {
      change.setBlocks('paragraph')
      return true
    }
  }
}

/**
 * Export.
 */

export default CheckLists
