import React from 'react'

import { ReactEditor } from '.'
import {
  CustomAnnotation,
  CustomAnnotationProps,
  CustomDecoration,
  CustomDecorationProps,
  CustomElement,
  CustomElementProps,
  CustomMark,
  CustomMarkProps,
} from '../components/custom'

export default class ReactRendering {
  /**
   * Render an annotation `Range` object.
   */

  renderAnnotation(this: ReactEditor, props: CustomAnnotationProps) {
    return <CustomAnnotation {...props} />
  }

  /**
   * Render a decoration `Range` object.
   */

  renderDecoration(this: ReactEditor, props: CustomDecorationProps) {
    return <CustomDecoration {...props} />
  }

  /**
   * Render an `Element` object.
   */

  renderElement(this: ReactEditor, props: CustomElementProps) {
    return <CustomElement {...props} />
  }

  /**
   * Render a `Mark` object.
   */

  renderMark(this: ReactEditor, props: CustomMarkProps) {
    return <CustomMark {...props} />
  }
}
