
# Blog

## Tech Stack

Node powered blog using [Wintersmith](https://github.com/jnordberg/wintersmith).

## Topics

I'll write about front-end-development, art, design, and maps

## Frontmatter

```yaml
---
title: Title of the Post
date: 2013-11-15
description: Description of the article
template: map.jade
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
- **template:** Which type of post it is. Options are ```article.jade``` or ```map.jade```. Thinking about adding a ```simple.jade``` for experiments that don't need a layout.
- **description:** Description of the article. Recommended 1 sentence.
- **background:** Image in the background of hero area.
- **feature:** featured image that goes in the hero area. If provided, title and date will go below hero area in main post.
- **thumbnail:** small image to use on homepage
- **canvas:** either ```navy``` or ```tan``` for background color, and then ```mesh``` if you want a mesh.
- **spot:** The spot color for the article. Choose from yellow, orange, red, magenta, violet, blue, cyan, and green.
- **js:** List of js files needed for post (without js at end)
- **css:** List of css files specific to post (without css at end)

