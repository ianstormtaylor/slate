import React, { ReactNode, Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'

interface BaseProps<T extends HTMLElement> {
  [key: string]: unknown
  className?: string
  ref?: Ref<OrNull<T>>
}
type OrNull<T> = T | null

export const Button = ({
  className,
  active,
  reversed,
  ref,
  ...props
}: PropsWithChildren<
  BaseProps<HTMLSpanElement> & {
    active?: boolean
    reversed?: boolean
  }
>) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        cursor: pointer;
        color: ${reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
          ? 'black'
          : '#ccc'};
      `
    )}
  />
)

export const EditorValue = ({
  className,
  value,
  ref,
  ...props
}: PropsWithChildren<
  {
    value: any
  } & BaseProps<HTMLDivElement>
>) => {
  const textLines = value.document.nodes
    .map(node => node.text)
    .toArray()
    .join('\n')
  return (
    <div
      ref={ref}
      {...props}
      className={cx(
        className,
        css`
          margin: 30px -20px 0;
        `
      )}
    >
      <div
        className={css`
          font-size: 14px;
          padding: 5px 20px;
          color: #404040;
          border-top: 2px solid #eeeeee;
          background: #f8f8f8;
        `}
      >
        Slate's value as text
      </div>
      <div
        className={css`
          color: #404040;
          font: 12px monospace;
          white-space: pre-wrap;
          padding: 10px 20px;
          div {
            margin: 0 0 0.5em;
          }
        `}
      >
        {textLines}
      </div>
    </div>
  )
}

export const Icon = ({
  className,
  ref,
  ...props
}: PropsWithChildren<BaseProps<HTMLSpanElement>>) => (
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
)

export const Instruction = ({
  className,
  ref,
  ...props
}: PropsWithChildren<BaseProps<HTMLDivElement>>) => (
  <div
    {...props}
    ref={ref}
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
  />
)

export const Menu = ({
  className,
  ref,
  ...props
}: PropsWithChildren<BaseProps<HTMLDivElement>>) => (
  <div
    {...props}
    data-test-id="menu"
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
)

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = ({
  className,
  ref,
  ...props
}: PropsWithChildren<BaseProps<HTMLDivElement>>) => (
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
)
