---
title: Automating GitHub Releases with Grunt
date: 2015-1-2
template: article.jade
background: grunt-release.jpg
thumbnail: grunt-release-thumb.jpg
canvas: navy mesh
spot: green
description: "Create a new GitHub release with a zipped folder, custom release message, and user credentials all in a single Grunt command."
---

> Edit: I now use [gh-release](https://github.com/ngoldman/gh-release) for this now as it saves your GitHub credentials and you can use it with or without Grunt.

If you've used GitHub releases you know how great they can be. Essentially you draft a new release on any of your GitHub repositories, choose a specific tag, enter a title and a description, and click a button to create a neat and tidy little package that users can download and use.

Recently I realized that creating these releases was one of the only things I was doing by hand, and that seemed inefficient, so I endeavored to solve the problem with Grunt. It was all very easy with Grunt plugins that were already written, but there were a couple gotchas, so I thought I'd write it up for future generations.

## Grunt Compress

First, you create a zip file that people looking at your
GitHub release can download using [grunt-contrib-compress](https://github.com/gruntjs/grunt-contrib-compress). This is super straightforward. Install it: `npm install --save-dev grunt-contrib-compress`, then load and configure it in `Gruntfile.js`:

```js
compress: {
  main: {
    options: {
      archive: 'name.zip' // What you want to call your file
    },
    files: [
      {
        src: ['dist/**'], // What should be included in the zip
        dest: './'        // Where the zipfile should go
      },
    ]
  }
}
```

It's probably a good idea to add `name.zip` (or whatever you end up naming your file) to your `.gitignore` so you aren't tracking checking it into git.

## Grunt GitHub Releaser

The most important plugin to use was obviously [grunt-github-releaser](https://github.com/dolbyzerr/grunt-github-releaser). I chose this one, but there are a myriad of grunt plugins that handle creating releasing on GitHub and any would probably work. This handles almost all of the heavy-lifting for you in terms of creating a GitHub release. A sample would be something like this:

```js
'github-release': {
  options: {
    repository: 'yourName/repo-name',
    release: {
      tag_name: 'v1.0.0',
      name: 'v1.0.0',
      body: 'Description of the release'
    }
  },
  files: {
    src: ['name.zip']
  }
},
```

Now what you should be thinking in your head is "I would have to change all of these settings every signle time I create a release!". Let's fix that. First, use the version number in your `package.json` as your tag and title:

```js
'github-release': {
  options: {
    repository: 'yourName/repo-name',
    release: {
      tag_name: grunt.file.readJSON('package.json').version,
      name: grunt.file.readJSON('package.json').version,
      body: 'Description of the release'
    }
  },
  files: {
    src: ['name.zip']
  }
},
```

Now all that's left is the body (description) of the release. I have been just parsing this from my `CHANGELOG.md`, but there are numerous ways to handle that.

## Grunt Prompt

The final step is to sign in to GitHub with your username and password so you can upload a release. The grunt-github-releaser plugin has an `auth` object where you can put your username and password, but that should **terrify** you because then your password would be in plaintext in a (maybe public) GitHub repo...

I solved this problem using [grunt-prompt](https://github.com/dylang/grunt-prompt). This lets us ask for a username and password when the grunt task is run. After you npm install and load the grunt task, configure prompt like this:

```js
prompt: {
  target: {
    options: {
      questions: [
        {
          config: 'github-release.options.auth.user', // set the user to whatever is typed for this question
          type: 'input',
          message: 'GitHub username:'
        },
        {
          config: 'github-release.options.auth.password', // set the password to whatever is typed for this question
          type: 'password',
          message: 'GitHub password:'
        }
      ]
    }
  }
},
```

This will set the values of grunt-github-releaser to be whatever the user enters in the prompt. You could even add a prompt for a release body here if you don't have a way of getting that yet!

## Wrapping Up

Now, you would just register a grunt task that runs these plugins in the right order and give it a sensible name like, I don't know, `release`:

```js
grunt.registerTask('release', [
  'prompt',
  'compress',
  'github-release'
]);
```

Now you can just use `grunt release`. Enter your username and password and you're done!

As always, if this makes no sense, is wrong, or could be improved, you should tweet at me: [@paulcpederson](https://twitter.com/paulcpederson).


