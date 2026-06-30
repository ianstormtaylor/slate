---
'slate': patch
---

Treat Indic conjunct clusters as a single grapheme in `getCharacterDistance`, implementing Unicode UAX #29 rule GB9c. Character-by-character cursor movement (`Editor.positions` with `unit: 'character'`, and the `Editor.before` / `Editor.after` it powers) over scripts such as Devanagari and Bengali no longer stops inside a `Consonant + virama + Consonant` conjunct.
