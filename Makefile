
# Binaries.
bin = ./node_modules/.bin
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
	@ rm -rf ./node_modules

# Build the examples.
examples: ./node_modules
	@ $(browserify) --debug --transform babelify --outfile ./examples/basic/build.js ./examples/basic/index.js

# Lint the sources files with Standard JS.
lint: ./node_modules
	@ $(standard) ./lib

# Install the dependencies.
node_modules: ./package.json
	@ npm install
	@ touch ./package.json

# Build the test source.
test/support/build.js: ./node_modules $(shell find ./lib) ./test/browser.js
	@ $(browserify) --transform babelify --outfile ./test/support/build.js ./test/browser.js

# Run the tests.
test: test-browser test-server

# Run the browser-side tests.
test-browser: ./node_modules ./test/support/build.js
	@ $(mocha-phantomjs) --reporter spec --timeout 5000 ./test/support/browser.html

# Run the server-side tests.
test-server: ./node_modules
	@ $(mocha) --reporter spec --timeout 5000 ./test/server.js

# Watch the examples.
watch-examples: ./node_modules
	@ $(MAKE) examples browserify=$(watchify)

# Phony targets.
.PHONY: examples
.PHONY: test
