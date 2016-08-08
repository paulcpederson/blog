---
title: Sound Finder
date: 2016-08-15
template: _templates/work.html
feature: sound-finder-browser.png
thumbnail: sound-finder.svg
canvas: gray
spot: blue
site: 'http://soundfinder.io'
description: Sound finder allows you to find your kindred musical spirits. Search for SoundCloud users that have the same taste as you.
---

## Origins

This project started out as a personal project/experiment. I started finding new music on SoundCloud by looking at all the people that liked a good track and seeing what else they liked. Doing this through the SoundCloud UI worked, but there were a lot of misses and it took quite a long time. While reading the SoundCloud REST API documentation (because, yes, that is fun to me) I noticed that the response that comes back for a track includes all of the users that favorited that track.

This gave me the thought that I could probably build my own UI that would help me find new music by searching through the favorites of other SoundCloud users that were similar to me. It turns out that this very naïve recommendation engine actually works quite well. It mirrors the way I find music in real life, ie. talking to friends who like good music about what they're listening to lately.

One thing lead to another and now it's a full blown website with a player, a music visualizer, and a UI.

## Technologies Used

I got to explore some really fun APIs that I hadn't used before. Below is a summary of how the technical side went together and what I learned using each piece.

### Canvas

I've been wanting to dig into the Canvas API for a while now, but I've been intimidated by it. Turns out it's incredibly easy to get started. You just get a context (although it seems like `2d` is your only option right now) and start drawing paths. It's basically a vector drawing program driven from JavaScript. You just tell the context you're beginning a path, and then move and draw lines, filling when you're done.

<div class="full-width">
  <div class="video-wrap">
    <video loop muted autoplay>
      <source src="loading.mp4" type="video/mp4">
    </video>
  </div>
</div>
<p class="caption">Loading indicator created with canvas</p>

Turns out, if you use `requestAnimationFrame` and clear the canvas every frame, it works really well as a sort of poor man's animation library. It's quite low-level drawing the individual lines and shapes (at least more low level than it used to be back in the Flash days), but the math is sort of a fun mental challenge, and you can create some really cool effects.

### Audio

This was another API that was sort of on my bucket list. I've always loved sound visualization. In fact the project that got me thinking about development and interactive art as a career was [Magnetosphere](http://roberthodgin.com/portfolio/work/magnetosphere/), a project by [Robert Hodgin](http://roberthodgin.com/) (AKA Flight404). Apple later asked him to turn it into what is now the iTunes visualizer (<kbd>command + V</kbd>). Did you know you can interact with the iTunes visualizer? Press <kbd>m</kbd> to change the skin and <kbd>+</kbd> or <kbd>-</kbd> to add and subtract particles.

In any case, it turns out that building your own audio player in 2016 is *extremely* easy. You literally just add an `audio` element to the page and set its `src` attribute to the track you want to play. From JavaScript you have access to track info, pause, play, etc.

So that's pretty cool, but what's *really* cool is that using `AudioContext`'s `createAnalyser()` method you can create a stream of frequency data! Plug this into the canvas animation and BAM! Music Visualization!

### ES6/2015

I also used Babel to build the site with newer JavaScript goodies. I think one of the best additions to JavaScript in ES6 is a native module syntax. Creating a clean API and loose coupling in your code is really nice. I was doing this with Browserify and CommonJS modules before, but once it's implemented and widely supported natively it will simplify things a great deal.

Arrow functions are another useful feature for cleaning up some code. I am really partial to using `map`, `filter`, and `reduce`, so arrow functions can really help. Here's an example from the project:

```javascript
let rankedUsers = Object.keys(users)
  .sort((a, b) => users[b].similarity - users[a].similarity)
  .filter(id => users[id].permalink !== username)
  .slice(0, 28)
  .map(key => users[key])
```

### Surge

I hosted the site with [Surge](https://surge.sh/), which is a really great static site hosting service. I've used Surge before, but for Soundfinder I used a really [neat feature](https://surge.sh/help/adding-a-200-page-for-client-side-routing) for single page apps. If you have a file named `200.html` surge will just serve that file for every request. That means you can use really cool, clean, human-readable urls via the `pushState` API and you don't need any server component at all. Nice!

### Animation

Finally, I've tried to make meaningful animation a core part of the project. Each level of the information hierarchy fades out and moves out. Using CSS3 and a small amount of JavaScipt I add a class to each "pane" of the app, inferring a left-to-right movement that helps the user understand progression through the workflow.

Animation effects are always a thin line between engaging and distracting, but I hope I've found a nice middle ground where the animation actually serves a purpose for the user.

## Conclusion

As it's a side project, I'm always sort of working on it and changing things, and there is still a lot to do (I'm looking at you *browser testing*). In developer parlance I suppose you'd refer to that as Yak shaving, but I have had quite a lot of fun and it's always nice to have an excuse to play around with technology you've never used before and grow as a developer.

As always, hit me up on Twitter with your thoughts, corrections, and salutations @paulcpederson.



