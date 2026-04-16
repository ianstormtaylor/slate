import { css, cx } from '@emotion/css'
import React from 'react'
import ReactDOM from 'react-dom'

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${
            reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'
          };
        `
      )}
      ref={ref}
    />
  )
)
export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
    ref={ref}
  />
))
export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
    ref={ref}
  />
))
export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }

        & > * + * {
          margin-left: 15px;
        }
      `
    )}
    data-test-id="menu"
    ref={ref}
  />
))
export const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}
export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
    ref={ref}
  />
))
