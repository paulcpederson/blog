---
title: Stencil Icons
date: 2020-05-05
template: _templates/article.html
background: css.svg
thumbnail: storybook-thumb.svg
twitter_image: storybook-thumb.jpg
canvas: navy
spot: green
description: Implementing SVG icons for a design system with a Stencil.js Web Component
---

In the last ten years, developers have been on a quest to find the best way to implement icons in a digital product. We've wandered through low fidelity gifs, elaborately Photoshopped png sprites, icon fonts (remember those?), SVG sprites, and finally inline SVGs. Recently I've been helping out with the DX for my company's the extensive icon library. The solution we've come to

## What's the problem with inline SVG?

A while back it became clear that icon fonts and svg sprites were less than ideal. At the time of writing the icon system I'm working with has 1,512 different glyphs available as part of the icon set. This is a ludicrous amount of data to try to load in one file. For that reason, most teams moved to an inline-icon approach. Basically, you simply add markup to your html file and an SVG appears:

```html
<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path d="M6 12.892v1.011c-2.564-.248-4.8-.99-4.8-2.303 0-1.649 3.525-2.4 6.8-2.4s6.8.751 6.8 2.4c0 1.313-2.236 2.055-4.8 2.303V16l-1.2-1L7 13.5 8.8 12l1.2-1v1.892c2.498-.26 3.8-.955 3.8-1.292 0-.418-1.974-1.4-5.8-1.4s-5.8.982-5.8 1.4c0 .337 1.302 1.031 3.8 1.292zM16 9a27.203 27.203 0 0 0-8-1 27.239 27.239 0 0 0-8 1V0a27.239 27.239 0 0 0 8 1 27.203 27.203 0 0 0 8-1zM1 7.677c.406-.095.824-.173 1.245-.244L4.3 5.24a.27.27 0 0 1 .4 0 .27.27 0 0 0 .4 0l2.017-2.152a.27.27 0 0 1 .381-.018l2.03 1.804a.269.269 0 0 0 .35.01l1.226-.824a.27.27 0 0 1 .37.028L15 7.488V1.324a25.579 25.579 0 0 1-3.739.55.983.983 0 0 1 .239.627 1 1 0 0 1-2 0 .973.973 0 0 1 .176-.534C9.046 1.99 8.47 2 8 2a32.844 32.844 0 0 1-7-.677zM8 7a37.148 37.148 0 0 1 5.449.383l-2.257-2.178-.689.46a1.268 1.268 0 0 1-1.64-.043l-1.5-1.334L5.83 5.924a1.28 1.28 0 0 1-.93.405 1.244 1.244 0 0 1-.23-.022l-.85.906A39.883 39.883 0 0 1 8 7z"/>
</svg>
```

There's a [great 2016 blog post](https://github.blog/2016-02-22-delivering-octicons-with-svg/) by GitHub outlining why you would go that route. In the post, they give a peek at the Rails helper they use:

```
<%= octicon(:symbol => "plus") %>
```

This is great! The client doesn't need to load any icons and the developer doesn't need to remember the icon markup or path data. However, for my use case, there are a few downsides with this approach. Namely, when you work with dozens of teams using every tech stack imaginable, there is no one "Rails helper" for folks to use. You would have to make: an Angular directive, an Ember component, a React Component, a Rails helper, etc. The front-end technologies would need to be very careful that the full weight of all the icons didn't end up in their bundle, otherwise you'd have a megabyte of icons you weren't using. Because of all these challenges, many teams were coming up with their own ad hoc implementations and "making it work" for their framework of choice.

But wouldn't it be better if everybody could use the same helper with any framework and have it just work?

## Enter Stencil.js

Stencil is a "framework" for building web components. It doesn't have a runtime, _per se_, but rather includes some polyfills and a loader which intelligently loads your generated web components on-demand at runtime. Essentially it makes building web components feel more like using a modern framework like React.

We were using Stencil for our new design system, and many of the the components needed... icons! Another dev prototyped an icon component. It didn't work in IE11, but it did enable any project, regardless of their technology to render icons with a custom html tag. I managed to shuffle some things around and got it working for all browsers, and we've now been using this approach quite happily for sometime!

Below I'll go over how this home-rolled solution worked for us in the hopes it may be helpful to other folks. _**Note**: the code below is a simplified version of what we use and is mostly pseudo-code, but it should give you an idea of how the basic approach works. If you do try this, let me know if I have misspellings or bugs and I can try to correct them._

## Getting the icon data

The first step in this process is getting the actual path data for all the icons in your icon library. For most single-color icon sets, the path with be a single string (`"M6 12.892v1.011c-2.564-..."`). If your icons are uniform in construction, you don't need to store the width or viewbox data. Literally all you need is a string with the paths. In order to have this be accessible via the client, I've elected to save these paths as JSON. Earlier versions we used actual js imports, but this wasn't viable in older browsers. JSON works well, though, and is very lightweight as no extraneous data or syntax needs to be stored in the file.

Below is a simplified version of our node script (we have more complexity like multiple sizes, name standarization, variant icons, etc):

```js
#!/usr/bin/env node

const fs = require('fs-extra');
const glob = require('glob-promise');
const path = require('path');
const util = require('util');
const svgson = util.promisify(require('svgson'));

// first, get a list of all of your icons in the folder
glob('icons/*.svg')
  // next, read their files, using svgson to parse
  .then(filePaths => Promise.all(filePaths.map((fileName) => {
    return new Promise(function(resolve) {
      fs.readFile(fileName, 'utf-8').then((svg) => {
        svgson(svg, {}, (contents) => {
          resolve({file: fileName, contents});
        });
      });
    });
  })))
  // write a JSON file inside your component's asset folder for each icon
  .then(files => {
    files.forEach((svg) => {
      let file = path.basename(svg.file);
      let paths = svg.childs
        .filter(child => child.name === 'path')
        .map(child => (child.attrs.d));
      // Make sure this folder exists!
      let filename = `src/components/library-name-icon/assets/${file}.json`;
      fs.writeFileSync(filname, JSON.stringify(paths[0].d), 'utf8');
    });
    process.exit(0);
  });
```

Now after you install the devDependencies needed in the above file, and run this JS as a node script, it will go find all your icons and create a JSON file for each one! You could run this manually, or before start/build with [npm scripts](../npm-run/).

## Writing an icon component

Now that we have the icon data, we need to create a web component that will render that data. The important part here, is that we only want to make the request for an icon once. If we render 500 icons but they are all an edit pencil, only one request should be sent to `pencil.json`. We'll do this by creating a request utility and sharing it between all of our web component instances. In your stencil components folder you should have:

```
library-name-icon/
  assets/
  utils.ts
  library-name-icon.tsx
```

Inside the utils file, you'll add your request utility:

```ts
import { getAssetPath } from "@stencil/core";

const iconCache = {};
const requestCache = {};

export async function fetchIcon({
  icon
}): Promise<string> {
  if (iconCache[icon]) {
    return iconCache[icon];
  }
  if (!requestCache[icon]) {
    requestCache[icon] = fetch(getAssetPath(`./assets/${icon}.json`))
      .then(resp => resp.json())
      .catch(() => {
        console.error(`"${icon}" is not a valid name`);
        return "";
      });
  }

  const path = await requestCache[icon];
  iconCache[icon] = path;

  return path;
}
```

As you can see, first this checks the cache object to see if we already have the data, then it checks the request cache, to see if we already have a request in flight. If not, we request the json file, logging an error if it fails (the icon you requested isn't in the set).

Next, we need to write a component! Inside your tsx file, use something like this:

```
import { Build, Component, Element, h, Host, Prop, State, Watch } from "@stencil/core";
import { fetchIcon } from "./utils";

@Component({
  assetsDirs: ["assets"],
  tag: "library-name-icon",
  styleUrl: "library-name-icon.scss",
  shadow: true,
})
export class LibraryNameIcon {
  @Element() el: HTMLElement;
  @Prop() icon: string = null;
  @State() private pathData: string;
  @State() private visible = false;
  private intersectionObserver: IntersectionObserver;

  connectedCallback(): void {
    this.waitUntilVisible(() => {
      this.visible = true;
      this.loadIconPathData();
    });
  }

  disconnectedCallback(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  async componentWillLoad(): Promise<void> {
    this.loadIconPathData();
  }

  render() {
    const size = 16;
    return (
      <Host>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          height={size}
          width={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <path d={this.pathData || ""} />
        </svg>
      </Host>
    );
  }

  @Watch("icon") private async loadIconPathData(): Promise<void> {
    const { icon, visible } = this;

    if (!Build.isBrowser || !icon || !visible) {
      return;
    }

    this.pathData = await fetchIcon({ icon });
  }

  private waitUntilVisible(callback: () => void): void {
    if (
      !Build.isBrowser ||
      typeof window === "undefined" ||
      !(window as any).IntersectionObserver
    ) {
      callback();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
            callback();
          }
        });
      },
      { rootMargin: "50px" }
    );

    this.intersectionObserver.observe(this.el);
  }
}
```

Ok, there is a lot going on here, but it's actually not that complicated, I swear. Basically, you watch the icon property and when it changes, you get the path data. The main complication is the `IntersectionObserver`. Essentially we set up an intersection observer that checks if the icon is visibile prior to requesting it. This enables us to lazy-load icons on very large scrolling sections.

Now, once you have this (and you've [loaded your web components via script tags](https://stenciljs.com/docs/javascript)) you can use the component like so:

```html
<my-library-icon icon="edit" />
```

Assuming you have an edit icon, it should make a request and render it! 🎉 Obviously you'll need to configure all your paths, and write some css, but this is the basic approach.

## Future plans

I think this could be slightly improved by leveraging [Stencil's ServiceWorker](https://stenciljs.com/docs/service-workers). If that can be done, it would mean that any subsequent visits, an icon request wouldn't need to be sent at all, rather the worker would intercept the request and resolve the icon for you. You get free, cached icons, which is sort of the dream!

As always, you can send me a tweet if none of this makes any sense [@paulcpederson](https://twitter.com/paulcpederson). Hope this helps you on your icon journey!
