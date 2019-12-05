## Members

<dl>
<dt><a href="#createEditor">createEditor</a></dt>
<dd><p>Get the &quot;dirty&quot; paths generated from an operation.</p></dd>
<dt><a href="#Command">Command</a></dt>
<dd><p>The <code>AddMarkCommand</code> adds a mark to the current selection.</p></dd>
<dt><a href="#LocationQueries">LocationQueries</a></dt>
<dd><p>Get the from and to path span from a location.</p></dd>
<dt><a href="#MarkTransforms">MarkTransforms</a></dt>
<dd><p>Split the text nodes at a range's edges to prepare for adding/removing marks.</p></dd>
<dt><a href="#NodeTransforms">NodeTransforms</a></dt>
<dd><p>Convert a range into a point by deleting it's content.</p></dd>
<dt><a href="#Element">Element</a></dt>
<dd><p><code>ElementEntry</code> objects refer to an <code>Element</code> and the <code>Path</code> where it can be
found inside a root node.</p></dd>
<dt><a href="#Location">Location</a></dt>
<dd><p>The <code>Span</code> interface is a low-level way to refer to locations in nodes
without using <code>Point</code> which requires leaf text nodes to be present.</p></dd>
<dt><a href="#Mark">Mark</a></dt>
<dd><p><code>MarkEntry</code> tuples are returned when iterating through the marks in a text
node. They include the index of the mark in the text node's marks array, as
well as the text node and its path in the root node.</p></dd>
<dt><a href="#Node">Node</a></dt>
<dd><p>The <code>Descendant</code> union type represents nodes that are descendants in the
tree. It is returned as a convenience in certain cases to narrow a value
further than the more generic <code>Node</code> union.</p></dd>
<dt><a href="#Point">Point</a></dt>
<dd><p><code>PointEntry</code> objects are returned when iterating over <code>Point</code> objects that
belong to a range.</p></dd>
<dt><a href="#Text">Text</a></dt>
<dd><p><code>TextEntry</code> objects refer to an <code>Text</code> and the <code>Path</code> where it can be
found inside a root node.</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#SPACE">SPACE</a></dt>
<dd><p>Constants for string distance checking.</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#createEditor">createEditor()</a></dt>
<dd><p>Create a new Slate <code>Editor</code> object.</p></dd>
<dt><a href="#isWordCharacter">isWordCharacter()</a></dt>
<dd><p>Check if a character is a word character. The <code>remaining</code> argument is used
because sometimes you must read subsequent characters to truly determine it.</p></dd>
<dt><a href="#getCharacterDistance">getCharacterDistance()</a></dt>
<dd><p>Get the distance to the end of the first character in a string of text.</p></dd>
<dt><a href="#getWordDistance">getWordDistance()</a></dt>
<dd><p>Get the distance to the end of the first word in a string of text.</p></dd>
</dl>

<a name="createEditor"></a>

## createEditor
<p>Get the &quot;dirty&quot; paths generated from an operation.</p>

**Kind**: global variable  
<a name="Command"></a>

## Command
<p>The <code>AddMarkCommand</code> adds a mark to the current selection.</p>

**Kind**: global variable  

* [Command](#Command)
    * [.isCommand()](#Command.isCommand)
    * [.isAddMarkCommand()](#Command.isAddMarkCommand)
    * [.isCoreCommand()](#Command.isCoreCommand)
    * [.isDeleteBackwardCommand()](#Command.isDeleteBackwardCommand)
    * [.isDeleteForwardCommand()](#Command.isDeleteForwardCommand)
    * [.isDeleteFragmentCommand()](#Command.isDeleteFragmentCommand)
    * [.isInsertBreakCommand()](#Command.isInsertBreakCommand)
    * [.isInsertFragmentCommand()](#Command.isInsertFragmentCommand)
    * [.isInsertNodeCommand()](#Command.isInsertNodeCommand)
    * [.isInsertTextCommand()](#Command.isInsertTextCommand)
    * [.isRemoveMarkCommand()](#Command.isRemoveMarkCommand)

<a name="Command.isCommand"></a>

### Command.isCommand()
<p>Check if a value is a <code>Command</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isAddMarkCommand"></a>

### Command.isAddMarkCommand()
<p>Check if a value is an <code>AddMarkCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isCoreCommand"></a>

### Command.isCoreCommand()
<p>Check if a value is a <code>CoreCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isDeleteBackwardCommand"></a>

### Command.isDeleteBackwardCommand()
<p>Check if a value is a <code>DeleteBackwardCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isDeleteForwardCommand"></a>

### Command.isDeleteForwardCommand()
<p>Check if a value is a <code>DeleteForwardCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isDeleteFragmentCommand"></a>

### Command.isDeleteFragmentCommand()
<p>Check if a value is a <code>DeleteFragmentCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isInsertBreakCommand"></a>

### Command.isInsertBreakCommand()
<p>Check if a value is an <code>InsertBreakCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isInsertFragmentCommand"></a>

### Command.isInsertFragmentCommand()
<p>Check if a value is an <code>InsertFragmentCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isInsertNodeCommand"></a>

### Command.isInsertNodeCommand()
<p>Check if a value is an <code>InsertNodeCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isInsertTextCommand"></a>

### Command.isInsertTextCommand()
<p>Check if a value is a <code>InsertTextCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="Command.isRemoveMarkCommand"></a>

### Command.isRemoveMarkCommand()
<p>Check if a value is a <code>RemoveMarkCommand</code> object.</p>

**Kind**: static method of [<code>Command</code>](#Command)  
<a name="LocationQueries"></a>

## LocationQueries
<p>Get the from and to path span from a location.</p>

**Kind**: global variable  

* [LocationQueries](#LocationQueries)
    * [.activeMarks()](#LocationQueries.activeMarks)
    * [.after()](#LocationQueries.after)
    * [.ancestor()](#LocationQueries.ancestor)
    * [.before()](#LocationQueries.before)
    * [.edges()](#LocationQueries.edges)
    * [.elements()](#LocationQueries.elements)
    * [.end()](#LocationQueries.end)
    * [.first()](#LocationQueries.first)
    * [.fragment()](#LocationQueries.fragment)
    * [.isStart()](#LocationQueries.isStart)
    * [.isEnd()](#LocationQueries.isEnd)
    * [.isEdge()](#LocationQueries.isEdge)
    * [.last()](#LocationQueries.last)
    * [.leaf()](#LocationQueries.leaf)
    * [.levels()](#LocationQueries.levels)
    * [.marks()](#LocationQueries.marks)
    * [.match()](#LocationQueries.match)
    * [.matches()](#LocationQueries.matches)
    * [.next()](#LocationQueries.next)
    * [.node()](#LocationQueries.node)
    * [.nodes()](#LocationQueries.nodes)
    * [.parent()](#LocationQueries.parent)
    * [.path()](#LocationQueries.path)
    * [.point()](#LocationQueries.point)
    * [.positions()](#LocationQueries.positions)
    * [.previous()](#LocationQueries.previous)
    * [.range()](#LocationQueries.range)
    * [.start()](#LocationQueries.start)
    * [.text()](#LocationQueries.text)
    * [.texts()](#LocationQueries.texts)

<a name="LocationQueries.activeMarks"></a>

### LocationQueries.activeMarks()
<p>Get the marks that are &quot;active&quot; at a location. These are the
marks that will be added to any text that is inserted.</p>
<p>The <code>union: true</code> option can be passed to create a union of marks across
the text nodes in the selection, instead of creating an intersection, which
is the default.</p>
<p>Note: to obey common rich text behavior, if the selection is collapsed at
the start of a text node and there are previous text nodes in the same
block, it will carry those marks forward from the previous text node. This
allows for continuation of marks from previous words.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.after"></a>

### LocationQueries.after()
<p>Get the point after a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.ancestor"></a>

### LocationQueries.ancestor()
<p>Get the common ancestor node of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.before"></a>

### LocationQueries.before()
<p>Get the point before a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.edges"></a>

### LocationQueries.edges()
<p>Get the start and end points of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.elements"></a>

### LocationQueries.elements()
<p>Iterate through all of the elements in the Editor.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.end"></a>

### LocationQueries.end()
<p>Get the end point of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.first"></a>

### LocationQueries.first()
<p>Get the first node at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.fragment"></a>

### LocationQueries.fragment()
<p>Get the fragment at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.isStart"></a>

### LocationQueries.isStart()
<p>Check if a point the start point of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.isEnd"></a>

### LocationQueries.isEnd()
<p>Check if a point is the end point of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.isEdge"></a>

### LocationQueries.isEdge()
<p>Check if a point is an edge of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.last"></a>

### LocationQueries.last()
<p>Get the last node at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.leaf"></a>

### LocationQueries.leaf()
<p>Get the leaf text node at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.levels"></a>

### LocationQueries.levels()
<p>Iterate through all of the levels at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.marks"></a>

### LocationQueries.marks()
<p>Iterate through all of the text nodes in the Editor.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.match"></a>

### LocationQueries.match()
<p>Get the first matching node in a single branch of the document.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.matches"></a>

### LocationQueries.matches()
<p>Iterate through all of the nodes that match.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.next"></a>

### LocationQueries.next()
<p>Get the matching node in the branch of the document after a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.node"></a>

### LocationQueries.node()
<p>Get the node at a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.nodes"></a>

### LocationQueries.nodes()
<p>Iterate through all of the nodes in the Editor.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.parent"></a>

### LocationQueries.parent()
<p>Get the parent node of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.path"></a>

### LocationQueries.path()
<p>Get the path of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.point"></a>

### LocationQueries.point()
<p>Get the start or end point of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.positions"></a>

### LocationQueries.positions()
<p>Iterate through all of the positions in the document where a <code>Point</code> can be
placed.</p>
<p>By default it will move forward by individual offsets at a time,  but you
can pass the <code>unit: 'character'</code> option to moved forward one character, word,
or line at at time.</p>
<p>Note: void nodes are treated as a single point, and iteration will not
happen inside their content.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.previous"></a>

### LocationQueries.previous()
<p>Get the matching node in the branch of the document before a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.range"></a>

### LocationQueries.range()
<p>Get a range of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.start"></a>

### LocationQueries.start()
<p>Get the start point of a location.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.text"></a>

### LocationQueries.text()
<p>Get the text content of a location.</p>
<p>Note: the text of void nodes is presumed to be an empty string, regardless
of what their actual content is.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="LocationQueries.texts"></a>

### LocationQueries.texts()
<p>Iterate through all of the text nodes in the Editor.</p>

**Kind**: static method of [<code>LocationQueries</code>](#LocationQueries)  
<a name="MarkTransforms"></a>

## MarkTransforms
<p>Split the text nodes at a range's edges to prepare for adding/removing marks.</p>

**Kind**: global variable  
<a name="MarkTransforms.addMarks"></a>

### MarkTransforms.addMarks()
<p>Add a set of marks to the text nodes at a location.</p>

**Kind**: static method of [<code>MarkTransforms</code>](#MarkTransforms)  
<a name="NodeTransforms"></a>

## NodeTransforms
<p>Convert a range into a point by deleting it's content.</p>

**Kind**: global variable  

* [NodeTransforms](#NodeTransforms)
    * [.insertNodes()](#NodeTransforms.insertNodes)
    * [.liftNodes()](#NodeTransforms.liftNodes)
    * [.mergeNodes()](#NodeTransforms.mergeNodes)
    * [.moveNodes()](#NodeTransforms.moveNodes)
    * [.removeNodes()](#NodeTransforms.removeNodes)
    * [.setNodes()](#NodeTransforms.setNodes)
    * [.splitNodes()](#NodeTransforms.splitNodes)
    * [.unwrapNodes()](#NodeTransforms.unwrapNodes)
    * [.wrapNodes()](#NodeTransforms.wrapNodes)

<a name="NodeTransforms.insertNodes"></a>

### NodeTransforms.insertNodes()
<p>Insert nodes at a specific location in the Editor.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.liftNodes"></a>

### NodeTransforms.liftNodes()
<p>Lift nodes at a specific location upwards in the document tree, splitting
their parent in two if necessary.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.mergeNodes"></a>

### NodeTransforms.mergeNodes()
<p>Merge a node at a location with the previous node of the same depth,
removing any empty containing nodes after the merge if necessary.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.moveNodes"></a>

### NodeTransforms.moveNodes()
<p>Move the nodes at a location to a new location.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.removeNodes"></a>

### NodeTransforms.removeNodes()
<p>Remove the nodes at a specific location in the document.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.setNodes"></a>

### NodeTransforms.setNodes()
<p>Set new properties on the nodes ...</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.splitNodes"></a>

### NodeTransforms.splitNodes()
<p>Split the nodes at a specific location.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.unwrapNodes"></a>

### NodeTransforms.unwrapNodes()
<p>Unwrap the nodes at a location from a parent node, splitting the parent if
necessary to ensure that only the content in the range is unwrapped.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="NodeTransforms.wrapNodes"></a>

### NodeTransforms.wrapNodes()
<p>Wrap the nodes at a location in a new container node, splitting the edges
of the range first to ensure that only the content in the range is wrapped.</p>

**Kind**: static method of [<code>NodeTransforms</code>](#NodeTransforms)  
<a name="Element"></a>

## Element
<p><code>ElementEntry</code> objects refer to an <code>Element</code> and the <code>Path</code> where it can be
found inside a root node.</p>

**Kind**: global variable  

* [Element](#Element)
    * [.isElement()](#Element.isElement)
    * [.isElementList()](#Element.isElementList)
    * [.matches()](#Element.matches)

<a name="Element.isElement"></a>

### Element.isElement()
<p>Check if a value implements the <code>Element</code> interface.</p>

**Kind**: static method of [<code>Element</code>](#Element)  
<a name="Element.isElementList"></a>

### Element.isElementList()
<p>Check if a value is an array of <code>Element</code> objects.</p>

**Kind**: static method of [<code>Element</code>](#Element)  
<a name="Element.matches"></a>

### Element.matches()
<p>Check if an element matches set of properties.</p>
<p>Note: this checks custom properties, and it does not ensure that any
children are equivalent.</p>

**Kind**: static method of [<code>Element</code>](#Element)  
<a name="Location"></a>

## Location
<p>The <code>Span</code> interface is a low-level way to refer to locations in nodes
without using <code>Point</code> which requires leaf text nodes to be present.</p>

**Kind**: global variable  
<a name="Location.isLocation"></a>

### Location.isLocation()
<p>Check if a value implements the <code>Location</code> interface.</p>

**Kind**: static method of [<code>Location</code>](#Location)  
<a name="Mark"></a>

## Mark
<p><code>MarkEntry</code> tuples are returned when iterating through the marks in a text
node. They include the index of the mark in the text node's marks array, as
well as the text node and its path in the root node.</p>

**Kind**: global variable  

* [Mark](#Mark)
    * [.exists()](#Mark.exists)
    * [.isMark()](#Mark.isMark)
    * [.isMarkSet()](#Mark.isMarkSet)
    * [.matches()](#Mark.matches)

<a name="Mark.exists"></a>

### Mark.exists()
<p>Check if a mark exists in a set of marks.</p>

**Kind**: static method of [<code>Mark</code>](#Mark)  
<a name="Mark.isMark"></a>

### Mark.isMark()
<p>Check if a value implements the <code>Mark</code> interface.</p>

**Kind**: static method of [<code>Mark</code>](#Mark)  
<a name="Mark.isMarkSet"></a>

### Mark.isMarkSet()
<p>Check if a value is an array of <code>Mark</code> objects.</p>

**Kind**: static method of [<code>Mark</code>](#Mark)  
<a name="Mark.matches"></a>

### Mark.matches()
<p>Check if a mark matches set of properties.</p>

**Kind**: static method of [<code>Mark</code>](#Mark)  
<a name="Node"></a>

## Node
<p>The <code>Descendant</code> union type represents nodes that are descendants in the
tree. It is returned as a convenience in certain cases to narrow a value
further than the more generic <code>Node</code> union.</p>

**Kind**: global variable  

* [Node](#Node)
    * [.ancestor()](#Node.ancestor)
    * [.ancestors()](#Node.ancestors)
    * [.child()](#Node.child)
    * [.closest()](#Node.closest)
    * [.common()](#Node.common)
    * [.descendant()](#Node.descendant)
    * [.descendants()](#Node.descendants)
    * [.elements()](#Node.elements)
    * [.first()](#Node.first)
    * [.fragment()](#Node.fragment)
    * [.furthest()](#Node.furthest)
    * [.get()](#Node.get)
    * [.has()](#Node.has)
    * [.isNode()](#Node.isNode)
    * [.isNodeList()](#Node.isNodeList)
    * [.last()](#Node.last)
    * [.leaf()](#Node.leaf)
    * [.levels()](#Node.levels)
    * [.marks()](#Node.marks)
    * [.nodes()](#Node.nodes)
    * [.parent()](#Node.parent)
    * [.text()](#Node.text)
    * [.texts()](#Node.texts)

<a name="Node.ancestor"></a>

### Node.ancestor()
<p>Get the node at a specific path, asserting that it's an ancestor node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.ancestors"></a>

### Node.ancestors()
<p>Return an iterable of all the ancestor nodes above a specific path.</p>
<p>By default the order is bottom-up, from lowest to highest ancestor in
the tree, but you can pass the <code>reverse: true</code> option to go top-down.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.child"></a>

### Node.child()
<p>Get the child of a node at a specific index.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.closest"></a>

### Node.closest()
<p>Find the closest matching node entry starting from a specific path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.common"></a>

### Node.common()
<p>Get an entry for the common ancesetor node of two paths.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.descendant"></a>

### Node.descendant()
<p>Get the node at a specific path, asserting that it's a descendant node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.descendants"></a>

### Node.descendants()
<p>Return an iterable of all the descendant node entries inside a root node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.elements"></a>

### Node.elements()
<p>Return an iterable of all the element nodes inside a root node. Each iteration
will return an <code>ElementEntry</code> tuple consisting of <code>[Element, Path]</code>. If the
root node is an element it will be included in the iteration as well.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.first"></a>

### Node.first()
<p>Get the first node entry in a root node from a path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.fragment"></a>

### Node.fragment()
<p>Get the sliced fragment represented by a range inside a root node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.furthest"></a>

### Node.furthest()
<p>Find the furthest matching node entry starting from a specific path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.get"></a>

### Node.get()
<p>Get the descendant node referred to by a specific path. If the path is an
empty array, it refers to the root node itself.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.has"></a>

### Node.has()
<p>Check if a descendant node exists at a specific path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.isNode"></a>

### Node.isNode()
<p>Check if a value implements the <code>Node</code> interface.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.isNodeList"></a>

### Node.isNodeList()
<p>Check if a value is a list of <code>Node</code> objects.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.last"></a>

### Node.last()
<p>Get the lash node entry in a root node from a path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.leaf"></a>

### Node.leaf()
<p>Get the node at a specific path, ensuring it's a leaf text node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.levels"></a>

### Node.levels()
<p>Return an iterable of the in a branch of the tree, from a specific path.</p>
<p>By default the order is top-down, from lowest to highest node in the tree,
but you can pass the <code>reverse: true</code> option to go bottom-up.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.marks"></a>

### Node.marks()
<p>Return an iterable of all the marks in all of the text nodes in a root node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.nodes"></a>

### Node.nodes()
<p>Return an iterable of all the node entries of a root node. Each entry is
returned as a <code>[Node, Path]</code> tuple, with the path referring to the node's
position inside the root node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.parent"></a>

### Node.parent()
<p>Get the parent of a node at a specific path.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.text"></a>

### Node.text()
<p>Get the concatenated text string of a node's content.</p>
<p>Note that this will not include spaces or line breaks between block nodes.
It is not a user-facing string, but a string for performing offset-related
computations for a node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Node.texts"></a>

### Node.texts()
<p>Return an iterable of all leaf text nodes in a root node.</p>

**Kind**: static method of [<code>Node</code>](#Node)  
<a name="Point"></a>

## Point
<p><code>PointEntry</code> objects are returned when iterating over <code>Point</code> objects that
belong to a range.</p>

**Kind**: global variable  

* [Point](#Point)
    * [.compare()](#Point.compare)
    * [.isAfter()](#Point.isAfter)
    * [.isBefore()](#Point.isBefore)
    * [.equals()](#Point.equals)
    * [.isPoint()](#Point.isPoint)
    * [.transform()](#Point.transform)

<a name="Point.compare"></a>

### Point.compare()
<p>Compare a point to another, returning an integer indicating whether the
point was before, at, or after the other.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Point.isAfter"></a>

### Point.isAfter()
<p>Check if a point is after another.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Point.isBefore"></a>

### Point.isBefore()
<p>Check if a point is before another.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Point.equals"></a>

### Point.equals()
<p>Check if a point is exactly equal to another.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Point.isPoint"></a>

### Point.isPoint()
<p>Check if a value implements the <code>Point</code> interface.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Point.transform"></a>

### Point.transform()
<p>Transform a point by an operation.</p>

**Kind**: static method of [<code>Point</code>](#Point)  
<a name="Text"></a>

## Text
<p><code>TextEntry</code> objects refer to an <code>Text</code> and the <code>Path</code> where it can be
found inside a root node.</p>

**Kind**: global variable  

* [Text](#Text)
    * [.isText()](#Text.isText)
    * [.isTextList()](#Text.isTextList)
    * [.matches()](#Text.matches)

<a name="Text.isText"></a>

### Text.isText()
<p>Check if a value implements the <code>Text</code> interface.</p>

**Kind**: static method of [<code>Text</code>](#Text)  
<a name="Text.isTextList"></a>

### Text.isTextList()
<p>Check if a value is a list of <code>Text</code> objects.</p>

**Kind**: static method of [<code>Text</code>](#Text)  
<a name="Text.matches"></a>

### Text.matches()
<p>Check if an text matches set of properties.</p>
<p>Note: this is for matching custom properties, and it does not ensure that
the <code>text</code> property are two nodes equal. However, if <code>marks</code> are passed it
will ensure that the set of marks is exactly equal.</p>

**Kind**: static method of [<code>Text</code>](#Text)  
<a name="SPACE"></a>

## SPACE
<p>Constants for string distance checking.</p>

**Kind**: global constant  
<a name="createEditor"></a>

## createEditor()
<p>Create a new Slate <code>Editor</code> object.</p>

**Kind**: global function  
<a name="isWordCharacter"></a>

## isWordCharacter()
<p>Check if a character is a word character. The <code>remaining</code> argument is used
because sometimes you must read subsequent characters to truly determine it.</p>

**Kind**: global function  
<a name="getCharacterDistance"></a>

## getCharacterDistance()
<p>Get the distance to the end of the first character in a string of text.</p>

**Kind**: global function  
<a name="getWordDistance"></a>

## getWordDistance()
<p>Get the distance to the end of the first word in a string of text.</p>

**Kind**: global function  
