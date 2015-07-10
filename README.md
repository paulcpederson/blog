
# Blog

## Tech Stack

Node powered blog using [Static Site](https://github.com/paulcpederson/static-site). Hosted on Digital Ocean with Dokku.

## Topics

I'll write about front-end-development, art, design, and maps.

## Frontmatter

```yaml
---
title: Title of the Post
date: 2013-11-15
description: Description of the article
template: _templates/article.html
thumbnail: thumbnail.jpg
background: background.jpg
feature: feature.png
canvas: navy mesh
spot: green
js:
  - file1
  - file2
css:
  - file1
  - file2
---
```

- **title:** title of the post (not the slug) that will appear in list and archive.
- **date:** YYYY-MM-DD formatted date
- **template:** Which type of post it is. Options are ```_templates/article.html``` or ```_templates/layout.html```.
- **description:** Description of the article. Recommended 1 sentence.
- **background:** Image in the background of hero area.
- **feature:** featured image that goes in the hero area. If provided, title and date will go below hero area in main post.
- **thumbnail:** small image to use on homepage
- **canvas:** either ```navy``` or ```tan``` for background color, and then ```mesh``` if you want a mesh.
- **spot:** The spot color for the article. Choose from yellow, orange, red, magenta, violet, blue, cyan, and green.
- **js:** List of js files needed for post (without js at end)
- **css:** List of css files specific to post (without css at end)

## Install

```
npm install
```

## Development

```
npm run dev
```

## Deploy

There are two droplets that can be pushed to. I've named them dokku (production) and dev (development). To deploy to dev, use:

```
npm run deploy
```

To deploy to production, just pass in the production branch name:

```
npm run deploy -- dokku
```

## License

Words, content, and design are mine (©Paul C Pederson, 2015), but the tech is yours (ISC).
