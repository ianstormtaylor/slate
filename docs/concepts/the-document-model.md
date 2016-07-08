







# The Document Model

A big difference between Slate and other rich-text editors is that Slate is built on top of a nested, recursive document model—much like the DOM itself. This means you can build complex components like tables or nested block quotes, just like you can with the regular DOM.

Slate's model is split up into a series of parts:


#### Nodes

Just like the DOM, Slate's content is built up of a tree of nested nodes. There are four different types of nodes. At the very top you have a **document** node. At the very ends you have **text** nodes. And in between you have a varying amount of **block** and **inline** nodes.


###### Document

The **document** node is the top-most node of Slate's content. It serves as a wrapper for all of its child nodes.

A **document** node can only have **block** nodes as its direct children.


###### Blocks

**Block** nodes, just like in the DOM, are block-level pieces of content—for example, things like paragraphs, quotes, list items, etc. They can have any combination of other **block** nodes, or **inline** and **text** nodes as their children. 


###### Inlines

**Inline** nodes, also like in the dom, are inline-level pieces of content—for example, things like links, hashtags, etc. However, this does _not_ include things like bold, italic or underline. For formatting, Slate uses another concept called [Marks](#characters-marks).

**Inline** nodes can have any combination of other **inline** nodes or **text** nodes as their children, just like in the DOM.


###### Text

**Text** nodes are the leaf nodes in Slate. Every branch of the document will always end in a text node, even if it's empty.


#### Characters & Marks


#### Selection


#### State


####
