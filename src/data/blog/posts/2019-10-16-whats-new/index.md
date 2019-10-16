---
title: Here's what's been happening with Unison
description: Since our last update official update here, we started alpha testing a first release of Unison, gave a talk at Strange Loop, and have been working towards an M2 release with lots of new features, bugfixes, and polish.
date: 2019-10-16
authors: ["paul-chiusano"]
categories: ["news"]
featuredImage: /media/thing9.svg
---

Since our last update official update here, we started alpha testing a first release of Unison, gave [a talk on Unison at Strange Loop](https://www.youtube.com/watch?v=gCWtkvDQ2ZI), and have been working towards an M2 release with lots of new features, bugfixes, and polish. Our goal with M2 is to have the core language and tooling be "feature complete and totally usable". We have often used the metric of: "can write Unison libraries without hitting major gaps or bugs that cause you to want.

## Strange Loop was great!

<iframe width="966" height="543" src="https://www.youtube.com/embed/gCWtkvDQ2ZI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The Strange Loop talk approached explaining Unison by just talking about how the core idea of content-addressed code (explained in the talk) leads to all these nice benefits, almost for free:

* No builds, easy renames, test caching, and more
* No depdendency conflicts
* Typed durable storage
* A nicer story for distributed execution and transparent code deployment
* ... and I could have kept going!! We also get always live, never broken codebase, structured refactoring sessions rather than lists of compile errors, and more. 

Content-addressed code is just one of those nice simple ideas from which so many benefits flow. The more you get your head around it, the more you start to wonder gosh, why isn't everything built out of this idea? Well, imagine if you discovered a brilliant idea for a new sort of material that could be used to make vastly better CPUs at lower cost and power usage. You might think "wow, this is so exciting, future here we come!!", but then you remember: there's a collosal amount of existing know-how and infrastructure devoted to the curent way of creating CPUs, and large swaths of that has to be scrapped, adapted, or rethought in order to realize the benefits of any radically new approach.

That's roughly the position Unison was in several years ago when it was a crazy research project. It felt daunting at times to work on, but the work was also super interesting and fun, so why not keep at it? There were lots of questions, like [if you can't ever modify a definition, only introduce new ones, how do you refactor or update a codebase?](https://twitter.com/unisonweb/status/1173942969726054401) that we really had no idea how to answer at first. The surprising thing is that all the questions of "how do you do this in the Unison worldview" continued to have answers, answers that actually made a lot of sense (often MORE sense than what we do now) and could be uncovered just by thinking about them a little and keeping an open mind. That has been a lot of fun.

## Working towards our next release

todo
