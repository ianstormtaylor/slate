# Location

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`.

```typescript
type Location = Path | Point | Range
```

- [Path](./api/path.md)
- [Point](./api/point.md)
- [Range](./api/range.md)

## Static methods

###### `Location.isLocation(value: any): value is Location`

Check if a value implements the `Location` interface.
