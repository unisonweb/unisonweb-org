---
title: Here's what's been happening with Unison
description: Since our last official update here, we started alpha testing a first release of Unison, gave a talk at Strange Loop, and have been working towards an M2 release with lots of new features, bugfixes, and polish.
date: 2019-10-16
categories: ["news"]
featuredImage: /media/thing9.svg
---

Since our last official update here, we started alpha testing a first release of Unison, gave [a talk on Unison at Strange Loop](https://www.youtube.com/watch?v=gCWtkvDQ2ZI), and have been working towards an M2 release with lots of new features, bugfixes, and polish. Our goal with M2 is to have the core language and tooling be "feature complete and totally usable.” We have often used the metric of: “a user can write Unison libraries without hitting major gaps or bugs that cause undue frustration.”

## Strange Loop was great!

<iframe width="580" height="436" src="https://www.youtube.com/embed/gCWtkvDQ2ZI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The approach I took in explaining Unison in the The Strange Loop talk was to focus on how the core idea of content-addressed code (explained in the talk) leads to a host of nice benefits, almost for free:

* No builds, easy renames, test caching, and an overall better experience for codebase management
* No dependency conflicts
* Typed durable storage
* A better model for distributed execution and transparent code deployment
* ... and I could have kept going! My favorite additional benefits that I didn't cover are having structured refactoring sessions rather than long lists of compile errors, and having a codebase that is always runnable - never broken. 

Content-addressed code is one of those essential, simple ideas that feels like it ought to become ubiquitous in languages of the future. Even though it might seem elementary, it's also a fundamental change that affects almost everything about the developer experience. When Unison started as a research project based on this core idea, there were so many questions - things like [if you can't ever modify a definition, only introduce new ones, how do you refactor or update a codebase?](https://twitter.com/unisonweb/status/1173942969726054401) What has been surprising and cool is that all the questions around "how do you do X in the Unison worldview" continue to have answers, and these answers often make MORE sense than what is being done currently. Just by thinking through things with an open mind you can uncover an entirely consistent alternate reality of how programming could work, and it has been there the whole time just waiting to be discovered. That's been a lot of fun!

## Working towards our next release

In the months leading up to Strange Loop and following the conference, we've been focused on filling in some gaps in the developer experience. Some things we've already done:

* You can view the history of your codebase (the `history` command).
* You can move around in that history (`undo`, `reflog`, and `reset-root` commands).
* You can run `IO` programs without needing to add definitions to the codebase first, and you can run scripts that do `IO`
* Literate Unison transcripts, for producing tutorial style documentation. For instance, much of [the docs site](/docs) could be moved over to be generated via the transcript runner, and we're also using these transcripts internally for integration testing.

Things we plan on getting done for our next major release:

* Support for authoring API documentation
* A workflow for pull requests and code reviews
* A workflow for publishing and using Unison libraries
* A much better algorithm for refactoring types, which avoids manual propagation of edits
* Bugfixes and general polish - thank you to our alpha testers for uncovering and reporting issues, we will be cranking through those.

At that point the developer experience of using Unison will hopefully be pretty good - without major gaps, and anyone will be able to write and share Unison code without issue.

## In progress: an ecosystem-wide code viewer with click-through to definition abilities

There's a cool project in the works that I wanted to mention here.

One downside of the Unison codebase not just being a collection of text files is that we don't get to use rudimentary text-based tools to view that code. I prefer to see this as a feature, though, in that it creates a bit of a vacuum which can be filled by something that is _way better_ than the text based tool.

Mitchell Rosen, Elliot Wu, [and friends](https://github.com/unisonweb/elm-browser/graphs/contributors) have started on a [codebase browser for Unison](https://github.com/unisonweb/elm-browser) which we are planning on hosting here at unisonweb.org/browse when it's a little further along. The idea is that you can hyperlink to any Unison definition, in any Git repo, and render that definition nicely with hyperlinks to all its dependencies. And rather than this being a build artifact that every library author must maintain and keep up to date, it's something that Just Works for all publicly hosted Unison code, without any action needed by library authors! It works by reading the underlying codebase format which has all the semantic information needed for this to be possible.

I am very excited for this to come online. Kudos to the team for putting this together.

## Wrapping up

We will try to post updates more regularly than once every 6 months. 😀 In addition to this blog, feel free to come by the [Unison Slack](/community), which is a friendly spot to ask questions if you’re trying out Unison. Besides [the project on GitHub](https://github.com/unisonweb/unison), the #contrib channel is a good spot to follow along with Unison's development.

One more thing: Arya and I will be at [Scale By the Bay](https://sched.co/RoSk) in a month, giving a talk on Unison. 

That's all for now. 🌻

_Thanks to all contributors to this post: Paul Chiusano, Rebecca Mark, Noah Haasis, Rúnar Bjarnason, and Arya Irani_
