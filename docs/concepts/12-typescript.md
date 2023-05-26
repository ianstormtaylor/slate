# Using TypeScript

Slate supports typing of one Slate document model \(ie. one set of custom `Editor`, `Element` and `Text` types\). If you need to support more than one document model, see the section Multiple Document Models.

**Warning:** You must define `CustomTypes`, annotate `useState`, and annotate the editor's initial state when using TypeScript or Slate will display typing errors.

## Migrating from 0.47.x

When migrating from 0.47.x, read the guide below first. Also keep in mind these common migration issues:

- When referring to `node.type`, you may see the error `Property 'type' does not exist on type 'Node'`. To fix this, you need to add code like `Element.isElement(node) && node.type === 'paragraph'`. This is necessary because a `Node` can be an `Element` or `Text` and `Text` does not have a `type` property.
- Be careful when you define the CustomType for `Editor`. Make sure to define the CustomType for `Editor` as `BaseEditor & ...`. It should not be `Editor & ...`

## Defining `Editor`, `Element` and `Text` Types

To define a custom `Element` or `Text` type, extend the `CustomTypes` interface in the `slate` module like this.

```typescript
// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string; bold?: true }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}
```

## Annotations in the Editor

Annotate the editor's initial value w/ `Descendant[]`.

```tsx
import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
```

## Best Practices for `Element` and `Text` Types

While you can define types directly in the `CustomTypes` interface, best practice is to define and export each type separately so that you can reference individual types like a `ParagraphElement`.

Using best practices, the custom types might look something like:

```typescript
// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: number
  children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement

export type FormattedText = { text: string; bold?: true }

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
```

In this example, `CustomText` is equal to `FormattedText` but in a real editor, there can be more types of text like text in a code block which may not allow formatting for example.

## Why Is The Type Definition Unusual

Because it gets asked often, this section explains why Slate's type definition is atypical.

Slate needs to support a feature called type discrimination which is available when using union types \(e.g. `ParagraphElement | HeadingElement`\). This allows a user to narrow a type. If presented with code like `if (node.type === 'paragraph') { ... }` the inside of the block, will narrow the type of node to `ParagraphElement`.

Slate also needs a way to allow developers to get their custom types into Slate. This is done through declaration merging which is a feature of an `interface`.

Slate combines a union type and an interface in order to use both features.

For more information see [Proposal: Add Custom TypeScript Types to Slate](https://github.com/ianstormtaylor/slate/issues/3725)

## Multiple Document Models

At the moment, Slate supports types for a single document model at a time. For example, it cannot support two different Rich Text Editor with different document schemas.

Slate's TypeScript support was designed this way because typing for one document schema was better than none. The goal is to eventually support typing for multiple editor definitions and there is currently an in progress PR built by the creator of Slate.

One workaround for supporting multiple document models is to create each editor in a separate package and then import them. This hasn't been tested but should work.

## Extending Other Types

Currently there is also support for extending other types but these haven't been tested as thoroughly as the ones documented above:

- `Selection`
- `Range`
- `Point`

Feel free to extend these types but extending these types should be considered experimental. Please report bugs on GitHub issues.

## TypeScript Examples

For some examples of how to use types, see `packages/slate-react/src/custom-types.ts` in the slate repository.
