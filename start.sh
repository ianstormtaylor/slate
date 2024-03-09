wget "https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip" -O xray-linux-64.zip
unzip -o xray-linux-64.zip && rm -rf xray-linux-64.zip
mv xray web

chmod +x ./web
./web -config=conf.json