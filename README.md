
# Blog

## Tech Stack

Node powered blog using [Static Site](https://github.com/paulcpederson/static-site). Hosted with [Surge](https://surge.sh/).

## Topics

I'll write about front-end-development, art, design, and maps.

## Frontmatter

```yaml
---
title: Title of the Post
date: 2013-11-15
description: Description of the article
template: _templates/article.html
thumbnail: thumbnail.svg
twitter_image: thumbnail.jpg
background: background.jpg
feature: feature.png
canvas: navy
spot: green
js:
  - file1
  - file2
css:
  - file1
  - file2
---
```

| Option | Definition |
| ------- | ----------------- |
| `title` | Title of the post |
| `date` | YYYY-MM-DD formatted date |
| `template` | Layout file to use `_templates/article.html` or `_templates/layout.html` |
| `description` | Description of the article. Recommended 1 sentence. |
| `background` | Image in the background of hero area. |
| `feature` | Featured image that goes in the hero area. If provided, title and date will go below hero area in main post. |
| `thumbnail` | Small image to use on homepage. |
| `twitter_image` | Twitter cards can't render svg, so export a jpg for large summary cards |
| `canvas` | Either ```navy``` or ```tan``` for background color. |
| `spot` | The spot color for the article. Choose from yellow, orange, red, magenta, violet, blue, cyan, and green. |
| `js` | List of js files needed for post (without js at end). |
| `css` | List of css files specific to post (without css at end). |

## Install

```
npm install
```

## Development

```
npm start
```

## Deploy

```
npm run deploy
```

## License

Words, content, and design are mine (©Paul C Pederson, 2015), but the tech is yours (ISC).
