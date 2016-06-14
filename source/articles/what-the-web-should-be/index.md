---
title: What the Web Should Be
date: 2016-6-14
template: _templates/article.html
description: What is important when building for the web? Here's five things I think are critical.
thumbnail: web-thumb.svg
feature: web-thumb.svg
canvas: tan
spot: orange
---

After designing and developing web experiences for about 6 years my views on what is important have evolved. People naturally change and grow over time, and I'm no exception. In addition to natural personal growth, working on the web is inherently dynamic and quick to evolve. Tools change, best practices change, teams change. Most of it happens slowly, like the proverbial frog in the gradually heated pot. Every once in a while it's good to take stock of what you believe, and outline what is important to you in your work.

In an effort to save the current state of my brain and how I approach the web today (June 2016), I'm writing down a short list of what I consider to be really important. Below is a brief summary of the properties that should be present in every good web experience. Not everything I build and design will meet all of these criteria, but this is what I believe every website should be.

## 1. Fast

My outlook on speed and performance is an area where I've changed fairly dramatically in the last few years. I had a tendency (back in the Photoshop days) to design layouts with *huge* high-resolution photography and tons of webfonts. In terms of development, I used any JavaScript framework and third party library I could get my hands on. This all added up to pages that were pretty slow. They worked fine if you were on a good connection, but when on mobile or just a not-so-great connection they would take a long time to load.

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

In much of the tech industry there exists an obsession with features. Especially in enterprise technology the prevailing attitude seems to be "the product with the most bullet points wins". This way of looking at tech has bled into web based digital products, but it makes even less sense in a hosted environment.

The digital products I've grown to love over time are almost universally simple and focused. This doesn't mean they're not powerful, it just means that the people building it have made important judgment calls about what is and isn't in the scope of the product.

> A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.
>
>— Antoine de Saint-Exupery

We have a responsibility as makers of tools to look at what we are producing with a critical eye and a sense of focus. Our products and experiences should have a sense of clarity and cleanliness.

A long time ago, when we were all building fixed-width 960px layouts for specific screen sizes, there was this constant request from clients to put things "above the fold". Now, ignoring the fact that that idea is and has always been a consensual hallucination (screens are more like a *scroll* than a newspaper anyways), even if you managed to put everything "above the fold", all you've really done is lowered the importance of everything.

With each addition to a design, existing elements all mean less. If you're never asking yourself what is really important, the things you create will grow into obsolescence. Focus on making tough choices so that your users don't have to.

## 5. Responsive

I think there are times when a mobile site or an app can work well, and the point I'm making isn't that "you must always use responsive design". Rather, however you go about and accomplish it, your experiences should be considered and work well on mobile.

I see this ignored all of the time, mostly because the people building these products usually have access to a 27" display. But that's not how the world experiences your site. Your product will inevitably be experienced in every form factor available. Phones, Tablets, TVs, hell, some guy might even be looking at your thing on a fridge.

Considering each one of the infinite combinations of size and capability would be impossible. Rather, designers and builders must now be in the business of smart systems design, where certain rules help to make the entire experience work everywhere. Flexibility is key to ensuring your site works for everybody.

