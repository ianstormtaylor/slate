#!/bin/sh
set -e
SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
TOOLS="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
PLATFORM="$SDK/platforms/$(ls "$SDK/platforms" | sort -V | tail -1)/android.jar"
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$HERE/.build}"
rm -rf "$OUT" && mkdir -p "$OUT/classes" "$OUT/res"
"$TOOLS/aapt2" compile --dir "$HERE/res" -o "$OUT/res.zip"
"$TOOLS/aapt2" link -I "$PLATFORM" --manifest "$HERE/AndroidManifest.xml" -o "$OUT/unsigned.apk" "$OUT/res.zip"
javac -source 11 -target 11 -nowarn -classpath "$PLATFORM" -d "$OUT/classes" $(find "$HERE/src" -name '*.java')
"$TOOLS/d8" --lib "$PLATFORM" --min-api 26 --output "$OUT" $(find "$OUT/classes" -name '*.class')
(cd "$OUT" && zip -q unsigned.apk classes.dex)
"$TOOLS/zipalign" -f 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
KEYSTORE="$OUT/debug.keystore"
keytool -genkeypair -keystore "$KEYSTORE" -storepass android -keypass android -alias slate -keyalg RSA -validity 10000 -dname "CN=Slate Test" >/dev/null 2>&1
"$TOOLS/apksigner" sign --ks "$KEYSTORE" --ks-pass pass:android --out "$OUT/slate-test-ime.apk" "$OUT/aligned.apk"
echo "$OUT/slate-test-ime.apk"
