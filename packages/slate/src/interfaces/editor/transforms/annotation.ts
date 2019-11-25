import { Editor, Point, Range } from '../../..'

export const AnnotationTransforms = {
  /**
   * Add a new `annotation` object with a `key`.
   */

  addAnnotation(editor: Editor, key: string, annotation: Range) {
    editor.apply({ type: 'add_annotation', key, annotation })
  },

  /**
   * Remove an existing annotation object by `key`.
   */

  removeAnnotation(editor: Editor, key: string) {
    const { annotations } = editor.value

    if (!(key in annotations)) {
      throw new Error(
        `Unable to remove annotation by ${key} because it does not exist.`
      )
    }

    const annotation = annotations[key]

    editor.apply({ type: 'remove_annotation', key, annotation })
  },

  /**
   * Set new properties on an annotation object with `key`.
   */

  setAnnotation(editor: Editor, key: string, props: Partial<Range>) {
    const { annotations } = editor.value

    if (!(key in annotations)) {
      throw new Error(
        `Unable to set new properties on annotation by ${key} because it does not exist.`
      )
    }

    const annotation = annotations[key]
    const newProps = {}
    const prevProps = {}

    for (const k in props) {
      const isPoint = k === 'anchor' || k === 'focus'

      if (
        (isPoint && !Point.equals(props[k], annotation[k])) ||
        (!isPoint && props[k] !== annotation[k])
      ) {
        newProps[k] = props[k]
        prevProps[k] = annotation[k]
      }
    }

    if (Object.keys(newProps).length > 0) {
      editor.apply({
        type: 'set_annotation',
        key,
        properties: prevProps,
        newProperties: newProps,
      })
    }
  },
}
