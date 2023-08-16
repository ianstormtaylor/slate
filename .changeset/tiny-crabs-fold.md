---
'slate-react': patch
---

Fix cannot input Chinese on wxwork(wechat work)，The previous regex will filter out the wxwork(WeChat Work) useragent, causing the wxwork unable receive the IME CompositionEnd event then cannot input Chinese.


