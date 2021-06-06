# Location Types

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`.

```typescript
type Location = Path | Point | Range
```

- [Location](./location.md)
- [Path](./path.md)
- [Point](./point.md)
- [PointEntry](./pointe-entry.md)
- [Range](./range.md)
