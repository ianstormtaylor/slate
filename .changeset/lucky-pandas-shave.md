---
'slate-react': patch
---

Fix IME composition being cancelled on the first character typed into an empty leaf on Android, which left the first character behind as a separate, uncomposed character (typing 안녕 in Korean produced ㅇ안녕).
