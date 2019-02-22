import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'

import searchUsers from './searchUsers'
import styled from 'react-emotion'

const SuggestionList = styled('ul')`
  background: #fff;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
`

const Suggestion = styled('li')`
  align-items: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-top: 1px solid #ddd;

  display: flex;
  height: 32px;
  padding: 4px 8px;

  background: ${props => (props.isHighlighted ? 'lightblue' : 'inherit')};

  &:hover {
    background: #87cefa;
  }

  &:last-of-type {
    border-bottom: 1px solid #ddd;
  }
`

const DEFAULT_TOP_POSITION = -10000
const DEFAULT_LEFT_POSITION = -10000

/**
 * Both used to display suggestions as well as manage selection and searching
 * for results.
 *
 * Suggestions is a PureComponent because we need to prevent updates when x/ y
 * Are just going to be the same value. Otherwise we will update forever.
 */

export default class UserMentionSuggestions extends React.PureComponent {
  menuRef = React.createRef()

  state = {
    left: DEFAULT_LEFT_POSITION,
    top: DEFAULT_TOP_POSITION,
    userSuggestions: [],
  }

  static defaultProps = {
    isDisabled: false,
  }

  static propTypes = {
    /**
     * Forces this component to render `null`. This is useful if the parent
     * component doesn't actually want to render anything, but needs to maintain
     * a `ref` to this component.
     */

    isDisabled: PropTypes.bool,

    /**
     * Called when an item has been selected. Will receive the following args:
     *
     * -   item (Mixed)
     *
     *     The item that was selected.
     *
     * -   editor (Slate.Editor?)
     *
     *     The current editor, if it is available.
     */

    onItemSelected: PropTypes.func.isRequired,
  }

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this._updateMenu()
  }

  componentDidUpdate = () => {
    this._updateMenu()
  }

  render() {
    const { props, state } = this
    const root = window.document.getElementById('root')

    const isHidden =
      props.isDisabled ||
      state.userSuggestions.length === 0 ||
      state.wasEscapePressed

    if (isHidden) {
      return null
    }

    return ReactDOM.createPortal(
      <SuggestionList
        ref={this.menuRef}
        style={{
          top: this.state.top,
          left: this.state.left,
        }}
      >
        {this.state.userSuggestions.map((user, index) => {
          return (
            <Suggestion
              key={user.id}
              isHighlighted={index === this.state.highlightedIndex}
              onClick={() => this.props.onItemSelected(user)}
            >
              {user.username}
            </Suggestion>
          )
        })}
      </SuggestionList>,
      root
    )
  }

  renderSuggestions() {}

  _updateMenu() {
    const anchor = window.document.querySelector('.user-mention-context')

    if (!anchor) {
      return this.setState({
        top: DEFAULT_TOP_POSITION,
        left: DEFAULT_LEFT_POSITION,
      })
    }

    const anchorRect = anchor.getBoundingClientRect()

    this.setState({
      top: anchorRect.bottom,
      left: anchorRect.left,
    })
  }

  _updateHighlightedIndex(highlightedIndex) {
    const { state } = this

    highlightedIndex = highlightedIndex % state.userSuggestions.length

    // If the user presses up at index 0 we wrap to the bottom.
    if (highlightedIndex < 0) {
      highlightedIndex = state.userSuggestions.length + highlightedIndex
    }

    this.setState({
      highlightedIndex,
    })
  }

  // -- Public Methods ---------------------------------------------------------
  /**
   * Handles key events from the editor.
   *
   * This is public because the plugin proxies events from the editor into
   * this component. That way we can keep all of the selection logic in one
   * place.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @returns {?Boolean}
   */

  onKeyDown = (event, editor) => {
    const { props, state } = this

    if (props.isDisabled) {
      return
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        this._updateHighlightedIndex(this.state.highlightedIndex - 1)
        return true
      case 'ArrowDown':
        event.preventDefault()
        this._updateHighlightedIndex(this.state.highlightedIndex + 1)
        return true
      case 'Enter':
      case 'Tab':
        if (state.userSuggestions.length === 0) {
          return
        }

        event.preventDefault()

        this.props.onItemSelected(
          state.userSuggestions[state.highlightedIndex],
          editor
        )

        return true
      case 'Escape':
        this.setState({
          wasEscapePressed: true,
        })
        return true
    }
  }

  /**
   * Should be called from outside the component whenever the input changes.
   * Calling this allows the component to fetch new suggestions and update it's
   * internal state.
   *
   * @param {String} inputValue
   */

  updateInputValue = inputValue => {
    this.setState({
      highlightedIndex: 0,
      wasEscapePressed: false,
    })

    if (inputValue) {
      searchUsers(inputValue).then(users => {
        this.setState({ userSuggestions: users })
      })
    } else {
      this.setState({ userSuggestions: [] })
    }
  }
}
