---
title: Devicons
date: 2013-08-06
template: article.jade
thumbnail: devicons-thumb.jpg
background: devicons.svg
canvas: navy mesh
spot: green
description: Rendering three color icons in the browser with a custom web font
---

At work the other day I was thinking out loud about a strategy for generating full-color icons with a web font. Essentially the idea is to use ```:before``` and ```:after``` pseudo elements to provide a foreground and background to your icon, thusly giving it three colors. If you're a visual learner, it works like this:

![Illustration](before-after.svg)

People at my work tend to take pipe-dreams very seriously, so it wasn't all that surprising that one of my co-workers, [Nik Wise](http://atelier-wise.aws.af.cm/) was listening to me, and then spent the next ten minutes expertly implementing what I had just imagined.

It turns out, that this technique is actually far simpler than I first thought it was going to be, and that the most time consuming part of the workflow is building and color separating the icons. Once you've exported every layer as an .svg file, you just upload them all to icoMoon (or your web font tool of choice), assign them ligatures (so you can remember their names later), and download the bundle.

After that, you just create ```:before``` and ```:after``` elements and make their content attribute equal to the corresponding icon. The css ends up looking something like this:

```css
@font-face {
  font-family: 'devicons';
  src:url('fonts/devicons.eot');
  font-weight: normal;
  font-style: normal;
}

.icon-finder {
  font-family: 'devicons';
  font-feature-settings:"liga","dlig";
  text-rendering:optimizeLegibility;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: #231F20;
}

.icon-finder:before{
  margin-right: -1em;
  color: #71A0D2;
  content: "finderback";
}

.icon-finder:after{
  margin-left: -1em;
  color: #E05130;
  content: "finderfront";
}
```

The above assumes you set up your webfont with the ligatures "finder", "finderback", and "finderfront", each representing one of the three layers of your icon.

The corresponding html is dead simple:

```html
<h3 class="icon-finder">finder</h3>
```

You can take a look at [the proof of concept](http://paulcpederson.github.io/devicons/) to see them in action, or look at [the GitHub repo](https://github.com/nikolaswise/devicons) to see how they're implemented. Nik has also written a [terrific write up](https://github.com/nikolaswise/three-color-icons) of the technique that goes into much more detail.
