
# Binaries.
bin = ./node_modules/.bin
babel = $(bin)/babel
browserify = $(bin)/browserify
standard = $(bin)/standard
mocha = $(bin)/mocha
mocha-phantomjs = $(bin)/mocha-phantomjs
node = node
watchify = $(bin)/watchify

# Flags.
DEBUG ?=

# Config.
ifeq ($(DEBUG),true)
	mocha += debug
	node += debug
endif

# Remove the generated files.
clean:
	@ rm -rf ./dist ./node_modules

# Build the source.
dist: ./node_modules $(shell find ./lib)
	@ $(babel) --out-dir ./dist ./lib
	@ touch ./dist

# Build the auto-markdown example.
example-auto-markdown: ./node_modules
	@ $(browserify) --debug --transform babelify --outfile ./examples/auto-markdown/build.js ./examples/auto-markdown/index.js

# Build the basic example.
example-basic: ./node_modules
	@ $(browserify) --debug --transform babelify --outfile ./examples/basic/build.js ./examples/basic/index.js

# Build the plain-text example.
example-plain-text: ./node_modules
	@ $(browserify) --debug --transform babelify --outfile ./examples/plain-text/build.js ./examples/plain-text/index.js

# Build the rich-text example.
example-rich-text: ./node_modules
	@ $(browserify) --debug --transform babelify --outfile ./examples/rich-text/build.js ./examples/rich-text/index.js

# Lint the sources files with Standard JS.
lint: ./node_modules
	@ $(standard) ./lib

# Install the dependencies.
node_modules: ./package.json
	@ npm install
	@ touch ./package.json

# Build the test source.
test/support/build.js: ./node_modules $(shell find ./lib) ./test/browser.js
	@ $(browserify) --debug --transform babelify --outfile ./test/support/build.js ./test/browser.js

# Run the tests.
test: test-browser test-server

# Run the browser-side tests.
test-browser: ./node_modules ./test/support/build.js
	@ $(mocha-phantomjs) --reporter spec --timeout 5000 ./test/support/browser.html

# Run the server-side tests.
test-server: ./node_modules
	@ $(mocha) --reporter spec --timeout 5000 ./test/server.js

# Watch the auto-markdown example.
watch-example-auto-markdown: ./node_modules
	@ $(MAKE) example-auto-markdown browserify=$(watchify)

# Watch the basic example.
watch-example-basic: ./node_modules
	@ $(MAKE) example-basic browserify=$(watchify)

# Watch the plain-text example.
watch-example-plain-text: ./node_modules
	@ $(MAKE) example-plain-text browserify=$(watchify)

# Watch the rich-text example.
watch-example-rich-text: ./node_modules
	@ $(MAKE) example-rich-text browserify=$(watchify)

# Phony targets.
.PHONY: examples
.PHONY: test
