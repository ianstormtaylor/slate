import { Editor, Point, Annotation } from '../..'

class AnnotationCommands {
  /**
   * Add a new `annotation` object with a `key`.
   */

  addAnnotation(this: Editor, key: string, annotation: Annotation) {
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

  setAnnotation(this: Editor, key: string, props: Partial<Annotation>) {
    const { annotations } = this.value

    if (!(key in annotations)) {
      throw new Error(
        `Unable to set new properties on annotation by ${key} because it does not exist.`
      )
    }

    const annotation = annotations[key]
    const newProps = {}
    const prevProps = {}
    let isChange = false

    // Dedupe new and old properties to avoid unnecessary sets.
    for (const k in props) {
      const isPoint = k === 'anchor' || k === 'focus'

      if (
        (isPoint && !Point.equals(props[k], annotation[k])) ||
        (!isPoint && props[k] !== annotation[k])
      ) {
        isChange = true
        newProps[k] = props[k]
        prevProps[k] = annotation[k]
      }
    }

    // If no properties have actually changed, don't apply an operation at all.
    if (!isChange) {
      return
    }

    this.apply({
      type: 'set_annotation',
      key,
      properties: prevProps,
      newProperties: newProps,
    })
  }
}

export default AnnotationCommands
