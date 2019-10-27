import { Editor, Point, Range } from '../..'

class AnnotationCommands {
  /**
   * Add a new `annotation` object with a `key`.
   */

  addAnnotation(this: Editor, key: string, annotation: Range) {
    this.apply({
      type: 'add_annotation',
      key,
      annotation,
    })
  }

  /**
   * Remove an existing annotation object by `key`.
   */

  removeAnnotation(this: Editor, key: string) {
    const { annotations } = this.value

    if (!(key in annotations)) {
      throw new Error(
        `Unable to remove annotation by ${key} because it does not exist.`
      )
    }

    const annotation = annotations[key]

    this.apply({
      type: 'remove_annotation',
      key,
      annotation,
    })
  }

  /**
   * Set new properties on an annotation object with `key`.
   */

  setAnnotation(this: Editor, key: string, props: Partial<Range>) {
    const { annotations } = this.value

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
      this.apply({
        type: 'set_annotation',
        key,
        properties: prevProps,
        newProperties: newProps,
      })
    }
  }
}

export default AnnotationCommands
