# Span API

A `Span` is a low-level way to refer to a `Range` using `Element` as the end points instead of a `Point` which requires the use of leaf text nodes.

```typescript
type Span = [Path, Path]
```

- [Static methods](span.md#static-methods)
  - [Check methods](span.md#check-methods)

## Static Methods

### Check Methods

#### `Span.isSpan(value: any) => value is Span`

Check if a `value` implements the `Span` interface.
