
# Binaries.
bin = ./node_modules/.bin
babel = $(bin)/babel
browserify = $(bin)/browserify
discify = $(bin)/discify
exorcist = $(bin)/exorcist
eslint = $(bin)/eslint
http-server = $(bin)/http-server
gh-pages = $(bin)/gh-pages
mocha = $(bin)/mocha
node = node
watchify = $(bin)/watchify

# Options.
babel_flags =
browserify_flags = --debug --transform babelify
eslint_flags = --ignore-pattern "build.js"
mocha_flags = --compilers js:babel-core/register --require source-map-support/register --reporter spec

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
	@ rm -rf ./dist ./node_modules

# Check the size of the dependencies.
disc: dist
	@ mkdir -p ./tmp
	@ $(browserify) ./dist/index.js --full-paths --outfile ./tmp/build.js
	@ $(discify) ./tmp/build.js --open

# Build the source.
dist: $(shell find ./lib) package.json
	@ $(babel) $(babel_flags) --out-dir ./dist ./lib
	@ $(browserify) ./dist/index.js --standalone Slate --outfile ./dist/slate.js

# Build the examples.
examples:
	@ $(browserify) $(browserify_flags) ./examples/index.js --outfile ./examples/build.js

# Deploy the latest examples to GitHub pages.
gh-pages:
	@ $(gh-pages) --dist ./examples

# Install the dependencies.
install:
	@ npm install

# Lint the source files.
lint:
	@ $(eslint) $(eslint_flags) "lib/**/*.js" "examples/**/*.js"

# Start the server.
start:
	@ $(http-server) ./examples

# Run the tests.
test:
	@ $(mocha) $(mocha_flags) --fgrep "$(GREP)" ./test/server.js

# Watch the source.
watch-dist:
	@ $(MAKE) dist babel_flags="$(babel_flags) --watch"

# Watch the examples.
watch-examples:
	@ $(MAKE) examples browserify=$(watchify)

# Phony targets.
.PHONY: examples
.PHONY: test
