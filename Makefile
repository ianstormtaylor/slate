
# Binaries.
bin = ./node_modules/.bin
babel = $(bin)/babel
browserify = $(bin)/browserify
exorcist = $(bin)/exorcist
eslint = $(bin)/eslint
http-server = $(bin)/http-server
mocha = $(bin)/mocha
mocha-phantomjs = $(bin)/mocha-phantomjs
node = node
watchify = $(bin)/watchify

# Flags.
DEBUG ?=
GREP ?=

# Config.
ifeq ($(DEBUG),true)
	mocha += debug
	node += debug
endif

# Run all of the checks.
check: lint test

# Remove the generated files.
clean:
	@ rm -rf ./dist

# Build the source.
dist:  $(shell find ./lib) package.json
	@ $(babel) \
		--out-dir \
		./dist \
		./lib
	@ touch ./dist

# Build the examples.
examples:
	@ $(browserify) \
		./examples/index.js \
		--debug \
		--transform babelify \
		| $(exorcist) ./examples/build.js.map > ./examples/build.js

# Install the dependencies.
install:
	@ npm install

# Lint the source files.
lint:
	@ $(eslint) \
		"lib/**/*.js" \
		"examples/**/*.js" --ignore-pattern "build.js"

# Start the examples server.
start-examples:
	@ $(http-server) ./examples

# Build the test source.
test/support/build.js: $(shell find ./lib) ./test/browser.js
	@ $(browserify) \
		./test/browser.js \
		--debug \
		--transform babelify \
		--outfile ./test/support/build.js

# Run the tests.
test: test-browser test-server

# Run the browser-side tests.
test-browser: ./test/support/build.js
	@ $(mocha-phantomjs) \
		--reporter spec \
		./test/support/browser.html

# Run the server-side tests.
test-server:
	@ $(mocha) \
		--compilers js:babel-core/register \
		--require source-map-support/register \
		--reporter spec \
		--fgrep "$(GREP)" \
		./test/server.js

# Watch the examples.
watch-examples:
	@ $(watchify) \
		./examples/index.js \
		--debug \
		--transform babelify \
		--outfile "$(exorcist) ./examples/build.js.map > ./examples/build.js"

# Phony targets.
.PHONY: examples
.PHONY: test
