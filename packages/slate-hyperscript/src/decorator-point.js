import { Range } from 'slate'

/**
 *  wrappers for decorator points, for comparison by instanceof,
 *  and for composition into ranges (anchor.combine(focus), etc)
 */

class DecoratorPoint {
  constructor({ key, data }, marks) {
    this._key = key
    this.marks = marks
    this.attribs = data || {}
    this.isAtomic = !!this.attribs.atomic
    delete this.attribs.atomic
    return this
  }
  withPosition = offset => {
    this.offset = offset
    return this
  }
  addOffset = offset => {
    this.offset += offset
    return this
  }
  withKey = key => {
    this.key = key
    return this
  }
  combine = focus => {
    if (!(focus instanceof DecoratorPoint))
      throw new Error('misaligned decorations')
    return Range.create({
      anchorKey: this.key,
      focusKey: focus.key,
      anchorOffset: this.offset,
      focusOffset: focus.offset,
      marks: this.marks,
      isAtomic: this.isAtomic,
      ...this.attribs,
    })
  }
}

export default DecoratorPoint
