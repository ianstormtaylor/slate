# Location Types

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`.

```typescript
type Location = Path | Point | Range
```

- [Location](/api/locations/location.md)
- [Path](/api/locations/path.md)
- [Point](/api/locations/point.md)
- [Range](/api/locations/range.md)
