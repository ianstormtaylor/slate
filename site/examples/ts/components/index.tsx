import { css, cx } from '@emotion/css'
import type React from 'react'
import type { ReactNode } from 'react'
import ReactDOM from 'react-dom'

type ButtonProps = React.ComponentPropsWithRef<'button'> & {
  active?: boolean
  reversed?: boolean
}

type SpanProps = React.ComponentPropsWithRef<'span'>

type DivProps = React.ComponentPropsWithRef<'div'>

export const Button = ({
  className,
  active,
  reversed,
  ref,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cx(
      css`
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
      `,
      className
    )}
    ref={ref}
  />
)

export const Icon = ({ className, ref, ...props }: SpanProps) => (
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
)

export const Instruction = ({ className, ref, ...props }: DivProps) => (
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
)

export const Menu = ({ className, ref, ...props }: DivProps) => (
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
)

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = ({ className, ref, ...props }: DivProps) => (
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
)
