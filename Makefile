
# Binaries.
bin = ./node_modules/.bin
babel = $(bin)/babel
browserify = $(bin)/browserify
exorcist = $(bin)/exorcist
standard = $(bin)/standard
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

# Lint the sources files with Standard JS.
lint:
	@ $(standard) ./lib

# Build the test source.
test/browser/support/build.js: $(shell find ./lib) ./test/browser.js
	@ $(browserify) \
		--debug \
		--transform babelify \
		--outfile ./test/support/build.js ./test/browser.js

# Run the tests.
test: test-browser test-server

# Run the browser-side tests.
test-browser: ./test/support/build.js
	@ $(mocha-phantomjs) \
		--reporter spec \
		--timeout 5000 \
		--fgrep "$(GREP)" \
		./test/support/browser.html

# Run the server-side tests.
test-server:
	@ $(mocha) \
		--compilers js:babel-core/register \
		--require source-map-support/register \
		--reporter spec \
		--timeout 5000 \
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
