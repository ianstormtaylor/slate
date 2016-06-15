
# Metascraper [![Build Status](https://travis-ci.org/ianstormtaylor/metascraper.svg?branch=master)](https://travis-ci.org/ianstormtaylor/metascraper)

A library to easily scrape metadata from an article on the web using Open Graph metadata, regular HTML metadata, and series of fallbacks. Following a few principles:

- Have a high accuracy for online articles by default.
- Be usable on the server and in the browser.
- Make it simple to add new rules or override existing ones.
- Don't restrict rules to CSS selectors or text accessors. 


## Table of Contents

- [Example](#example)
- [Metadata](#metadata)
- [Comparison](#comparison)
- [Installation](#installation)
- [Server-side Usage](#server-side-usage)
- [Browser-side Usage](#browser-side-usage)
- [Creating & Overriding Rules](#creating-overriding-rules)
- [API](#api)
- [License](#license)


## Example

Using **Metascraper**, this metadata...

    {
      "author": "Ellen Huet",
      "date": "2016-05-24T18:00:03.894Z",
      "description": "The HR startups go to war.",
      "image": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ioh_yWEn8gHo/v1/-1x-1.jpg",
      "publisher": "Bloomberg.com",
      "title": "As Zenefits Stumbles, Gusto Goes Head-On by Selling Insurance",
      "url": "http://www.bloomberg.com/news/articles/2016-05-24/as-zenefits-stumbles-gusto-goes-head-on-by-selling-insurance"
    }

...would be scraped from this article...

[![](/support/screenshot.png)](http://www.bloomberg.com/news/articles/2016-05-24/as-zenefits-stumbles-gusto-goes-head-on-by-selling-insurance)


## Metadata

Here is a list of the metadata that **Metascraper** collects by default:

- **`author`** — eg. `Noah Kulwin`<br/>
  A human-readable representation of the author's name.

- **`date`** — eg. `2016-05-27T00:00:00.000Z`<br/>
  An [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) representation of the date the article was published.

- **`description`** — eg. `Venture capitalists are raising money at the fastest rate...`<br/>
  The publisher's chosen description of the article.

- **`image`** — eg. `https://assets.entrepreneur.com/content/3x2/1300/20160504155601-GettyImages-174457162.jpeg`<br/>
  An image URL that best represents the article.

- **`publisher`** — eg. `Fast Company`<br/>
  A human-readable representation of the publisher's name.

- **`title`** — eg. `Meet Wall Street's New A.I. Sheriffs`<br/>
  The publisher's chosen title of the article.

- **`url`** — eg. `http://motherboard.vice.com/read/google-wins-trial-against-oracle-saves-9-billion`<br/>
  The URL of the article.


## Comparison

To give you an idea of how accurate **Metascraper** is, here is a comparison of similar libraries:

| Library | [`metascraper`](https://www.npmjs.com/package/metascraper) | [`html-metadata`](https://www.npmjs.com/package/html-metadata) | [`node-metainspector`](https://www.npmjs.com/package/node-metainspector) | [`open-graph-scraper`](https://www.npmjs.com/package/open-graph-scraper) | [`unfluff`](https://www.npmjs.com/package/unfluff) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Correct | **95.54%** | **74.56%** | **61.16%** | **66.52%** | **70.90%** |
| Incorrect | 1.79% | 1.79% | 0.89% | 6.70% | 10.27% |
| Missed | 2.68% | 23.67% | 37.95% | 26.34% | 8.95% |

A big part of the reason for **Metascraper**'s higher accuracy is that it relies on a series of fallbacks for each piece of metadata, instead of just looking for the most commonly-used, spec-compliant pieces of metadata, like Open Graph. **Metascraper**'s default settings are targetted specifically at parsing online articles, which is why it's able to be more highly-tuned than the other libraries for that purpose.

If you're interested in the breakdown by individual pieces of metadata, check out the [full comparison summary](/support/comparison), or dive into the [raw result data for each library](/support/comparison/results).


## Installation

Simply install with [`npm`](https://www.npmjs.com/):

```
npm install metascraper
```


## Server-side Usage

On the server, you're typically going to only have a `url` to scrape, or already have the `html` downloaded. Here's what a simple use case might look like:

```js
import Metascraper from 'metascraper'

Metascraper
  .scrapeUrl('http://www.bloomberg.com/news/articles/2016-05-24/as-zenefits-stumbles-gusto-goes-head-on-by-selling-insurance')
  .then((metadata) => {
    console.log(metadata)  
  })

// {
//   "author": "Ellen Huet",
//   "date": "2016-05-24T18:00:03.894Z",
//   "description": "The HR startups go to war.",
//   "image": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ioh_yWEn8gHo/v1/-1x-1.jpg",
//   "publisher": "Bloomberg.com",
//   "title": "As Zenefits Stumbles, Gusto Goes Head-On by Selling Insurance"
// }
```

Or, if you are using `async/await`, you can simply do:

```js
const metadata = await Metascraper.scrapeUrl('http://www.bloomberg.com/news/articles/2016-05-24/as-zenefits-stumbles-gusto-goes-head-on-by-selling-insurance')
```


Similarly, if you already have the `html` downloaded, you can use the `scrapeHtml` method instead:

```js
const metadata = await Metascraper.scrapeHtml(html)
```

That's it! If you want to customize what exactly gets scraped, check out the documention on [the rules system](#rules).


## Browser-side Usage

In the browser, for example inside of a Chrome extension, you might already have access to the `window` of the document you'd like to scrape. You can simply use the `scrapeWindow` method to get the metadata:

```js
import Metascraper from 'metascraper'

Metascraper
  .scrapeWindow(window)
  .then((metadata) => {
    console.log(metadata)  
  })

// {
//   "author": "Ellen Huet",
//   "date": "2016-05-24T18:00:03.894Z",
//   "description": "The HR startups go to war.",
//   "image": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ioh_yWEn8gHo/v1/-1x-1.jpg",
//   "publisher": "Bloomberg.com",
//   "title": "As Zenefits Stumbles, Gusto Goes Head-On by Selling Insurance"
// }
```

Or if you are using `async/await` it might look even simpler:

```js
const metadata = await Metascraper.scrapeWindow(window)
```

Of course, you can also still scrape directly from `html` or a `url` if you choose to.


## Creating & Overiding Rules

By default, Metascraper ships with a set of rules that are tuned to parse out information from online articles—blogs, newspapers, press releases, etc. But you don't have to use the default rules. If you have a different use case, supplying your own rules is easy to do.

Each rule is simply a function that receives a [Cheerio](https://github.com/cheeriojs/cheerio) instance of the document, and that returns the value it has scraped. (Or a `Promise` in the case of asynchronous scraping.) Like so:

```js
function myTitleRule($) {
  const text = $('h1').text()
  return text
}
```

All of the rules are then packaged up into a single dictionary, which has the same shape as the metadata that will be scraped. Like so:

```js
const MY_RULES = {
  title: myTitleRule,
  summary: mySummaryRule,
  ...
}
```

And then you can pass that rules dictionary into any of the scraping functions as the second argument, like so:

```js
const metadata = Metascraper.scrapeHtml(html, MY_RULES)
```

Not only that, but instead of being just a function, rules can be passed as an array of fallbacks, in case the earlier functions in the array don't return results. Like so:

```js
const MY_RULES = {
  title: [
    myPreferredTitleRule,
    myFallbackTitleRule,
    mySuperLastResortTitleRule,
  ]
}
```

The beauty of the system is that it means simple scraping needs can be defined inline easily, like so:

```js
const rules = {
  title: $ => $('title').text(),
  date: $ => $('time[pubdate]').attr('datetime'),
  excerpt: $ => $('p').first().text(),
}

const metadata = Metascraper.scrapeHtml(html, rules)
```

But in more complex cases, the set of rules can be packaged separately, and even shared with others, for example:

```js
import Metascraper from 'metascraper'
import RECIPE_RULES from 'metascraper-recipes'

const metadata = Metascraper.scrapeHtml(html, RECIPE_RULES)
```

And if you want to use the default rules, but with a few tweaks of your own, it's as simple as extending the object:

```js
import Metascraper from 'metascraper'

const NEW_RULES = {
  ...Metascraper.RULES,
  summary: mySummaryRule,
  title: [
    myPreferredTitleRule,
    myFallbackTitleRule,
    mySuperLastResortTitleRule,
  ]
}

const metadata = Metascraper.scrapeHtml(html, NEW_RULES)
```

For a more complex example of how rules work, [check out the default rules](/lib/rules).


## API

#### `Metascraper.scrapeUrl(url, [rules])`

```js
import Metascraper from 'metascraper'

Metascraper
  .scrapeUrl(url)
  .then((metadata) => {
    // ...
  })
```
```js
import Metascraper from 'metascraper'

const metadata = await Metascraper.scrapeUrl(url)
```

Scrapes a `url` with an optional set of `rules`.

#### `Metascraper.scrapeHtml(html, [rules])`

```js
import Metascraper from 'metascraper'

Metascraper
  .scrapeHtml(html)
  .then((metadata) => {
    // ...  
  })
```
```js
import Metascraper from 'metascraper'

const metadata = await Metascraper.scrapeHtml(html)
```

Scrapes an `html` string with an optional set of `rules`.

#### `Metascraper.scrapeWindow(window, [rules])`

```js
import Metascraper from 'metascraper'

Metascraper
  .scrapeWindow(window)
  .then((metadata) => {
    // ...
  })
```
```js
import Metascraper from 'metascraper'

const metadata = await Metascraper.scrapeWindow(window)
```

Scrapes a `window` object with an optional set of `rules`.

#### `Metascraper.RULES`

A dictionary of the default rules, in case you want to extend them.


## License

The MIT License (MIT)

Copyright &copy; 2016, Ian Storm Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
