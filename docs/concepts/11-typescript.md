# TypeScript

Slate supports typing of one Slate document model (eg. one set of custom `Element` and `Text` types).

If you need to support more than one document model, see the section Multiple Document Models.

## Defining Custom Element and Text Types

To define a custom `Element` or `Text` type, extend the `CustomTypes` interface in the `slate` module like this.

```ts
declare module 'slate' {
  interface CustomTypes {
    Element: { type: 'paragraph'; children: Descendant[] }
    Text: { text: string; bold: boolean; italic: boolean }
  }
}
```

## Recommended Custom Element and Text

While you can define types directly in the `CustomTypes` interface, best practice is to:

- define and export each custom `Element`/`Text` type
- merge these into and export `CustomElement`/`CustomText` type
- Use the `CustomElement`/`CustomText` in the `CustomTypes` definition

These are best practices because elsewhere in your code, you may want to directly reference a specific `Element` type like a bullet or image.

Using best practices, the custom types will look something like:

```ts
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

export type FormattedText = { text: 'string'; bold: boolean; italic: boolean }

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement
    Text: CustomText
  }
}
```

In this example, `CustomText` is equal to `FormattedText` but in a real editor, there can be more types of text like text in a code block which may not allow formatting for example.

## Why Is The Type Definition Unusual

Because it gets asked often, this section explains why Slate's type definition is atypical.

Slate needs to support a feature called type discrimination which is available when using union types (e.g. `ParagraphElement | HeadingElement`). This allows a user to narrow a type. If presented with code like `if (node.type === 'paragraph') { ... }` the inside of the block, will narrow the type of node to `ParagraphElement`.

Slate also needs a way to allow developers to get their custom types into Slate. This is done through declaration merging which is a feature of an `interface`.

Slate combines a union type and an interface to deliver this feature.

For more information see [Proposal: Add Custom TypeScript Types to Slate](https://github.com/ianstormtaylor/slate/issues/3725)

## Multiple Document Models

At the moment, Slate only supports types for a single document model at a time. For example, it cannot support a full Rich Text Editor for editing documents while also having a less featured Editor for editing comments.

Slate's TypeScript support was designed this way because some improved typing support was better than none. The goal is to also support typing for multiple editor definitions but this will depend on community support.

One workaround for support multiple document models is to create each editor in a separate package and then import them. This hasn't been tested but should work.

## Extending Other Types

Currently there is also support for extending:

- `Editor`
- `Selection`
- `Range`
- `Point`

Feel free to extend these types but extended these types should be considered experimental. We are actively looking for better ways to implement this.

For some examples of how to extend these types, see `packages/slate-react/src/custom-types.ts` in the slate repository.
