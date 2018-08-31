declare module "slate" {
    import * as Immutable from "immutable"
  
    type Partial<T> = { [P in keyof T]?: T[P] }
  
    type Primitive = undefined | null | boolean | string | number | Function
  
    type Immutable<T> = T extends Primitive
      ? T
      : T extends Array<infer U>
        ? ReadonlyArray<U>
        : T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : Readonly<T>
  
    type DeepImmutable<T> = T extends Primitive
      ? T
      : T extends Array<infer U>
        ? DeepImmutableArray<U>
        : T extends Map<infer K, infer V> ? DeepImmutableMap<K, V> : DeepImmutableObject<T>
  
    interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}
    interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}
    type DeepImmutableObject<T> = { readonly [K in keyof T]: DeepImmutable<T[K]> }
  
    export interface ToJSONOptions {
      preserveKeys: boolean
    }
  
    class ElementInterface {
      addMark(path: Path | PathJSON | string, offset: number, length: number, mark: Mark): Node
      createDecoration(decoration: DecorationProperties | Decoration): Decoration
      createPoint(point: PointProperties | Point): Point
      createRange(range: RangeProperties | Range): Range
      createSelection(selection: SelectionProperties | Selection): Selection
      filterDescendants(iterator: (node: Node) => boolean): Immutable.List<Node>
      findDescendant(iterator: (node: Node) => boolean): Node | null
      forEachDescendant(iterator: (node: Node) => boolean): void
      getActiveMarksAtRange(range: Range): Immutable.Set<Mark>
      getAncestors(path: Path | PathJSON | string): Immutable.List<Node> | null
      getBlocks(): Immutable.List<Block>
      getBlocksAsArray(): Array<Block>
      getBlocksAtRange(range: Range): Immutable.List<Block>
      getBlocksAtRangeAsArray(range: Range): Array<Block>
      getBlocksByType(type: string): Immutable.List<Block>
      getBlocksByTypeAsArray(type: string): Array<Block>
      getChild(path: Path | PathJSON | string): Node | null
      getClosest(path: Path | PathJSON | string, iterator: (node: Node) => boolean): Node | null
      getClosestBlock(path: Path | PathJSON | string): Block | null
      getClosestInline(path: Path | PathJSON | string): Inline | null
      getClosestVoid(path: Path | PathJSON | string, schema: Schema): Node | null
      getCommonAncestor(a: Node, b: Node): Node
      getDecorations(stack: Stack): Immutable.List<Decoration>
      getDepth(path: Path | PathJSON | string, startAt: number): number | null
      getDescendant(path: Path | PathJSON | string): Node | null
      getFragmentAtRange(range: Range): Document
      getFurthest(path: Path | PathJSON | string, iterator: (node: Node) => boolean): Node | null
      getFurthestAncestor(path: Path | PathJSON | string): Node | null
      getFurthestBlock(path: Path | PathJSON | string): Block | null
      getFurthestInline(path: Path | PathJSON | string): Inline | null
      getFurthestOnlyChildAncestor(path: Path | PathJSON | string): Node | null
      getInlines(): Immutable.List<Inline>
      getInlinesAsArray(): Array<Inline>
      getInlinesAtRange(range: Range): Immutable.List<Inline>
      getInlinesAtRangeAsArray(range: Range): Array<Inline>
      getInlinesByType(type: string): Immutable.List<Inline>
      getInlinesByTypeAsArray(type: string): Array<Inline>
      getInsertMarksAtRange(range: Range): Immutable.Set<Mark>
      getMarks(): Immutable.Set<Mark>
      getMarksAsArray(): Array<Mark>
      getMarksAtPosition(key: string, offset: number): Immutable.Set<Mark>
      getMarksAtRange(range: Range): Immutable.Set<Mark>
      getMarksByType(type: string): Immutable.Set<Mark>
      getMarksByTypeAsArray(type: string): Array<Mark>
      getNextBlock(key: string): Block | null
      getNextNode(path: Path | PathJSON | string): Node | null
      getNextSibling(path: Path | PathJSON | string): Node | null
      getNextText(path: Path | PathJSON | string): Text | null
      getOffset(key: string): number
      getOffsetAtRange(range: Range): number
      getOrderedMarks(): Immutable.OrderedSet<Mark>
      getOrderedMarksAtRange(range: Range): Immutable.OrderedSet<Mark>
      getOrderedMarksBetweenPositions(
        startKey: string,
        startOffset: number,
        endKey: string,
        endOffset: number,
      ): Immutable.OrderedSet<Mark>
      getOrderedMarksByType(type: string): Immutable.OrderedSet<Mark>
      getParent(path: Path | PathJSON | string): Node | null
      getPreviousBlock(key: string): Block | null
      getPreviousNode(path: Path | PathJSON | string): Node | null
      getPreviousSibling(path: Path | PathJSON | string): Node | null
      getPreviousText(path: Path | PathJSON | string): Text | null
      getSelectionIndexes(range: Range, isSelected: boolean): { start: number; end: number } | null
      getTextAtOffset(offset: number): Text | null
      getTextDirection(): TextDirection
      getTexts(): Immutable.List<Text>
      getTextsAsArray(): Array<Text>
      getTextsAtRange(range: Range): Immutable.List<Text>
      getTextsAtRangeAsArray(range: Range): Array<Text>
      getTextsBetweenPositionsAsArray(startKey: string, endKey: string): Array<Text>
      hasBlockChildren(): boolean
      hasChild(path: Path | PathJSON | string): boolean
      hasInlineChildren(): boolean
      hasDescendant(path: Path | PathJSON | string): boolean
      hasVoidParent(path: Path | PathJSON | string, schema: Schema): boolean
      insertNode(path: Path | PathJSON | string, node: Node): Node
      insertText(path: Path | PathJSON | string, offset: number, text: string, marks: Set<Mark>): Node
      isLeafBlock(): boolean
      isLeafInline(): boolean
      mapChildren(iterator: (node: Node, i: number, nodes: Immutable.List<Node>) => Node): Node
      mapDescendants(
        iterator: (node: Node, i: number, descendants: Immutable.List<Node>) => Node,
      ): Node
      mergeNode(path: Path | PathJSON | string): Node
      moveNode(
        path: Path | PathJSON | string,
        newPath: Path | PathJSON | string,
        newIndex: number,
      ): Node
      refindNode(path: Path | PathJSON | string, key: string): Node | null
      refindPath(path: Path | PathJSON | string, key: string): Immutable.List<Node> | null
      removeMark(path: Path | PathJSON | string, offset: number, length: number, mark: Mark): Node
      removeNode(path: Path | PathJSON | string): Node
      removeText(path: Path | PathJSON | string, offset: number, text: string): Node
      replaceNode(path: Path | PathJSON | string, node: Node): Node
      resolveDecoration(decoration: Decoration | DecorationProperties): Decoration
      resolvePoint(point: Point | PointProperties): Point
      resolveRange(range: Range | RangeProperties): Range
      resolveSelection(selection: Selection | SelectionProperties): Selection
      setNode(path: Path | PathJSON | string, properties: NodeProperties): Node
      setMark(
        path: Path | PathJSON | string,
        offset: number,
        length: number,
        mark: Mark,
        properties: MarkProperties,
      ): Node
      splitNode(path: Path | PathJSON | string, position: number, properties: NodeProperties): Node
    }
  
    interface NodeInterface {
      readonly text: string
      getFirstInvalidNode(schema: Schema): boolean
      getFirstText(): Text | null
      getKeysToPathsTable(): { [key: string]: PathJSON }
      getLastText(): Text | null
      getNode(path: Path | PathJSON | string): Node | null
      getPath(key: string): Path
      getText(): string
      hasNode(): boolean
      normalize(schema: Schema): (change: Change) => any
      regenerateKey(): Node
      resolvePath(path: Path | PathJSON | string, index: number): Path
      validate(schema: Schema): SlateError | void
    }
  
    interface RangeInterface {
      readonly isCollapsed: boolean
      readonly isExpanded: boolean
      readonly isBackward: boolean
      readonly isForward: boolean
      readonly isUnset: boolean
      readonly isSet: boolean
      readonly start: Point
      readonly end: Point
      flip(): RangeInterface
      moveForward(n: number): RangeInterface
      moveBackward(n: number): RangeInterface
  
      moveAnchorBackward(n: number): RangeInterface
      moveAnchorForward(n: number): RangeInterface
      moveAnchorTo(path: Path | PathJSON | string, offset: number): RangeInterface
      moveAnchorToStartOfNode(node: Node): RangeInterface
      moveAnchorToEndOfNode(node: Node): RangeInterface
  
      moveEndBackward(n: number): RangeInterface
      moveEndForward(n: number): RangeInterface
      moveEndTo(path: Path | PathJSON | string, offset: number): RangeInterface
      moveEndToStartOfNode(node: Node): RangeInterface
      moveEndToEndOfNode(node: Node): RangeInterface
  
      moveFocusBackward(n: number): RangeInterface
      moveFocusForward(n: number): RangeInterface
      moveFocusTo(path: Path | PathJSON | string, offset: number): RangeInterface
      moveFocusToStartOfNode(node: Node): RangeInterface
      moveFocusToEndOfNode(node: Node): RangeInterface
  
      moveStartBackward(n: number): RangeInterface
      moveStartForward(n: number): RangeInterface
      moveStartTo(path: Path | PathJSON | string, offset: number): RangeInterface
      moveStartToStartOfNode(node: Node): RangeInterface
      moveStartToEndOfNode(node: Node): RangeInterface
  
      moveTo(path: Path | PathJSON | string, offset: number): RangeInterface
      moveToAnchor(): RangeInterface
      moveToEnd(): RangeInterface
      moveToEndOfNode(node: Node): RangeInterface
      moveToFocus(): RangeInterface
      moveToRangeInterfaceOfNode(start: Node, end?: Node): RangeInterface
      moveToStart(): RangeInterface
      moveToStartOfNode(node: Node): RangeInterface
  
      normalize(node: Node): RangeInterface
  
      setAnchor(anchor: Point): RangeInterface
      setEnd(point: Point): RangeInterface
      setFocus(point: Point): RangeInterface
      setPoints(values: Array<Point>): RangeInterface
      updatePoints(updater: (point: Point) => Point): RangeInterface
      setStart(point: Point): RangeInterface
      setProperties(properties: RangeProperties | RangeInterface): RangeInterface
  
      toJSON(options: ToJSONOptions): RangeJSON
      toRangeInterface(): RangeInterface
      unset(): RangeInterface
    }
  
    export type TextDirection = "neutral" | "rtl" | "ltr"
  
    export type Path = Immutable.List<Number>
    export type PathJSON = Array<number>
  
    export type NodeProperties =
      | DocumentProperties
      | BlockProperties
      | InlineProperties
      | TextProperties
    export type NodeJSON = DocumentJSON | BlockJSON | InlineJSON | TextJSON
    export type Node = Document | Block | Inline | Text
  
    export interface DocumentProperties {
      data: Data<string, any>
      key?: string
      nodes: Immutable.List<Node>
    }
    export interface DocumentJSON {
      data: DataJSON<string, any>
      key?: string
      nodes: Array<NodeJSON>
    }
    export interface Document
      extends DeepImmutable<DocumentProperties>,
        ElementInterface,
        NodeInterface {}
    export class Document extends Immutable.Record({
      data: new Data<string, any>(),
      key: undefined,
      nodes: Immutable.List<Node>(),
    }) {
      readonly object: "document"
  
      static fromJS(args: DocumentProperties): Document
      static toJS(): DocumentProperties
  
      static create(
        document: Document | Partial<DocumentProperties> | Immutable.List<Node> | Array<Node>,
      ): Document
      static fromJSON(document: Partial<DocumentJSON> | Document): Document
      static isDocument(maybeDocument: any): maybeDocument is Document
  
      toJSON(options: ToJSONOptions): DocumentJSON
  
      get<T extends keyof DocumentProperties>(value: T): DocumentProperties[T]
    }
  
    export interface BlockProperties {
      data: Data<string, any>
      key?: string
      nodes: Immutable.List<Node>
      type?: string
    }
    export interface BlockJSON {
      data: DataJSON<string, any>
      key?: string
      nodes: Array<NodeJSON>
      type?: string
    }
    export interface Block extends DeepImmutable<BlockProperties>, ElementInterface, NodeInterface {}
    export class Block extends Immutable.Record({
      data: new Data<string, any>(),
      key: undefined,
      nodes: Immutable.List<Node>(),
      type: undefined,
    }) {
      readonly object: "block"
  
      static fromJS(args: BlockProperties): Block
      static toJS(): BlockProperties
  
      static create(block: Block | Partial<BlockProperties> | Partial<BlockJSON> | string): Block
      static createList(
        blocks:
          | Immutable.List<Block | Partial<BlockProperties> | Partial<BlockJSON> | string>
          | Array<Block | Partial<BlockProperties> | Partial<BlockJSON> | string>,
      ): Immutable.List<Block>
      static fromJSON(block: Partial<BlockJSON> | Block): Block
      static isBlock(maybeBlock: any): maybeBlock is Block
      static isBlockList(maybeBlockList: any): maybeBlockList is Immutable.List<Block>
  
      toJSON(options: ToJSONOptions): BlockJSON
  
      get<T extends keyof BlockProperties>(value: T): BlockProperties[T]
    }
  
    export interface InlineProperties {
      data: Data<string, any>
      key?: string
      nodes: Immutable.List<Node>
      type?: string
    }
    export interface InlineJSON {
      data: DataJSON<string, any>
      key?: string
      nodes: Array<NodeJSON>
      type?: string
    }
    export interface Inline
      extends DeepImmutable<InlineProperties>,
        ElementInterface,
        NodeInterface {}
    export class Inline extends Immutable.Record({
      data: new Data(),
      key: undefined,
      nodes: Immutable.List<Node>(),
      type: undefined,
    }) {
      readonly object: "inline"
  
      static fromJS(args: InlineProperties): Inline
      static toJS(): InlineProperties
  
      static create(attrs: Inline | Partial<InlineProperties> | Partial<InlineJSON>): Inline
      static createList(
        elements:
          | Immutable.List<Inline | Partial<InlineProperties> | Partial<InlineJSON>>
          | Array<Inline | Partial<InlineProperties> | Partial<InlineJSON>>,
      ): Immutable.List<Inline>
      static fromJSON(object: Partial<InlineJSON> | Inline): Inline
      static isInline(maybeInline: any): maybeInline is Inline
      static isInlineList(maybeInlineList: any): maybeInlineList is Immutable.List<Inline>
  
      toJSON(options: ToJSONOptions): InlineJSON
  
      get<T extends keyof InlineProperties>(value: T): InlineProperties[T]
    }
  
    export interface TextProperties {
      key?: string
      leaves: Immutable.List<Leaf>
    }
    export interface TextJSON {
      key?: string
      leaves: Array<LeafJSON>
    }
    export interface Text extends DeepImmutable<TextProperties>, NodeInterface {}
    export class Text {
      readonly object: "text"
  
      static fromJS(args: TextProperties): Text
      static toJS(): TextProperties
  
      static create(attrs: Text | Partial<TextProperties> | Partial<TextJSON>): Text
      static createList(
        elements:
          | Immutable.List<Text | Partial<TextProperties> | Partial<TextJSON>>
          | Array<Text | Partial<TextProperties> | Partial<TextJSON>>,
      ): Immutable.List<Text>
      static fromJSON(object: Partial<TextJSON> | Text): Text
      static isText(maybeText: any): maybeText is Text
      static isTextList(maybeTextList: any): maybeTextList is Immutable.List<Text>
  
      toJSON(options: ToJSONOptions): TextJSON
  
      searchLeafAtOffset(
        offset: number,
      ): { startOffset: number; endOffset: number; index: number; leaf?: Leaf }
      addMark(index: number, length: number, mark: Mark): Text
      addMarks(index: number, length: number, set: Immutable.Set<Mark>): Text
      getLeaves(decorations?: Array<Decoration>): Immutable.List<Leaf>
      getActiveMarksBetweenOffsets(startOffset: number, endOffset: number): Immutable.Set<Mark>
      getActiveMarks(): Immutable.Set<Mark>
      getMarksBetweenOffsets(startOffset: number, endOffset: number): Immutable.Set<Mark>
      getMarks(): Immutable.Set<Mark>
      getMarksAsArray(): Array<Mark>
      getMarksAtIndex(index: number): Immutable.Set<Mark>
      insertText(offset: number, text: string, marks?: Immutable.Set<Mark>): Text
  
      removeMark(index: number, length: number, mark: Mark): Text
      removeText(start: number, length: number): Text
  
      updateMark(index: number, length: number, mark: Mark, properties: Partial<MarkProperties>): Text
      splitText(offset: number): [Mark, Mark]
      mergeText(text: Text): Text
      setLeaves(
        leaves:
          | Array<Leaf | Partial<LeafProperties>>
          | Immutable.List<Leaf | Partial<LeafProperties>>,
      ): Text
  
      get<T extends keyof TextProperties>(value: T): TextProperties[T]
    }
  
    export interface LeafProperties {
      marks: Immutable.Set<Mark>
      text: string
    }
    export interface LeafJSON {
      marks: Array<MarkJSON>
      text: string
    }
    export interface Leaf extends DeepImmutable<LeafProperties> {}
    export class Leaf extends Immutable.Record({
      marks: Immutable.Set<Mark>(),
      text: "",
    }) {
      readonly object: "leaf"
  
      static fromJS(args: LeafProperties): Leaf
      static toJS(): LeafProperties
  
      static create(leaf: Leaf | Partial<LeafProperties>): Leaf
      static createLeaves(
        leaves:
          | Array<Leaf | Partial<LeafProperties>>
          | Immutable.List<Leaf | Partial<LeafProperties>>,
      ): Immutable.List<Leaf>
      static splitLeaves(leaves: Immutable.List<Leaf>, offset: number): Immutable.List<Leaf>
      static createList(
        list: Array<Leaf | Partial<LeafProperties>> | Immutable.List<Leaf | Partial<LeafProperties>>,
      ): Immutable.List<Leaf>
      static fromJSON(leaf: Partial<LeafJSON> | Leaf): Leaf
      static isLeaf(maybeLeaf: any): maybeLeaf is Leaf
      static isLeafList(maybeLeafs: any): maybeLeafs is Immutable.List<Leaf>
  
      toJSON(options: ToJSONOptions): LeafJSON
  
      updateMark(mark: Mark, newMark: Mark): Leaf
      addMark(mark: Mark): Leaf
      adMarks(marks: Immutable.Set<Mark>): Leaf
      removeMark(mark: Mark): Leaf
  
      get<T extends keyof LeafProperties>(value: T): LeafProperties[T]
    }
  
    export interface PointProperties {
      key: string | null
      offset: number | null
      path: Path | null
    }
    export interface PointJSON {
      key: string | null
    }
    export interface Point extends DeepImmutable<PointProperties> {}
    export class Point extends Immutable.Record({
      key: null,
      offset: null,
      path: null,
    }) {
      readonly object: "point"
      readonly isSet: boolean
      readonly isUnset: boolean
  
      static fromJS(args: PointProperties): Point
      static toJS(): PointProperties
  
      static create(
        point: Point | Partial<PointProperties> | Immutable.List<Node> | Array<Node>,
      ): Point
      static createProperties(
        point: Partial<PointJSON> | Partial<PointProperties> | Point,
      ): PointProperties
      static fromJSON(point: Partial<PointJSON> | Point): Point
      static isPoint(maybePoint: any): maybePoint is Point
  
      isAtEndOfNode(node: Node): boolean
      isAtStartOfNode(node: Node): boolean
      isInNode(node: Node): boolean
  
      moveBackward(n?: number): Point
      moveForward(n?: number): Point
      moveTo(path: Path | PathJSON | string, offset?: number): Point
      moveToStartOfNode(node: Node): Point
      moveToEndOfNode(node: Node): Point
      normalize(node: Node): Point
  
      setKey(key: string): Point
      setOffset(offset: number): Point
      setPath(path: Path | PathJSON | string): Point
  
      toJSON(options: ToJSONOptions): PointJSON
      unset(): Point
  
      get<T extends keyof PointProperties>(value: T): PointProperties[T]
    }
  
    export interface DecorationProperties extends RangeProperties {
      mark?: Mark
    }
    export interface DecorationJSON extends RangeJSON {
      mark?: MarkJSON
    }
    export interface Decoration extends DeepImmutable<DecorationProperties>, RangeInterface {}
    export class Decoration {
      readonly object: "decoration"
  
      static fromJS(args: DecorationProperties): Decoration
      static toJS(): DecorationProperties
  
      static create(
        attrs: Decoration | Range | Partial<DecorationProperties> | Partial<DecorationJSON>,
      ): Decoration
      static createList(
        elements:
          | Immutable.List<
              Decoration | Range | Partial<DecorationProperties> | Partial<DecorationJSON>
            >
          | Array<Decoration | Range | Partial<DecorationProperties> | Partial<DecorationJSON>>,
      ): Immutable.List<Decoration>
      static createProperties(
        a: Decoration | Range | Partial<DecorationProperties> | Partial<DecorationJSON>,
      ): DecorationProperties
      static fromJSON(object: Partial<DecorationJSON> | Decoration): Decoration
      static isDecoration(maybeDecoration: any): maybeDecoration is Decoration
  
      toJSON(options: ToJSONOptions): DecorationJSON
  
      get<T extends keyof DecorationProperties>(value: T): DecorationProperties[T]
    }
  
    export interface MarkProperties {
      data: Data<string, any>
      type?: string
    }
    export interface MarkJSON {
      data: DataJSON<string, any>
    }
    export interface Mark extends DeepImmutable<MarkProperties> {}
    export class Mark extends Immutable.Record({
      data: new Data<string, any>(),
      type: undefined,
    }) {
      readonly object: "mark"
  
      static fromJS(args: MarkProperties): Mark
      static toJS(): MarkProperties
  
      static create(attrs: Mark | Partial<MarkProperties> | Partial<MarkJSON>): Mark
      static createSet(
        elements:
          | Immutable.List<Mark | Partial<MarkProperties> | Partial<MarkJSON>>
          | Array<Mark | Partial<MarkProperties> | Partial<MarkJSON>>,
      ): Immutable.Set<Mark>
      static createProperties(a: Mark | Partial<MarkProperties> | Partial<MarkJSON>): MarkProperties
      static fromJSON(object: Partial<MarkJSON> | Mark): Mark
      static isMark(maybeMark: any): maybeMark is Mark
      static isMarkSet(maybeMarkSet: any): maybeMarkSet is Immutable.Set<Mark>
  
      toJSON(options: ToJSONOptions): MarkJSON
  
      get<T extends keyof MarkProperties>(value: T): MarkProperties[T]
    }
  
    export type DataProperties<K extends string, V> = Immutable.Map<K, V>
    export type DataJSON<K extends string, V> = Record<K, V>
    export interface Data<K extends string, V> extends DataProperties<K, V> {}
    export class Data<K, V> {
      static fromJS<K extends string, V>(args: DataJSON<K, V>): Data<K, V>
      static toJS<K extends string, V>(): DataProperties<K, V>
  
      static create<K extends string, V>(attrs: DataProperties<K, V> | DataJSON<K, V>): Data<K, V>
  
      static fromJSON<K extends string, V>(args: DataJSON<K, V>): Data<K, V>
    }
    // export class Data<DataMap = Record<string, any>> extends Immutable.Map<keyof DataMap, DataMap[keyof DataMap]>(){
  
    // }
  
    export interface RangeProperties {
      anchor: Point
      focus: Point
    }
    export interface RangeJSON {
      anchor: PointJSON
      focus: PointJSON
    }
    export interface Range extends DeepImmutable<RangeProperties>, RangeInterface {}
    export class Range {
      readonly object: "range"
  
      static fromJS(args: RangeProperties): Range
      static toJS(): RangeProperties
  
      static create(attrs: Range | Partial<RangeProperties> | Partial<RangeJSON>): Range
      static createList(
        elements:
          | Immutable.List<Range | Partial<RangeProperties> | Partial<RangeJSON>>
          | Array<Range | Partial<RangeProperties> | Partial<RangeJSON>>,
      ): Immutable.List<Range>
      static createProperties(
        a: Range | Range | Partial<RangeProperties> | Partial<RangeJSON>,
      ): RangeProperties
      static fromJSON(object: Partial<RangeJSON> | Range): Range
      static isRange(maybeRange: any): maybeRange is Range
  
      toJSON(options: ToJSONOptions): RangeJSON
  
      get<T extends keyof RangeProperties>(value: T): RangeProperties[T]
    }
  
    export interface SelectionProperties extends RangeProperties {
      isFocussed: boolean
      marks: Immutable.Set<Mark> | null
    }
    export interface SelectionJSON extends RangeJSON {
      isFocussed: boolean
      marks: Array<MarkJSON> | null
      isBlurred: boolean
    }
    export interface Selection extends DeepImmutable<SelectionProperties>, RangeInterface {}
    export class Selection {
      readonly object: "selection"
      readonly isBlurred: boolean
  
      static fromJS(args: SelectionProperties): Selection
      static toJS(): SelectionProperties
  
      static create(
        attrs: Selection | Range | Partial<SelectionProperties> | Partial<SelectionJSON>,
      ): Selection
      static createProperties(
        a: Selection | Range | Partial<SelectionProperties> | Partial<SelectionJSON>,
      ): SelectionProperties
      static fromJSON(object: Partial<SelectionJSON> | Selection): Selection
      static isSelection(maybeSelection: any): maybeSelection is Selection
  
      toJSON(options: ToJSONOptions): SelectionJSON
  
      setIsFocussed(value: boolean): Selection
      setMarks(marks: Immutable.Set<Mark>): Selection
  
      get<T extends keyof SelectionProperties>(value: T): SelectionProperties[T]
    }
  
    export type InvalidReason =
      | "child_object_invalid"
      | "child_required"
      | "child_type_invalid"
      | "child_unknown"
      | "first_child_object_invalid"
      | "first_child_type_invalid"
      | "last_child_object_invalid"
      | "last_child_type_invalid"
      | "node_data_invalid"
      | "node_is_void_invalid"
      | "node_mark_invalid"
      | "node_text_invalid"
      | "parent_object_invalid"
      | "parent_type_invalid"
  
    export class SlateError extends Error {
      code: InvalidReason
    }
  
    export interface Rule<match = { type: string; object: string }> {
      object?: string
      data?: {
        [key: string]: (v: any) => boolean | any
      }
      first?: match | Array<match>
      last?: match | Array<match>
      previous?: match | Array<match> //TODO: Are these in?
      next?: match | Array<match> //TODO: Are these in?
      parent?: match | Array<match>
      isVoid?: boolean
      nodes?: Array<{
        min?: number
        max?: number
        match?: match | Array<match>
      }>
      marks?: Array<{ type: string }>
      match?: match | Array<match>
      text?: (s: string) => boolean | RegExp
      normalize: (change: Change, error: SlateError) => void
    }
  
    export interface RuleByNodeType {
      [key: string]: Rule
    }
  
    export interface SchemaProperties {
      stack: Stack
      rules: Array<Rule>
    }
    export interface SchemaRules {
      document?: Rule
      blocks?: RuleByNodeType
      inlines?: RuleByNodeType
    }
    export interface SchemaJSON {
      object: "schema"
      rules: Array<Rule>
    }
    export interface Schema extends DeepImmutable<SchemaProperties> {}
    export class Schema {
      readonly object: "schema"
  
      static fromJS(args: SchemaProperties): Schema
      static toJS(): SchemaProperties
  
      static create(attrs: Schema | Partial<SchemaRules>): Schema
      static fromJSON(object: Partial<SchemaRules> | Schema | Partial<SchemaJSON>): Schema
      static isSchema(maybeSchema: any): maybeSchema is Schema
  
      getNodeRules(node: Node): Array<Rule>
  
      toJSON(options: ToJSONOptions): SchemaJSON
  
      get<T extends keyof SchemaProperties>(value: T): SchemaProperties[T]
    }
  
    export interface ChangeProperties {
      value: Value
      operations: Immutable.List<Operation>
      flags: {
        normalize?: boolean
        merge?: boolean
        save?: boolean
      }
    }
    export interface ChangeJSON {
      value: ValueJSON
      operations: Array<Operation>
      flags: {
        normalize: boolean
        merge: boolean
        save: boolean
      }
    }
    export interface Change
      extends DeepImmutable<ChangeProperties>,
        ChangesAtCurrentRange,
        ChangesAtRange,
        ChangesByPath,
        ChangesOnHistory,
        ChangesOnSelection,
        ChangesOnValue,
        ChangesWithSchema {}
    interface ChangeApplyOperationOptions {
      options?: { skip?: boolean }
      flags?: {
        normalize?: boolean
        merge?: boolean
        save?: boolean
      }
    }
  
    export class Change /*TODO: Naming conflict on delte - extends Immutable.Record({}) */ {
      readonly object: "change"
  
      static fromJS(args: ChangeProperties): Change
      static toJS(): ChangeProperties
  
      applyOperation(operation: Operation, options: ChangeApplyOperationOptions): Change
  
      applyOperations(
        operations: Immutable.List<Operation> | Array<Operation>,
        options: ChangeApplyOperationOptions,
      ): Change
  
      call(fn: (change: Change, ...args: any[]) => void): Change
      withoutNormalization(fn: (change: Change) => void): Change
      setOperationFlag(key: keyof ChangeProperties["flags"], value: boolean): Change
      getFlag(
        key: keyof ChangeProperties["flags"],
        options: Partial<ChangeProperties["flags"]>,
      ): boolean
      unsetOperationFlag(key: keyof ChangeProperties["flags"]): Change
  
      get<T extends keyof ChangeProperties>(value: T): ChangeProperties[T]
    }
  
    interface ChangesWithSchema<NormalizeNodeByKeyOptions = { normalize?: boolean }> {
      normalize(options: NormalizeNodeByKeyOptions): Change
      normalizeDocument(options: NormalizeNodeByKeyOptions): Change
      normalizeNodeByKey(key: string, options: NormalizeNodeByKeyOptions): Change
      normalizeAncestorsByKey(key: string): Change
      normalizeParentByKey(key: string, options: NormalizeNodeByKeyOptions): Change
      normalizeNodeByPath(path: Path, options: NormalizeNodeByKeyOptions): Change
      normalizeParentByPath(path: Path, options: NormalizeNodeByKeyOptions): Change
      normalizeNodeAndChildren(node: Node, schema: Schema): Change
      normalizeNode(node: Node, schema: Schema): Change
    }
  
    interface ChangesAtCurrentRange {
      addMark(mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>): Change
      addMarks(
        marks: Immutable.List<Mark> | Array<Mark | Partial<MarkProperties> | Partial<MarkJSON>>,
      ): Change
      delete(): Change
      insertBlock(block: Block): Change
      insertFragment(fragment: Document): Change
      insertInline(inline: Inline | Partial<InlineProperties> | Partial<InlineJSON>): Change
      insertText(text: string, marks?: Immutable.Set<Mark>): Change
      removeMark(mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>): Change
      replaceMark(
        oldMark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        newMark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
      ): Change
      splitBlock(depth?: number): Change
      toggleMark(mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>): Change
      wrapText(prefix: string, suffix?: string): Change
    }
  
    interface ChangesAtRange<Options = { normalize?: boolean }> {
      addMarkAtRange(range: Range, mark: Mark, options?: Options): Change
      addMarksAtRange(
        range: Range,
        marks: Immutable.List<Mark> | Array<Mark>,
        options?: Options,
      ): Change
      deleteAtRange(range: Range, options?: Options): Change
      deleteCharBackwardAtRange(range: Range, options: Options): Change
      deleteLineBackwardAtRange(range: Range, options: Options): Change
      deleteWordBackwardAtRange(range: Range, options: Options): Change
      deleteBackwardAtRange(range: Range, options: Options): Change
  
      deleteCharForwardAtRange(range: Range, options: Options): Change
      deleteLineForwardAtRange(range: Range, options: Options): Change
      deleteWordForwardAtRange(range: Range, options: Options): Change
      deleteForwardAtRange(range: Range, options: Options): Change
  
      insertBlockAtRange(
        range: Range,
        block: Block | Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      insertFragmentAtRange(range: Range, fragment: Document, options?: Options): Change
      insertInlineAtRange(
        range: Range,
        inline: Inline | Partial<InlineProperties> | Partial<InlineJSON>,
        options?: Options,
      ): Change
      insertTextAtRange(
        range: Range,
        text: string,
        marks?: Immutable.Set<Mark>,
        options?: Options,
      ): Change
      removeMarkAtRange(
        range: Range,
        mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        options?: Options,
      ): Change
      setBlocksAtRange(
        range: Range,
        properties: Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      setInlinesAtRange(
        range: Range,
        properties: Partial<InlineProperties> | Partial<InlineJSON>,
        options?: Options,
      ): Change
      splitBlockAtRange(range: Range, height?: number, options?: Options): Change
      splitInlineAtRange(range: Range, height?: number, options?: Options): Change
      toggleMarkAtRange(
        range: Range,
        mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        options?: Options,
      ): Change
      unwrapBlockAtRange(
        range: Range,
        properties: Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      unwrapInlineAtRange(
        range: Range,
        properties: Partial<InlineProperties> | Partial<InlineJSON>,
        options?: Options,
      ): Change
      wrapBlockAtRange(
        range: Range,
        block: Block | Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      wrapInlineAtRange(
        range: Range,
        inline: Inline | Partial<InlineProperties> | Partial<InlineJSON>,
        options?: Options,
      ): Change
      wrapTextAtRange(range: Range, prefix: string, suffix?: string, options?: Options): Change
    }
  
    interface ChangesByPath<Options = { normalize?: boolean }> {
      addMarkByPath(
        path: Path,
        offset: number,
        length: number,
        mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        options?: Options,
      ): Change
      insertFragmentByPath(path: Path, index: number, fragment: Document, options?: Options): Change
      insertNodeByPath(
        path: Path,
        index: number,
        node: Node | Partial<NodeProperties> | Partial<NodeJSON>,
        options?: Options,
      ): Change
      insertTextByPath(
        path: Path,
        offset: number,
        text: string,
        marks: Immutable.Set<Mark>,
        options?: Options,
      ): Change
      mergeNodeByPath(path: Path, options?: Options): Change
      moveNodeByPath(path: Path, newPath: Path, newIndex: number, options?: Options): Change
      removeMarkByPath(
        path: Path,
        offset: number,
        length: number,
        mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        options?: Options,
      ): Change
      removeAllMarksByPath(path: Path, options?: Options): Change
      removeNodeByPath(path: Path, options?: Options): Change
      removeTextByPath(path: Path, offset: number, length: number, options?: Options): Change
      replaceNodeByPath(
        path: Path,
        newNode: Node | Partial<NodeProperties> | Partial<NodeJSON>,
        options?: Options,
      ): Change
      replaceTextByPath(
        path: Path,
        offset: number,
        length: number,
        text: string,
        marks: Immutable.Set<Mark>,
        options?: Options,
      ): Change
      setMarkByPath(
        path: Path,
        offset: number,
        length: number,
        mark: Mark | Partial<MarkProperties> | Partial<MarkJSON>,
        properties: any, //TODO: This seems like a bug in Slate
        options?: Options,
      ): Change
      setNodeByPath(
        path: Path,
        properties: Partial<NodeProperties> | Partial<NodeJSON>,
        options?: Options,
      ): Change
      setTextByPath(path: Path, text: string, marks: Immutable.Set<Mark>, options?: Options): Change
      splitNodeByPath(path: Path, position: number, options?: Options): Change
      splitDescendantsByPath(
        path: Path,
        textPath: Path,
        textOffset: number,
        options?: Options,
      ): Change
      unwrapInlineByPath(
        path: Path,
        properties: Partial<InlineProperties> | Partial<InlineJSON>,
        options?: Options,
      ): Change
      unwrapBlockByPath(
        path: Path,
        properties: Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      unwrapNodeByPath(path: Path, options?: Options): Change
      wrapBlockByPath(
        path: Path,
        block: Block | Partial<BlockProperties> | Partial<BlockJSON>,
        options?: Options,
      ): Change
      wrapNodeByPath(path: Path, node: Node | Partial<NodeProperties> | Partial<NodeJSON>): Change
    }
  
    interface ChangesOnHistory {
      redo(): Change
      undo(): Change
    }
  
    interface ChangesOnSelection {
      blur(): Change
      deselect(): Change
      focus(): Change
      flip(): Change
      moveAnchorBackward(n?: number): Change
      moveAnchorForward(n?: number): Change
      moveAnchorTo(path: Path | PathJSON | string, offset: number): Change
      moveAnchorToEndOfBlock(): Change
      moveAnchorToEndOfInline(): Change
      moveAnchorToEndOfDocument(): Change
      moveAnchorToEndOfNextBlock(): Change
      moveAnchorToEndOfNextInline(): Change
      moveAnchorToEndOfNextText(): Change
      moveAnchorToEndOfNode(node: Node): Change
      moveAnchorToEndOfPreviousBlock(): Change
      moveAnchorToEndOfPreviousInline(): Change
      moveAnchorToEndOfPreviousText(): Change
      moveAnchorToEndOfText(): Change
      moveAnchorToStartOfBlock(): Change
      moveAnchorToStartOfDocument(): Change
      moveAnchorToStartOfInline(): Change
      moveAnchorToStartOfNextBlock(): Change
      moveAnchorToStartOfNextInline(): Change
      moveAnchorToStartOfNextText(): Change
      moveAnchorToStartOfNode(node: Node): Change
      moveAnchorToStartOfPreviousBlock(): Change
      moveAnchorToStartOfPreviousInline(): Change
      moveAnchorToStartOfPreviousText(): Change
      moveAnchorToStartOfText(): Change
      moveBackward(n?: number): Change
      moveEndBackward(n?: number): Change
      moveEndForward(n?: number): Change
      moveEndTo(path: Path | PathJSON | string, offset: number): Change
      moveEndToEndOfBlock(): Change
      moveEndToEndOfDocument(): Change
      moveEndToEndOfInline(): Change
      moveEndToEndOfNextBlock(): Change
      moveEndToEndOfNextInline(): Change
      moveEndToEndOfNextText(): Change
      moveEndToEndOfNode(node: Node): Change
      moveEndToEndOfPreviousBlock(): Change
      moveEndToEndOfPreviousInline(): Change
      moveEndToEndOfPreviousText(): Change
      moveEndToEndOfText(): Change
      moveEndToStartOfBlock(): Change
      moveEndToStartOfDocument(): Change
      moveEndToStartOfInline(): Change
      moveEndToStartOfNextBlock(): Change
      moveEndToStartOfNextInline(): Change
      moveEndToStartOfNextText(): Change
      moveEndToStartOfNode(node: Node): Change
      moveEndToStartOfPreviousBlock(): Change
      moveEndToStartOfPreviousInline(): Change
      moveEndToStartOfPreviousText(): Change
      moveEndToStartOfText(): Change
      moveFocusBackward(n?: number): Change
      moveFocusForward(n?: number): Change
      moveFocusTo(path: Path | PathJSON | string, offset: number): Change
      moveFocusToEndOfBlock(): Change
      moveFocusToEndOfDocument(): Change
      moveFocusToEndOfInline(): Change
      moveFocusToEndOfNextBlock(): Change
      moveFocusToEndOfNextInline(): Change
      moveFocusToEndOfNextText(): Change
      moveFocusToEndOfNode(node: Node): Change
      moveFocusToEndOfPreviousBlock(): Change
      moveFocusToEndOfPreviousInline(): Change
      moveFocusToEndOfPreviousText(): Change
      moveFocusToEndOfText(): Change
      moveFocusToStartOfBlock(): Change
      moveFocusToStartOfDocument(): Change
      moveFocusToStartOfInline(): Change
      moveFocusToStartOfNextBlock(): Change
      moveFocusToStartOfNextInline(): Change
      moveFocusToStartOfNextText(): Change
      moveFocusToStartOfNode(node: Node): Change
      moveFocusToStartOfPreviousBlock(): Change
      moveFocusToStartOfPreviousInline(): Change
      moveFocusToStartOfPreviousText(): Change
      moveFocusToStartOfText(): Change
      moveForward(n?: number): Change
      moveStartBackward(n?: number): Change
      moveStartForward(n?: number): Change
      moveStartTo(path: Path | PathJSON | string, offset: number): Change
      moveStartToEndOfBlock(): Change
      moveStartToEndOfDocument(): Change
      moveStartToEndOfInline(): Change
      moveStartToEndOfNextBlock(): Change
      moveStartToEndOfNextInline(): Change
      moveStartToEndOfNextText(): Change
      moveStartToEndOfNode(node: Node): Change
      moveStartToEndOfPreviousBlock(): Change
      moveStartToEndOfPreviousInline(): Change
      moveStartToEndOfPreviousText(): Change
      moveStartToEndOfText(): Change
      moveStartToStartOfBlock(): Change
      moveStartToStartOfDocument(): Change
      moveStartToStartOfInline(): Change
      moveStartToStartOfNextBlock(): Change
      moveStartToStartOfNextInline(): Change
      moveStartToStartOfNextText(): Change
      moveStartToStartOfNode(node: Node): Change
      moveStartToStartOfPreviousBlock(): Change
      moveStartToStartOfPreviousInline(): Change
      moveStartToStartOfPreviousText(): Change
      moveStartToStartOfText(): Change
      moveTo(path: Path | PathJSON | string, offset: number): Change
      moveToAnchor(): Change
      moveToEnd(): Change
      moveToEndOfBlock(): Change
      moveToEndOfDocument(): Change
      moveToEndOfInline(): Change
      moveToEndOfNextBlock(): Change
      moveToEndOfNextInline(): Change
      moveToEndOfNextText(): Change
      moveToEndOfNode(node: Node): Change
      moveToEndOfPreviousBlock(): Change
      moveToEndOfPreviousInline(): Change
      moveToEndOfPreviousText(): Change
      moveToEndOfText(): Change
      moveToFocus(): Change
      moveToRangeOfDocument(): Change
      moveToRangeOfNode(start: Node, end?: Node): Change
      moveToStart(): Change
      moveToStartOfBlock(): Change
      moveToStartOfDocument(): Change
      moveToStartOfInline(): Change
      moveToStartOfNextBlock(): Change
      moveToStartOfNextInline(): Change
      moveToStartOfNextText(): Change
      moveToStartOfNode(node: Node): Change
      moveToStartOfPreviousBlock(): Change
      moveToStartOfPreviousInline(): Change
      moveToStartOfPreviousText(): Change
      moveToStartOfText(): Change
      select(
        properties: Selection | Partial<SelectionProperties> | Partial<SelectionJSON>,
        options?: { snapshot?: boolean },
      ): Change
      setAnchor(point: Point): Change
      setEnd(point: Point): Change
      setFocus(point: Point): Change
      setStart(point: Point): Change
      snapshotSelection(): Change
    }
  
    interface ChangesOnValue {
      setValue(
        properties: Value | Partial<ValueProperties> | Partial<ValueJSON>,
        options?: ChangeApplyOperationOptions,
      ): Change
    }
  
    export type Operation =
      | InsertTextOperation
      | RemoveTextOperation
      | AddMarkOperation
      | RemoveMarkOperation
      | SetMarkOperation
      | InsertNodeOperation
      | MergeNodeOperation
      | MoveNodeOperation
      | RemoveNodeOperation
      | SetNodeOperation
      | SplitNodeOperation
      | SetSelectionOperation
      | SetValueOperation
  
    export interface InsertTextOperation {
      type: "insert_text"
      path: number[]
      offset: number
      text: string
      marks: Mark[]
    }
  
    export interface RemoveTextOperation {
      type: "remove_text"
      path: number[]
      offset: number
      text: string
    }
  
    export interface AddMarkOperation {
      type: "add_mark"
      path: number[]
      offset: number
      length: number
      mark: Mark
    }
  
    export interface RemoveMarkOperation {
      type: "remove_mark"
      path: number[]
      offset: number
      length: number
      mark: Mark
    }
  
    export interface SetMarkOperation {
      type: "set_mark"
      path: number[]
      offset: number
      length: number
      mark: Mark
      properties: Partial<MarkProperties>
    }
  
    export interface InsertNodeOperation {
      type: "insert_node"
      path: number[]
      node: Node
    }
  
    export interface MergeNodeOperation {
      type: "merge_node"
      path: number[]
      position: number
    }
  
    export interface MoveNodeOperation {
      type: "move_node"
      path: number[]
      newPath: number[]
    }
  
    export interface RemoveNodeOperation {
      type: "remove_node"
      path: number[]
      node: Node
    }
  
    export interface SetNodeOperation {
      type: "set_node"
      path: number[]
      properties: Partial<BlockProperties> | Partial<InlineProperties> | Partial<TextProperties>
    }
  
    export interface SplitNodeOperation {
      type: "split_node"
      path: number[]
      position: number
      target: number
    }
  
    export interface SetSelectionOperation {
      type: "set_selection"
      properties: Partial<RangeProperties>
      selection: Range
    }
  
    export interface SetValueOperation {
      type: "set_value"
      properties: Partial<ValueProperties>
      value: Value
    }
  
    export interface HistoryProperties extends RangeProperties {
      redos: Immutable.Stack<Operation>
      undos: Immutable.Stack<Operation>
    }
    export interface HistoryJSON extends RangeJSON {
      redos: Array<Operation>
      undos: Array<Operation>
    }
    export interface History extends DeepImmutable<HistoryProperties>, RangeInterface {}
    export class History {
      readonly object: "history"
  
      static fromJS(args: HistoryProperties): History
      static toJS(): HistoryProperties
  
      static create(attrs: History | Partial<HistoryProperties> | Partial<HistoryJSON>): History
      static createOperationsList(
        operations: Immutable.List<Operation> | Array<Operation>,
      ): Immutable.List<Operation>
  
      static fromJSON(object: Partial<HistoryJSON> | History): History
      static isHistory(maybeHistory: any): maybeHistory is History
  
      save(operation: Operation, options: { merge: boolean; skip: boolean }): History
  
      toJSON(options: ToJSONOptions): HistoryJSON
  
      get<T extends keyof HistoryProperties>(value: T): HistoryProperties[T]
    }
  
    export interface ValueProperties {
      data: Data<string, any>
      decorations: Immutable.List<Decoration>
      document: Document
      history: History
      schema: Schema
      selection: Selection
    }
    export interface ValueJSON {
      data: DataJSON<string, any>
      decorations: Array<DecorationJSON>
      document: DocumentJSON
      history: HistoryJSON
      schema: SchemaJSON
      selection: SelectionJSON
    }
    export interface Value extends DeepImmutable<ValueProperties> {}
    export class Value {
      readonly object: "value"
  
      readonly anchorBlock: Block
      readonly focusBlock: Block
      readonly startBlock: Block
      readonly endBlock: Block
  
      readonly anchorInline: Inline
      readonly focusInline: Inline
      readonly startInline: Inline
      readonly endInline: Inline
  
      readonly anchorText: Text
      readonly focusText: Text
      readonly startText: Text
      readonly endText: Text
  
      readonly nextBlock: Block
      readonly previousBlock: Block
  
      readonly nextInline: Inline
      readonly previousInline: Inline
  
      readonly nextText: Text
      readonly previousText: Text
  
      readonly marks: Immutable.Set<Mark>
      readonly activeMarks: Immutable.Set<Mark>
      readonly blocks: Immutable.List<Block>
      readonly fragment: Document
      readonly inlines: Immutable.List<Inline>
      readonly texts: Immutable.List<Text>
  
      static fromJS(args: ValueProperties): Value
      static toJS(): ValueProperties
  
      static create(
        value: Value | Partial<ValueProperties> | Immutable.List<Node> | Array<Node>,
      ): Value
      static createProperties(
        point: Partial<ValueJSON> | Partial<ValueProperties> | Value,
      ): ValueProperties
      static fromJSON(value: Partial<ValueJSON> | Value, options?: { normalize?: boolean }): Value
      static isValue(maybeValue: any): maybeValue is Value
  
      change(attrs: Partial<ChangeProperties> | Partial<ChangeJSON>): Change
      addMark(path: Path, offset: number, length: number, mark: Mark): Value
      insertNode(path: Path, node: Node): Value
      insertText(path: Path, offset: number, text: string, marks: Immutable.Set<Mark>): Value
      mergeNode(path: Path): Value
      moveNode(path: Path, newPath: Path, newIndex?: number): Value
      splitNode(
        path: Path,
        position: number,
        propterties: Partial<NodeProperties> | Partial<NodeJSON>,
      ): Value
      removeMark(path: Path, offset: number, length: number, mark: Mark): Value
      removeNode(path: Path): Value
      removeText(path: Path, offset: number, text: string): Value
  
      setNode(path: Path, properties: Partial<NodeProperties> | Partial<NodeJSON>): Value
      setMark(
        path: Path,
        offset: number,
        length: number,
        mark: Mark,
        properties: MarkProperties,
      ): Value
      setSelection(properties: Partial<SelectionProperties>): Value
      setProperties(properties: Partial<ValueProperties>): Value
      mapRanges(iterator: (range: Range) => Range): Value
      clearAtomicRanges(key: string, from: number, to?: number | null): Value
  
      toJSON(
        options: ToJSONOptions & {
          preserveData: boolean
          preserveDecorations: boolean
          preserveHistory: boolean
          preserveSelection: boolean
          preserveSchema: boolean
        },
      ): ValueJSON
  
      get<T extends keyof ValueProperties>(value: T): ValueProperties[T]
    }
  
    export interface StackProperties {
      plugins: any[]
    }
    export interface Stack extends DeepImmutable<StackProperties> {}
    export class Stack extends Immutable.Record({}) {}
  }
  