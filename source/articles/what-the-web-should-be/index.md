---
title: What the Web Should Be
date: 2016-6-3
template: _templates/article.html
description: What should we be aiming for when we build websites?
thumbnail: sublime-writer-thumb.jpg
canvas: navy
spot: cyan
---

After designing and developing web experiences for about 6 years my views on what is important have evolved. People naturally change and grow over time, and I'm no exception. In addition to that, working on the web is one of the most dynamic and quickly changing industries you could hope to be a part of. Tools change, best practices change, teams change. Most of it happens slowly, like the proverbial frog in the gradually heated pot, you might not realize that you hold different beliefs today than you did yesterday.

In an effort to save the current state of my brain and how I approach the web today (June 2016), I'm writing down a short list of what I consider to be really important. Below is a brief summary of the properties that should be present in every good web experience. Not everything I build and design will meet all of these criteria, but this is what I believe every website should be.

## 1. Fast

This is the one that's changed the most. I had a tendency (back in the Photoshop days) to design layouts with *huge* high-resolution photography and tons of webfonts. In terms of development, I used any JavaScript framework and third party library I could get my hands on. This all added up to pages that were pretty slow. They worked fine if you were on a good connection, but when on mobile or just a not-so-great connection they would take a long time to load.

I realized how much I've changed in this regard recently when going back to a project I hadn't touched in a few years. It had all kinds of weight and inefficiencies that were pretty easy to remove. After spending a day or two [reworking some things](https://github.com/twaddington/pdxroasters/pull/123) I was able to get to `DOMContentLoaded` in 222 ms.

Most recent side projects I've worked on don't use huge banner images, and the JavaScript is of the vanilla variety. Everything that can be a small SVG is. And the reason for doing this isn't just bragging rights or some sort of personal pride. It comes down to this: we are building experiences. If a page takes forever to load, it makes for a bad experience. It doesn't matter how nice the plane is if you've been sitting at the gate for eight hours waiting to board.

Not all my sites are fast yet (this blog could use a tune up), and I'm certainly not a performance expert, but the point is I care about this now, and I think it's important. Hopefully I'll continue to get better at keeping the web fast, because it should be.

## 2. Beautiful

I've always held that the web should be beautiful. I know that there are some that are taking the more *art brut* approach, and that's fine. In the end, the look is less important than the content, but for me it's important that each page looks really good. If every website was just unstyled Georgia for days, the world would be a lot less fun.

Think about it from a user's perspective. There are an infinite number of visually amazing things that a user could experience in the world. They could go to the top of the Empire State Building, or scuba dive the Great Barrier Reef. But right now, for whatever reason, they are looking at a screen with what you built rendered on it. Don't you owe it to them to make them feel like somebody **gave a shit** about how it looks and feels?

## 3. Accessible

The promise of the web is that *everybody* can benefit from it. The internet is very radical and utopian in a lot of ways. The idea that anyone, in any nation, of any race or creed or ability can instantly reach out and communicate with anybody else is really powerful. And to make that happen, you have to make sure that *everybody* can actually use the thing that you built.

To be honest, this one is really new to me. It's something I've been dealing with for months, not years. And it's *hard*. Especially when you've been doing things wrong for years. That first time you try to use your site in the same way a blind person is forced to is really scary and weird. But you know what? I think it's important, and I'm going to get better at it. Because I should, and so should you.

## 4. Focused

## 5. Responsive

## 6. Dynamic
