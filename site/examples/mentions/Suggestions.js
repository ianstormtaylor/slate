import React from 'react'
import ReactDOM from 'react-dom'
import { css } from 'emotion'

const SuggestionList = React.forwardRef((props, ref) => (
  <ul
    {...props}
    ref={ref}
    className={css`
      background: #fff;
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
    `}
  />
))

const Suggestion = props => (
  <li
    {...props}
    className={css`
      align-items: center;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-top: 1px solid #ddd;

      display: flex;
      height: 32px;
      padding: 4px 8px;

      &:hover {
        background: #87cefa;
      }

      &:last-of-type {
        border-bottom: 1px solid #ddd;
      }
    `}
  />
)

const DEFAULT_POSITION = {
  top: -10000,
  left: -10000,
}

/**
 * Suggestions is a PureComponent because we need to prevent updates when x/ y
 * Are just going to be the same value. Otherwise we will update forever.
 */

class Suggestions extends React.PureComponent {
  menuRef = React.createRef()

  state = DEFAULT_POSITION

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  render() {
    const root = window.document.getElementById('root')

    return ReactDOM.createPortal(
      <SuggestionList
        ref={this.menuRef}
        style={{
          top: this.state.top,
          left: this.state.left,
        }}
      >
        {this.props.users.map(user => {
          return (
            <Suggestion key={user.id} onClick={() => this.props.onSelect(user)}>
              {user.username}
            </Suggestion>
          )
        })}
      </SuggestionList>,
      root
    )
  }

  updateMenu() {
    const anchor = window.document.querySelector(this.props.anchor)

    if (!anchor) {
      return this.setState(DEFAULT_POSITION)
    }

    const anchorRect = anchor.getBoundingClientRect()

    this.setState({
      top: anchorRect.bottom + window.pageYOffset,
      left: anchorRect.left + window.pageXOffset,
    })
  }
}

export default Suggestions
