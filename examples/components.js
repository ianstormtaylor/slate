import React from 'react'
import { cx, css } from 'emotion'

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active ? 'white' : '#aaa'
            : active ? 'black' : '#ccc'};
        `
      )}
    />
  )
)

export const EditorValue = React.forwardRef(({ value, ...props }, ref) => {
  const textLines = value.document.nodes
    .map(node => node.text)
    .toArray()
    .join('\n')
  return (
    <div {...props}>
      <div
        className={css`
          margin: 1em 0 0;
          font-size: 14px;
          padding: 0.5em 1em;
          color: #404040;
          background: #e0e0e0;
        `}
      >
        Slate's value as text
      </div>
      <div
        {...props}
        className={css`
          color: #404040;
          background: #f0f0f0;
          font: 12px monospace;
          white-space: pre-wrap;
          padding: 1em;
          div {
            margin: 0 0 0.5em;
          }
        `}
      >
        {textLines}
      </div>
    </div>
  )
})

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
))

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
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
  />
))

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
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
  />
))
