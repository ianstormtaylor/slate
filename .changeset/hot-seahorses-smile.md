---
'slate-react': patch
---

Don't native insert inside blocks with whitespace="pre" containing tab chars to work around https://bugs.chromium.org/p/chromium/issues/detail?id=1219139
