---
title: Stencil ❤️ Storybook
date: 2019-10-22
template: _templates/article.html
background: css.svg
thumbnail: storybook-thumb.svg
twitter_image: storybook-thumb.webp
canvas: navy
spot: blue
description: Learn how to generate stellar documentation for all of your Stencil.js components using Storybook.
---

Recently, while working on [a new component library](https://esri.github.io/calcite-components/), it became clear that Stencil's default `readme.md` documentation strategy was not going to cut it. I needed a way for designers and devs who would be using the new set of components to see them rendered in isolation, and to get a sense of what was possible with them via props. Coincidentally, this is exactly what [Storybook](https://storybook.js.org/) aims to deliver. As I created my snazzy new docs, I learned a lot along the way, so I've written up my findings below in the hopes that it can help folks that need something similar.

## Documentation Inside Stencil

If you're not familiar with [Stencil](https://stenciljs.com/), it's a non-runtime framework for generating web components. Basically it gives developers modern tools that make developing web components feel like making React components. Things like TypeScript, TSX, and a small, but [well-defined API](https://stenciljs.com/docs/decorators) make writing components really straightforward.

Assuming you already have a Stencil project going and need to create a docs site, it will start with documenting your components inside Stencil first. A really neat feature of Stencil is that it will export generated docs for props, events, and usage graphs automatically. Inside your `stencil.config.js` just ensure you have an `outputTarget` for `docs-readme`:

```js
import { Config } from '@stencil/core';

export const config: Config = {
  outputTargets: [
    { type: 'docs-readme' }
  ]
};
```

When you run `stencil build`, this will output a `readme.md` file in each component directory. You can even write custom markdown above the `<!-- Auto Generated Below -->` indicator, and it will keep what you wrote and update the generated docs below.

Adding docs to events and props can be done using the jsdoc syntax:

```js
/** The group's name. Gets submitted with the form. */
@Prop() myProp: string = "default value";
```

This will make sure when Stencil builds the `readme`, it also adds a proper description and default value to this prop in the generated table. It's also helpful for other devs working on this component as everything is well-labeled and there are no mysteries 👻.

## Setting up Storybook

Adding storybook is fairly straight forward. Most of their demos use fancy stuff like `npx`, but you can also create text files the old-fashioned way:

1. `npm install --save-dev @storybook/html babel-loader @babel/core`
2. add a `"storybook": "start-storybook -s ./dist"` task in your `package.json` "scripts" section. The `s` flag tells storybook to also serve that folder as static files. This is how we'll load our Stencil build inside Storybook.
3. Create a `.storybook` directory and add a config with the following contents:

```js
import { configure } from '@storybook/html';
configure(require.context('../src/components', true, /\.stories\.js$/), module);
```

This is going to load any `*.stories.js` file inside your components directory and use them to build a storybook.

### Add Your Components

Now, if you wrote your stories right now, they wouldn't render, because the HTML page has no knowledge of your web components. To fix this problem, we'll add a script tag to that page.

First, run `stencil build` and ensure it's outputting to `dist` and running correctly.

Next, create a new file in the `.storybook` directory called `preview-head.html`. Inside, add the following:

```html
<!-- CSS only needed if you have global styles -->
<link rel="stylesheet" href="./myLib/myLib.css" />
<script type="module" src="./myLib/myLib.esm.js"></script>
<script nomodule="" src="./myLib/myLib.js"></script>
```

This will pull your web components into the storybook, allowing you to use them inside your stories (the whole point!).

### Writing Stories

Now that you have a basic setup of Storybook and it's aware of your component library, you can start writing some stories.

First, inside the component folder you'd like to document. For the purposes of illustration let's say my library is called `snazzy` and I have a `button` I'd like to document. I would create a file called `snazzy-button.stories.js` inside the folder `src/components/snazzy-button`.

Now inside that file, if your web component doesn't use an impertitive API and you don't need to call methods on it, I've found the easiest way to write stories is using plain old strings:

```js
import { storiesOf } from '@storybook/html';

storiesOf('Button', module)
  .add('Simple', () => `
    <snazzy-button>
      Button text
    </snazzy-button>
  `)
  .add('Large', () => `
    <snazzy-button size='large'>
      Button text
    </snazzy-button>
  `);
```

After running `npm run storybook` you should now see the Storybook docs popup with a section titled "Button" with two stories underneath "Simple" and "Large".

## Adding Notes

In order to make these docs more complete, let's add the generated `readme.md` as "notes" for the component!

First, install the addon: `npm install --save-dev @storybook/addon-notes`. Next, create a file called `addons.js` inside the `.storybook` directory and register the addon by using:

```js
import '@storybook/addon-notes/register-panel';
```

Then, in your story, pull in the readme, and pass it along as notes for the story:

```js
import { storiesOf } from '@storybook/html';
import notes from './readme.md';

storiesOf('Button', module)
  .add('Simple', () => `
    <snazzy-button>
      Button text
    </snazzy-button>
  `, { notes });
```

This should make a new tab in the panel appear called "Notes" containing the content of the readme.

## Setting Up Knobs

A great way to show what's possible with your components is with the [knobs addon](https://www.npmjs.com/package/@storybook/addon-knobs). Basically, this allows you to make your props interactive, so that devs and designers can see what prop values effect while they use the documentation.

Just like every addon, first you have to install and register it:

1. `npm install --save-dev @storybook/addon-knobs`
2. Inside `addons.js` use `import '@storybook/addon-knobs/register';`

Then in your story, let's say the options for your button's `size` prop are `"small" | "medium" | "large"`. You can build a select menu that will let the user see the sizes:

```js
import { storiesOf } from '@storybook/html';
import { withKnobs, select } from '@storybook/addon-knobs';
import notes from './readme.md';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Simple', () => `
    <snazzy-button
      size="${select("size", ["small", "medium", "large"], "small")}"
    >
      Button text
    </snazzy-button>
  `, { notes });
```

Now you should have two panels, "Notes" and "Knobs". Changing the value of the size knob should update the button to whatever you selected, sweet!

## Deploying to gh-pages

There is a lot more you can do with all the various addons and plugins. I really like the [centered](https://www.npmjs.com/package/@storybook/addon-centered) addon, as well as [backgrounds](https://www.npmjs.com/package/@storybook/addon-backgrounds) for things like a dark vs. light theme.

Once you've got your docs looking how you want them and all your stories written, you'll want to put the site online. Luckily, there is a great package for deploying a Storybook to gh-pages: [storybook-deployer](https://github.com/storybookjs/storybook-deployer).

First, install: `npm install --save-dev @storybook/storybook-deployer`. Then, you'll need to add a couple entries to your `package.json`'s scripts:

```json
{
  "scripts": {
    "prestorybook": "npm run build",
    "storybook": "start-storybook -s ./dist",
    "prebuild-storybook": "npm run build",
    "build-storybook": "build-storybook -s ./dist",
    "deploy-storybook": "storybook-to-ghpages",
    "deploy": "npm run build && npm run deploy-storybook"
  }
}
```

Basically, everytime we start up storybook, or build it, we want to run a new stencil build so we get the latest upates/docs. Then we want to make the `dist` folder available to both processes.

Assuming your latest changes are on `master` and your remotes are named correctly, you should now be able to run `npm run deploy` and see your storybook docs on gh-pages! 🎉
