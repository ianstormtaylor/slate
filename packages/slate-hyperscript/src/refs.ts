import { Path, Point, Range } from 'slate'

/**
 * Hyperscript point refs can be used to construct arbitrary points using the
 * ref prop of a <point /> tag.
 */

export class HyperscriptPointRef {
  path?: Path
  offset?: number

  point(): Point {
    const { path, offset } = this

    if (path == null || offset == null) {
      throw new Error(
        'A HyperscriptPointRef must be passed as the ref prop of a <point /> tag that is used inside an <editor>.'
      )
    }

    return { path, offset }
  }
}

/**
 * Hyperscript range refs can be used to construct arbitrary range using the ref
 * props of <anchor /> and <focus /> tags.
 */

export class HyperscriptRangeRef {
  anchor?: Point
  focus?: Point

  range(): Range {
    const { anchor, focus } = this

    if (anchor == null) {
      throw new Error(
        'A HyperscriptRangeRef must be passed as the ref prop of an <anchor /> tag that is used inside an <editor>.'
      )
    }

    if (focus == null) {
      throw new Error(
        'A HyperscriptRangeRef must be passed as the ref prop of a <focus /> tag that is used inside an <editor>.'
      )
    }

    return { anchor, focus }
  }
}
