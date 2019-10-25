import { Editor, Element, Path } from '../..'

class PathCommands {
  wrapNodeAtPath(this: Editor, path: Path, element: Element): void {
    this.withoutNormalizing(() => {
      this.insertNodes(element, { at: path })
      const nextPath = Path.next(path)
      const childPath = path.concat(0)
      this.moveNodes({ at: nextPath, to: childPath })
    })
  }
}

export default PathCommands
