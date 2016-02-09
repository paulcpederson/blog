---
title: Using NPM as a Task Runner
date: 2015-4-8
template: _templates/article.html
background: npm-run.svg
thumbnail: npm-run-thumb.jpg
feature: npm-run-feature.png
canvas: tan mesh
spot: red
description: "Use npm to automate front-end development tasks such as image optimization, Sass compilation, and running a local server."
featured: true
---

It's [no secret](../automatic-github-releases) that I like Grunt. As somebody who was running tasks like minification, image compression, and css preprocessing by hand, Grunt was a breath of fresh air. But like any technology, there was a learning curve. I had to find the right grunt plugins, learn how to configure and run everything, and also update my tasks as Grunt made breaking changes between versions.

After several months of drinking the Grunt KoolAid while scrolling up and down in a monolithic four hundred line `Gruntfile.js` I suddenly realized how insane this had all become. There was a lot of boilerplate for something that is really not that complicated. Around that time I read [this article](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/), which really interested me. Wanting to learn more, I found [a similar article by substack](http://substack.net/task_automation_with_npm_run). I remained hesitant, but thought I'd give it a try as an experiment on my next personal project.

About two months later I am still using npm to manage development tasks and I don't think I'll go back to grunt, gulp, or whatever broccoli is. There is something really refreshing and eloquent about using a simple list of commands in a JSON file. I now feel like I've gotten to the same comfort level using npm scripts as I had with Grunt, but now everything fits on one screen. Below I'll give a brief intro into how NPM runs commands, after which I'll dive into my current approach for various common tasks that front-end web development requires.

## How NPM Runs Scripts

NPM uses a file called `package.json` to do pretty much everything. If you were using Grunt or Gulp, chances are you are already familiar with this file. Along with `dependencies`, `devDependencies`, and things like `repository`, `version`, and `name` keys, `package.json` also includes a key called `scripts`. This is a simple list of scripts you can run with npm. The name of the script goes on the left and the corresponding command goes on the right. Scripts that are generally used everywhere in Node-Land are `start` and `test`, but you can add any number of scripts for your project.

To run a script, just add a command to `scripts` like this:

```js
"scripts": {
  "my-script": "ls -l"
}
```

Then you can run it with:

```bash
npm run-script my-script
```

Or, in the interest of typing fewer characters, you can just use:

```bash
npm run my-script
```

This will not only run `my-script` but it will also run the `pre` and `post` scripts for that entry if you defined them. So if you had:

```js
"scripts": {
  "premy-script": "echo 'about to list files'",
  "my-script": "ls -l",
  "postmy-script": "echo 'omg did you see that'"
}
```

You will get the first message printed, then the list of files, and then the last message.

The last thing to mention about npm scripts is that they have access to everything in `node_modules/.bin/`. Essentially, module authors can register command line tools with npm by adding a `bin` key to `package.json`. That enables people to install the module globally and then use that tool from the command line.

For example, [imagemin](https://github.com/imagemin/imagemin#cli) has a cli which you can use to minify images from the command line if you install imagemin globally (specified [here](https://github.com/imagemin/imagemin/blob/master/package.json#L16)). If you use imagemin via an npm script *you don't have to install anything globally*. NPM automatically adds their bin to `node_modules/.bin` and makes it available to the command from your script!

> You don't have to install anything globally.

This is amazing because now people that contribute to your project can get everything they need with a simple `npm install`. That lowers the barrier of entry to contributing to your project, and also lets you tightly control what version of imagemin your project uses if you want to.

## Front End Tasks

Now that we know the basics of how this might work, I'll dive into some common tasks for front-end development. Some of these things were a challenge to set up the first time, and some I had to write myself, but hopefully this can shorten the learning curve for those of you just starting to use npm or inspire you to try it if you're just curious.

### JavaScript

It is pretty common now to include a compile or build step for processing JavaScript. At the very least, you should probably be minifying your files so they are smaller.

Personally, I've fallen in love with [browserify](http://browserify.org/) which basically allows you to write JavaScript in the "node-style" and then compile it so it works in browsers. Why this is so awesome is the subject of another post, but creating some tooling for it is very easy. Just `npm install --save-dev browserify` and add a script to your `package.json` file:

```js
"scripts": {
  "js": "browserify -e index.js -d -o bundle.js"
}
```

This will start at `index.js` and compile a bundle of browser-ready JavaScript that you can load from your html file. Now from the command line you can use `npm run js` to create your bundle.

##### Notes

1. If your `--output` file is in a directory that isn't there, it will throw an error. To fix this, you can just add a `prejs` script that creates it: `"prejs": "mkdir -p build/"`.
2. There are a [lot of transforms](https://www.npmjs.com/browse/keyword/browserify-transform) for Browserify. If you start using more than one, you can use the [`browserify` object](https://github.com/substack/node-browserify#packagejson) in your `package.json` to keep things cleaner.
3. If you want to minify your JS (and you should!) you can also pipe the output of browserify through [uglify](https://www.npmjs.com/package/uglify-js) like this: `browserify index.js | uglifyjs > bundle.min.js`. (Make sure you `npm install --save-dev uglify-js` first!)

### CSS

As far as CSS preprocessors go, I'm a fan of Sass. Up until recently it's been sort of a pain to install because it relied on Ruby. But thanks to [LibSass](https://github.com/sass/libsass) and consequently [node-sass](https://github.com/sass/node-sass) it is now *very* easy (and crazy fast) to use Sass in a project with Node.js. The best part of using node-sass is that contributors to your project won't need Ruby or Sass installed locally. NPM will automatically install everything it needs on `npm install`.

Using the [node-sass cli](https://github.com/sass/node-sass#command-line-interface) actually proved to be a bit difficult because it didn't provide a way to compile multiple Sass files. I often have a main CSS file that provides the base styles for everything, and then I'll break out page-specific styles into their own file so that the main file can be cached but doesn't include the whole kitchen sink.

So what's a boy to do when an open source tool is missing a feature? Why, [open a pull request](https://github.com/sass/node-sass/pull/838), of course! Once that got merged, adding a Sass task for all your files is really easy. Just `npm install --save-dev node-sass`. Then add a script to `package.json`:


```js
"scripts": {
  "sass": "node-sass sass/ -o build/css/"
}
```

This will compile all of the sass files (that don't start with an underscore) to the `build/css/` directory.

### Images

This was one of the harder tasks to figure out for me. I tried a lot of solutions, but in the end I found that [imagemin](https://github.com/imagemin/imagemin) was the easiest to use. Again, though, there was a small hiccup: running imagemin on a folder would optimize all the images in that folder regardless of if you had already optimized them or not.

To solve this problem, I threw together a quick little module that checks if each image is newer. I named the module, wait for it, [imagemin-newer](https://github.com/paulcpederson/imagemin-newer). Now, you can just `npm install --save-dev imagemin-newer` and then add the following:

```js
"scripts": {
  "img": "imagemin-newer img/ build/img"
}
```

This will optimize and compress any image (gif, png, svg, jpg) that was added or has changed inside the `img/` folder and save the compressed version in `build/img/`.

### Watching

> "Great", I hear you saying, "but what about running a script automatically when files change?"

First of all *extremely interesting question*. I accomplish this with a module called [rerun-script](https://www.npmjs.com/package/rerun-script). Basically it allows you to *rerun a script* (straight-forward names are the best) whenever files matching a certain pattern change.  The patterns are stored in a `watches` key in your `package.json`. So after you `npm install --save-dev rerun-script` you can add the following to your `package.json`:

```js
"watches": {
  "js": "js/**",
  "sass": "sass/**",
  "img": "img/**"
},
"scripts": {
  "js": "browserify -e js/index.js -d -o build/bundle.js",
  "sass": "node-sass sass/ -o build/css/",
  "img": "imagemin-newer img/ build/img",
  "dev": "rerun-script"
}
```

Now you can `npm run dev` and it will watch each of these folders and run the corresponding task when things change.

### Running a Preview Server

To run a preview server I've been using [live-server](https://www.npmjs.com/package/live-server). Once you experience automatic CSS reloads without a page refresh it's sort of hard to go back...

After you `npm install --save-dev live-server`, you can just create a script to run a server:

```js
"scripts": {
  "preview": "live-server"
}
```

Now if you use `npm run preview` you'll have a server running on `localhost:8080` that will automatically open and then reload whenever anything changes.

### Tying It All Together

It's pretty common to have a couple more tasks like building a static site, running a test suite for your JavaScript, uploading assets to s3, or even deploying your site. But at this point it should be pretty obvious how to go about adding those things.

Here's what a working set of scripts might look like in a real project:

```js
 "scripts": {
    "js": "browserify -e js/index.js -d -o build/js/bundle.js",
    "sass": "node-sass sass/ -q -o build/css/",
    "img": "imagemin-newer img/ build/img/",
    "predev": "mkdir -p build && npm-run-all js sass img --parallel",
    "dev": "parallelshell 'cd build/ && live-server' 'rerun-script'"
  },
  "watches": {
    "js": "js/**",
    "sass": "sass/**",
    "img": "img/**"
  },
```

The above creates a JavaScript bundle and exports that to the build folder. It also compiles sass and optimized images, placing both of the end results in the build folder.

Before the `dev` task is run, there is a `predev` task which will make sure there is a build folder, then run all three of our other tasks in parallel once at the beginning using [npm-run-all](https://www.npmjs.com/package/npm-run-all).

Then, it uses [parallelshell](https://github.com/keithamus/parallelshell) to go into the build folder, start up a preview server, and kick off the file watcher. `npm run dev` is all you need now to spin everything up and get started.

Hopefully that was helpful. I know this type of article has been written before, but I feel like most of them don't really go into the things you actually need to know to get going. As always, if anything is just super wrong, tweet angrily at me: [@paulcpederson](https://twitter.com/paulcpederson).
