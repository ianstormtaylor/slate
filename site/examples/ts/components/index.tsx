import { css, cx } from '@emotion/css'
import React, { PropsWithChildren, ReactNode, Ref } from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
  className?: string
  [key: string]: unknown
}

function getClassName(className: unknown, styleClass: string): string {
  if (typeof className === 'string') {
    return cx(className as any, styleClass)
  }
  return styleClass
}

function getMaterialIconClassName(
  className: unknown,
  styleClass: string
): string {
  if (typeof className === 'string') {
    return cx('material-icons' as any, className as any, styleClass)
  }
  return cx('material-icons', styleClass)
}

export const Button = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<
    {
      active: boolean
      reversed: boolean
    } & BaseProps
  >
>(({ className, active, reversed, ...props }, ref) => {
  const styleClass = css`
    cursor: pointer;
    color: ${reversed
      ? active
        ? 'white'
        : '#aaa'
      : active
        ? 'black'
        : '#ccc'};
  `

  return (
    <span
      {...props}
      ref={ref}
      className={getClassName(className, styleClass)}
    />
  )
})

export const Icon = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => {
  const styleClass = css`
    font-size: 18px;
    vertical-align: text-bottom;
  `

  return (
    <span
      {...props}
      ref={ref}
      className={getMaterialIconClassName(className, styleClass)}
    />
  )
})

export const Instruction = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => {
  const styleClass = css`
    white-space: pre-wrap;
    margin: 0 -20px 10px;
    padding: 10px 20px;
    font-size: 14px;
    background: #f8f8e8;
  `

  return (
    <div {...props} ref={ref} className={getClassName(className, styleClass)} />
  )
})

export const Menu = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => {
  const styleClass = css`
    & > * {
      display: inline-block;
    }

    & > * + * {
      margin-left: 15px;
    }
  `

  return (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={getClassName(className, styleClass)}
    />
  )
})

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => {
  const styleClass = css`
    position: relative;
    padding: 1px 18px 17px;
    margin: 0 -20px;
    border-bottom: 2px solid #eee;
    margin-bottom: 20px;
  `

  return (
    <Menu
      {...props}
      ref={ref}
      className={getClassName(className, styleClass)}
    />
  )
})
