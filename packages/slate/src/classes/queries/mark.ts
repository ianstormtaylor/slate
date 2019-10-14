import { Editor, Mark } from '../..'

class MarkQueries {
  /**
   * Determine is a mark is atomic, meaning that removing any text inside the
   * mark should remove the mark entirely.
   */

  isAtomic(this: Editor, mark: Mark): boolean {
    return false
  }
}

export default MarkQueries
