---
title: r/analog
date: 2020-05-17
template: _templates/article.html
background: css.svg
thumbnail: ranalog-thumb.jpg
twitter_image: ranalog-thumb.jpg
canvas: navy

site: 'https://ranalog.club/'
description: Exploring Progressive Web Apps by building a photo-viewing application for a popular subreddit.
---

I'd been meaning to play with some of the technologies being referred to collectively as "Progressive Web Apps" for a long time. I was slightly intimidated by all the new terms and strategies, but so much of the ethos surrounding PWAs resonated with me: performance, responsiveness, user-centered design and development. Every overview article about Progressive Web Apps had me nodding along, reminded of the beliefs I have about [what the web should be](./what-the-web-should-be).

What I was waiting for was a good excuse to dig in...

## Motivation

I really like the community using the `analog` subreddit. These are film photographers sharing their work with other film photographers. It's the rare space on reddit where most comments are positive, and there is a real feeling of camaraderie and shared enthusiasm for photography. If you see something you like, and ask questions, it's pretty common for the photographer to give you a response, teaching you how they lit the subject, or how they processed the film to bring out the grain.

What I _don't_ love about the subreddit is Reddit's UI. While their mobile app is perfectly fine for most content, it is not ideal for viewing and appreciating photographic work. Tall photos will exceed the screen size, wide landscape photos will display quite small, at every turn you're forced to battle and ignore interface elements that get in the way of actually viewing the photos.

With that in mind, I set out to make a clean, simple app that showed the top _n_ photos (trending) from the subreddit. Since I would be using this from my phone for the most part, it seemed like a good use case for progressive web apps. Below are some notes about the process including how I went about it and what tripped me up along the way.

## Running HTTPS Locally

Surprisingly, the hardest part of this whole effort was setting up HTTPS. Not on the server (more on that below), but rather on my local dev machine. How do I get a pretty green lock on `localhost`? Several of the technologies used in progressive web apps require you to be running https, but this isn't really something I had done locally before.

I ended up following [this article](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/). Basically, you become a certificate authority, telling your computer to trust the root certificate. Once you've done that, you can create certs and they will be trusted by your computer. This sounds very hard, but it's actually not that complicated. Follow along with the article and it shouldn't take more than a half hour to grok all the moving parts.

I also wrote up some additional notes on this process for my future self in [this gist](https://gist.github.com/paulcpederson/6e2ff7e85d396e4df007e8a5a00e8a1b) if you want something a bit more streamlined.

## Setting up a local dev environment with Parcel

Now that you have a working https cert, you need to tell whatever your local server is to use it. For this project I wanted to play with [Parcel](https://parceljs.org/). Parcel is nice in a new project because it's a sort of "batteries-included" approach to tooling. You just `npm install --save-dev parcel-bundler` and then in your `package.json`, tell parcel where your html file is, and it will do all the rest! My `scripts` section ended up looking like this:

``` json
{
  "prestart": "rm -rf dist/",
  "start": "parcel index.html --https --cert dev.ranalog.club.crt --key dev.ranalog.club.key"
}
```

Notice I'm clearing out all the generated files first, then passing my cert and key to parcel so it can run a dev server.

## Building the app

Now you're ready to build the app. This is the normal process of app development, and there are only a few extra things you'll have to think about.

### Adding a service worker

I used the [sw-precache](https://www.npmjs.com/package/parcel-plugin-sw-precache) plugin so that parcel generated a service worker for me. Once you've installed the plugin, a `service-worker.js` file will appear in your `dist/` folder. To register it, you must add something like the following in a `script` tag in your html file:

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
```

### Fallback for users without JS

Because this data is fetched dynamically on the client, it's important to tell users without JavaScript installed why it's not working. To that end I added a `noscript` section:

```html
<noscript>
  <h2>This page requires JavaScript</h2>
  <p>Because this page is dynamically populated with content from Reddit, it requires JavaScript to be turned on to fetch the latest content.</p>
</noscript>
```

### Web app manifest

This file provides information about your application in a JSON format. Essentially it helps browsers (and the OS) understand how to display your app properly. It's as simple as creating a JSON file and linking to it in your html:

```html
<link rel="manifest" href="manifest.webmanifest">
```

My manifest looked something like this:

```json
{
  "name": "r/analog",
  "short_name": "r/analog",
  "start_url": "/",
  "description": "Top posts from the analog photograhy subreddit",
  "display": "fullscreen",
  "background_color": "#fff",
  "theme_color": "#fff",
  "icons": [{
    "src": "img/icon-32.png",
    "sizes": "32x32",
    "type": "image/png"
  },
  {
    "src": "img/icon-64.png",
    "sizes": "64x64",
    "type": "image/png"
  },
  {
    "src": "img/icon-256.png",
    "sizes": "256x256",
    "type": "image/png"
  },
  {
    "src": "img/icon-512.png",
    "sizes": "512x512",
    "type": "image/png"
  }]
}
```

### Critical path CSS

One additional step I took on this project was to defer loading the stylesheet until later in the load cycle. The idea is that you can supply a small set of css inline in the head which will help display the above the fold content correctly, and then load the other css later.

In order to accomplish this technique, you can use the `disabled` attribute on a link:

```html
<link rel="stylesheet" href="css/style.css" disabled>
```

Then in your JS, you can activate it when the other resources are ready:

```js
document.querySelector('link[rel="stylesheet"]').removeAttribute('disabled')
```

I don't know how meaningful this change was in my app, but it's intuitive that deferring non-critical CSS to later in the loading process would help your first paint time.

## Deploying with Netlify

Once you've ticked all the PWA boxes (use the "audits" tab in the Chrome Web Inspector for help), you are ready to deploy. My favorite way to do this lately for SPAs is to use their "Deploy from GitHub" feature. [This article](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) has a good step by step walk through. Basically you tell Netlify where your repo is and what build command you want to run, and anytime you push to master your site will re-deploy automatically.

For the command, I added a couple more scripts to the `package.json`:

```json
{
  "predeploy": "rm -rf dist/",
  "deploy": "parcel build index.html --public-url ./"
}
```

Then tell Netlify you'd like to use `npm run deploy` as your build command.

### HTTPS

Once you've [configured your custom domain](https://docs.netlify.com/domains-https/custom-domains/) you'll need to enable https so that your service worker will function properly. Netlify [makes this ridiculously easy](https://www.netlify.com/blog/2016/01/15/free-ssl-on-custom-domains/), and honestly it's one of the best parts of their service.

Just bask in how short this [medium article](https://medium.com/@m_nakamura145/enable-https-on-netlify-37e9d47fa6f7) is!

## Wrap up

In the end, I learned a lot and built myself a very useful app. You can check out the finished product at [ranalog.club](https://ranalog.club/) (_⚠️ warning: could have NSFW posts!_). I've been happily browsing a few times a day for the past several months! There were definitely some hurdles, but things like parcel and Netlify made the process a whole lot easier.

As always, feel free to reach out to me on twitter [@paulcpederson](https://twitter.com/paulcpederson) with questions or comments!
