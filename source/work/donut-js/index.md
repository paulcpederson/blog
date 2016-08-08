---
title: 'Donut.js'
date: 2016-03-04
template: _templates/work.html
feature: donut-js.png
thumbnail: donut-thumb.svg
twitter_image: donut-js-twitter.png
canvas: gray
spot: blue
site: 'http://donutjs.club/'
twitter: true
description: Branding, design, and development for a super fun Portland JavaScript meetup. Donuts!
---

## Origins

I actually found this project on Twitter. Somebody I follow retweeted the organizer saying they were looking for some design work for their meetup. It's always fun to keep the design and branding skills sharp, so I dove into it pretty hard. Plus they give all of their profits to charities like [Chick Tech PDX](http://portland.chicktech.org/), it's awesome!

## Branding

![Donut.js Brand](banner.svg)
<p class="caption">Finished Logo + Logotype</p>

The brand is entirely built around a flat, clean, vector illustration style. Chunky, fun, modern, and pretty wacky was the goal. Started with the logotype, I felt like a cursive, retro baseball script worked well. This adds a bit of humanity to the brand. Using a geometric sans or a grotesk would have made it feel sterile. Remember, this is about real people getting together in real life to eat real donuts!

From there I developed the logo itself. I knew I wanted to use a donut with sprinkles. Donuts are perfectly round and fairly iconic on their own, so I knew it would play well at small sizes and on laptops and such.

![Donut.js Color Palette](palette.svg)
<p class="caption">Pretty into that mint, not gonna lie.</p>

The color palette is built off white on a very strong electric blue. There are a handful of grays, and then all the supplemental colors are generated from the sprinkles.

I wanted to embrace the pastels that are often used for sprinkles, because you don't usually see tech industry branding use pastels, so it's different and fun.

![Mikado type specimen](handgloves.svg)
<p class="caption">If that doesn't look chunky and fun I don't know what does.</p>

The primary brand face is [Mikado Bold](https://www.myfonts.com/fonts/hvdfonts/mikado/bold/) which is just about as chunky and fun as you can get.

I also created a brand ambassador named Donny the Donut™, as well as a ton of other smaller illustrations (Donny doing things, more donut styles, etc).

## Development

The site requirements were pretty simple. The site just had to have a couple links at the top, a block about the next event, a design for the schedule, and a block with other more general information about Donut.js. I did use a couple new technologies just for fun.

### Flexbox

![Top navigation flexbox diagram](flexbox.svg)
<p class="caption">Three navigation items are have a normal width defined by their content, while the other expands to fill the remaining space.</p>

The top navigation uses flexbox for layout. I had never used flexbox before so this was a nice way to get my feet wet. It really makes some things *much* easier than the CSS of the past (think vertical centering, fixed plus flexible layouts).

### Canvas

Somebody suggested that it would be fun to have procedurally generated sprinkles in the background of the site. I used canvas for [Sound Finder](./sound-finder/), so I knew that Canvas could handle the challenge. It was pretty straight forward, essentially generate a certain number of sprinkles (lines with rounded stroke) in an array. Update their positions so that they look like they're falling. When they fall below the bottom of the screen, update their position to above the screen, so that they fall forever.

<div class="full-width">
  <div class="video-wrap">
    <video loop muted autoplay>
      <source src="sprinkles.mp4" type="video/mp4">
    </video>
  </div>
</div>
<p class="caption">Falling sprinkles!!!!!</p>

The most challenging aspect of sprinkles falling from the sky was getting the rotation working. It turns out the way to rotate something on a canvas is not to rotate the item, but rather, to translate the drawing context to the center point you'd like to rotate on and rotate the entire canvas, restoring when you're done.

```js
// save the canvas context
ctx.save()

// translate the context to the sprinkle's center point and rotate
// translate back to 0,0 after rotation
ctx.translate(s.x, s.y)
ctx.rotate(s.r * Math.PI / 180)
ctx.translate(-s.x, -s.y)

// draw the sprinkle
ctx.beginPath()
ctx.moveTo(s.x - (s.l / 2), s.y)
ctx.lineTo(s.x + (s.l / 2), s.y)
ctx.lineWidth = 20
ctx.strokeStyle = s.c
ctx.lineCap = 'round'
ctx.stroke()
ctx.closePath()

// restore the context to the normal non-rotated translation
ctx.restore()
```

I was able to do all of this with no dependencies in eighty lines of code, which I think is pretty awesome.

## Conclusion

This was a really fun project to work on, and if you're in Portland and like JavaScript, make sure you [buy some tickets](http://donutjs.club/tickets/). I think it turned out well, and so do these people!
<div class="block-grid">
<div class="column-4 medium-column-12">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">omg the <a href="https://twitter.com/donutjs_pdx">@donutjs_pdx</a> name tags and stickers!! 🍩🍩🍩 <a href="https://t.co/xvsiuI3JBL">pic.twitter.com/xvsiuI3JBL</a></p>&mdash; sailor mercury (@sailorhg) <a href="https://twitter.com/sailorhg/status/737817945120768001">June 1, 2016</a></blockquote>
</div>
<div class="column-4 medium-column-12">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">🍩 Portland&#39;s <a href="https://twitter.com/donutjs_pdx">@donutjs_pdx</a> looks superb, and they have a real cute website, too! <a href="https://t.co/OWcSQQetj4">https://t.co/OWcSQQetj4</a></p>&mdash; Rachel Simone Weil (@partytimeHXLNT) <a href="https://twitter.com/partytimeHXLNT/status/761320770937028608">August 4, 2016</a></blockquote>
</div>
<div class="column-4 medium-column-12">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Had a good time (and donut) at <a href="https://twitter.com/donutjs_pdx">@donutjs_pdx</a> 🍩✨🍩✨🍩✨🍩 <a href="https://t.co/HYcnK2P1qF">pic.twitter.com/HYcnK2P1qF</a></p>&mdash; sean (@seanahern) <a href="https://twitter.com/seanahern/status/748010464689414145">June 29, 2016</a></blockquote>
</div>

</div>