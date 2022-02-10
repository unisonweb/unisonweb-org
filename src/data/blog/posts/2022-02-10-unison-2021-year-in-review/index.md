---
slug: unison-2021-year-in-review
title: "Unison in 2021, 2022 and beyond: year in review and future plans"
description: "2021 was a big year for Unison. We released a new alpha version roughly every other month, and each release came with some serious improvements. In total, we merged more than 600 pull requests. Here are some of the highlights."
date: 2022-02-10
authors: ["runar-bjarnason"]
categories: ["news"]
featuredImage: /media/unison-2021.svg
---

2021 was a big year for Unison. We released a new alpha version roughly every other month, and each release came with some serious improvements. In total, we merged more than 600 pull requests. Here are some of the highlights.

## A beautiful UI for browsing Unison code

<br />

<video style="border-radius: 10px;" controls muted width="100%" src="/media/feb-2022-unison-local.mp4" poster="/media/feb-2022-unison-local.png"></video>

<br />

Since a Unison codebase is not stored in text files, it's been a sticking point for developers that they haven't been able to easily browse their code and post it online for others to see. So this summer we rolled out a new user interface for browsing the Unison codebase through a web browser. This comes embedded in the Codebase Manager, so now when you start up `ucm` it also starts a local web server that lets you browse and search your code in a delightful way.

All the code shown in the UI is hyperlinked to support clicking through to definitions. Documentation (written in Unison! — see below) is beautifully rendered.

We have big plans for this UI, and in time it might become a full-fledged IDE for Unison.

## Unison Share community hub

We launched a new community hub at [share.unison-lang.org](share.unison-lang.org) where people can share their Unison code for others to see. It also aims to be the place developers go to read API documentation. It already hosts a whole bunch of libraries from the community, as well as the Base libraries.

This site is running a version of the codebase UI, so the experience of browsing your local codebase vs a publicly shared library should be more or less the same.

## Computable documentation format

This past summer we rolled out a powerful new [computable documentation format](https://www.unisonweb.org/docs/documentation) which makes it a joy to write deeply interlinked documentation with embedded live examples. Documents are ordinary Unison values, so docs are actually written in Unison.

For an example of this in action, [see the documentation for the `List` data type](https://share.unison-lang.org/latest/types/unison/base/List) in the Base library. All the examples are typechecked and evaluated live. Every Unison symbol that appears in the document is hyperlinked to its definition.

See also our recently published article "[Spark-like distributed datasets in under 100 lines of Unison](https://www.unison-lang.org/articles/distributed-datasets/)". This article is 100% written in Unison. The code for the article [is on Unison Share](https://share.unison-lang.org/latest/namespaces/unison/website/articles/distributedDatasets).

## Codebases are now SQL databases

The first alpha release of Unison stored the codebase in a directory structure, similar to how e.g. Git stores repositories. Alpha testers quickly ran into the limitations of this format, so last year Unison switched over to using a [SQLite database to store the code](https://github.com/unisonweb/unison/blob/trunk/docs/repoformats/v2.markdown). Some codebases saw a 99.5% reduction in size as a result of this, UCM uses up to 75x less RAM, and the whole experience of manipulating the codebase is much snappier.

## New, faster Unison runtime

That first alpha version of Unison also ran on an inefficient runtime that was more of a proof-of-concept than anything else. We replaced it with an efficient virtual machine that piggybacks on the Haskell VM. It's much faster, and has revamped I/O and concurrency primitives including software transactional memory, and more. The new runtime uses a traditional compiler pipeline which takes the code through several intermediate stages before execution. We'll be reusing a lot of these stages when compiling to native code, coming this year!

## Standalone binaries

We also added support for [self-contained bytecode files](https://twitter.com/pchiusano/status/1470242716688728075). You can now do

```
.> compile.output mymain binary
```

This will output a small precompiled file `binary.uc` that contains your `main` function and its minimal transitive dependencies. This can be executed from the command line with very fast startup times via `ucm run.compiled binary.uc`, without the overhead of loading the UCM interactive shell or needing to invoke the Unison compiler.

## Developer experience improvements

Together we fixed a lot of bugs and improved the developer experience in lots of little ways this year:

* We added new builtins and new functionality in the Base libraries.
* We improved the performance of UCM in several important ways.
* If you have [`fzf` installed](https://github.com/junegunn/fzf), UCM will now invoke it if you type `cd`, `find`, or `edit` without any arguments.
* UCM now supports wildcard globbing via the `?` symbol. For example `edit ?.doc` to edit the docs for all the immediate children of the current namespace
* There's now a command to generate HTML from Unison `Doc`s.
* Type inference for [ability types](https://www.unisonweb.org/docs/abilities/) is vastly improved.

## Growing the Unison Computing team and community

We doubled the size of the team at Unison Computing this year! Five new people joined the team, so there are now 10 people working on Unison full time.

This is in addition to lots of people hacking on Unison in their spare time. More than a dozen new people added their efforts to the development of Unison this year. We hosted a Hacktoberfest event in October, during which the community came together to fix a whole bunch of issues.

This year we also started hosting weekly community sessions on Wednesdays on [our Discord server](https://discord.gg/vNcZ5vAV). This is like a meetup where usually somebody will stream themselves live-coding something fun in Unison. You should come say hi!

## Big plans for 2022

We're working on some very exciting things in the new year!

### Unison Cloud beta

We think [distributed cloud computing in Unison](https://www.unison-lang.org/articles/distributed-datasets/) is going to knock your socks off. This past year we've been busy building the technology for a futuristic fully-managed platform for distributed Unison execution. We're actively looking for companies who would like to try this out for real work. Go to [unisonweb.org/at-work](https://unisonweb.org/at-work) if you're interested in working with us.

The plan is to launch a beta version of Unison Cloud in Q1 / Q2 of this year! This will be a service that allows you run your Unison code on our managed infrastructure just as easily as running it on your own computer. We're hoping to offer a free tier for Unison enthusiasts.

### Codebase hosting designed for Unison

So far, Unison developers have been mainly using GitHub to host their code. But this is not a great fit for Unison, for several reasons. Firstly, Git assumes that code is stored in text files, which is not the case for Unison. Secondly, the Unison codebase has its own internal history, its own notion of branches, and its own pull request mechanism, none of which can take advantage of Git.

This year, all that is going to change. We're building our own codebase hosting specifically designed for Unison. So instead of camping in a tent out by the dumpsters behind GitHub, you'll be able to host Unison codebases and make them browsable via a beautiful interface like [share.unison-lang.org](https://share.unison-lang.org).

### Native compilation

Unison currently compiles to a kind of bytecode which gets interpreted by a virtual machine that runs on top of the Haskell runtime. The plan this year is to get Unison compiling to fast native code. Dan Doel will be doing a blog post talking about the progress on that.

### New Unison website

We're working on totally revamping [our website](https://unisonweb.org). But it's not just a change in content or look-and-feel. No, no. We're _rewriting the website in Unison_! That's right, the whole site will be a Unison data structure (of the [`Doc`](https://share.unison-lang.org/latest/types/unison/base/Doc) type), demonstrating how you can author rich computable content in the language.

### The first ever Unison conference

We're planning a fully online free-to-attend Unison conference this spring. Stay tuned for details!

## Join our community

We're very excited to be bringing Unison into existence, and we want you to be a part of it!

Stop by the [Unison Slack](https://unisonlanguage.slack.com/ssb/redirect). We're friendly and welcoming.

[Install Unison and try it out](https://www.unisonweb.org/docs)!
