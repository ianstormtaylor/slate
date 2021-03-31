# Location Types

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`.

```typescript
type Location = Path | Point | Range
```

- [Location](./api/location.md)
- [Path](./api/path.md)
- [Point](./api/point.md)
- [Range](./api/range.md)
