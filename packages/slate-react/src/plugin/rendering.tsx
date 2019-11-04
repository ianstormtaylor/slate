import React from 'react'
import { DefaultMark, DefaultElement } from '../components/defaults'
import { Mark, Element, Range, Text } from 'slate'
import { ReactEditor } from '.'

export default class ReactRendering {
  /**
   * Render an annotation `Range` object.
   */

  renderAnnotation(
    this: ReactEditor,
    props: {
      annotation: Range
      annotations: Range[]
      children: any
      decorations: Range[]
      marks: Mark[]
      node: Text
      attributes: {
        'data-slate-annotation': true
      }
    }
  ) {
    return <DefaultMark {...props} />
  }

  /**
   * Render an `Element` object.
   */

  renderElement(
    this: ReactEditor,
    props: {
      children: any
      element: Element
      attributes: {
        'data-slate-node': 'element'
        'data-slate-void'?: true
        dir?: 'rtl'
        ref: any
      }
    }
  ) {
    return <DefaultElement {...props} />
  }

  /**
   * Render a decoration `Range` object.
   */

  renderDecoration(
    this: ReactEditor,
    props: {
      annotations: Range[]
      children: any
      decoration: Range
      decorations: Range[]
      marks: Mark[]
      node: Text
      attributes: {
        'data-slate-decoration': true
      }
    }
  ) {
    return <DefaultMark {...props} />
  }

  /**
   * Render a `Mark` object.
   */

  renderMark(
    this: ReactEditor,
    props: {
      annotations: Range[]
      children: any
      decorations: Range[]
      mark: Mark
      marks: Mark[]
      node: Text
      attributes: {
        'data-slate-mark': true
      }
    }
  ) {
    return <DefaultMark {...props} />
  }
}
