---
title: Open Season
date: 2013-10-19
template: article.jade
background: ogden.jpg
thumbnail: ogden-thumb.jpg
canvas: tan mesh
spot: red
description: "Quickly written notes about Max Ogden's talk at Realtime Conf 2013: Open Season - A Plea for Digital Frontiers People"
---

<p class="caption">Cover photo taken by <a href="http://ryanresella.com">Ryan Resella</a> and licensed under Creative Commons.</p>

Max Ogden took the stage at Realtime Conf with passion, a love of cats, and a stellar beard. His talk ranged from the node community to the fields that are a frontier for openness. Here are my quickly written notes:

## Node and NPM

Node has several non-blocking work-flows for growing the community. Node is pretty figured out at this point, just a handful of fast APIs for common protocols.

NPM is where you can put *anything*. No dependency hell. Any number of people can work on something. This grows a community fast. Thousands and thousands of modules exist in an interrelated ecosystem.

>NPM is more interesting than Node.

Publishing small modules that have version numbers is important. It helps to distribute maintenance and responsibility. Everybody owns their own chunk. If you have a feature you want in another module, just write your own module with that feature and depend on the original module. In that way, you become the owner of that module.

```bash
$ npm install
$ npm start
$ npm test
```

These three commands should be used in every node module. No coffee, no grunt, no whatever. Just stick to these simple ways of doing it.

GitHub has enabled npm and node. There is usually a one-to-one relation to node-modules and GitHub repos.

Have their own federated schooling system. [Node School](http://nodeschool.io) is a school that runs offline on your command line. It teaches you all kinds of awesome stuff.

Module system allows for dissenting opinions to coexist. This diversity is good and healthy.

> May the best fork win.

If you don't like it, fork it. You don't have to agree. Just implement your feature on a fork. This is a non-blocking work-flow.

An API is intuitive if the methods tell you what it is and what they do. If you do it right, your dependents on npm go up. Don't call your modules intuitive, let other people do that. You don't need to market things that are good. They'll just become part of everybody's project.

## The Open World

Ogden then showed a great chart that diagrammed all the components needed to have something be truly open. This led to identifying some 'Frontiers of Openness', or areas of humanity where there is still a lot left to be desired in terms of keeping it open.

**Open Science:** doing fairly well, but needs content freedom. Just look at Aaron Schwartz.

**Open Data:** been around long enough that there are a myriad of ways to do it. None of them have really taken off, but there has been a lot of success there.

**Open Government:** People aren't even sure if this is a good idea yet. It's very early. Local government is a way to get around the mistrust of federal government. Talked about Code for America, and Textizen along with lots of other startups who are working to make open government a reality.

People should bravely leave their silos and go help the fight of the frontier. Work together to make everything more transparent and open.

Check out the slides [here](http://maxogden.github.io/slides/realtimeconf/#/1) or watch the video:

<div class="video-wrap"><iframe src="//player.vimeo.com/video/77376239?title=0&amp;byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
