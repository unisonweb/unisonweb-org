---
slug: m2-release
title: New M2 release of Unison
description: "We've just put out a major new release of Unison. It includes a snazzy new UI for browsing Unison codebases, a new computable documentation format, a new faster runtime, and a new SQLite-based codebase format that substantially improves codebase performance."
date: 2021-06-03
authors: ["paul-chiusano"]
categories: ["announcements"]
featuredImage: /media/blog-m2.svg
---

Our last release was [M1m](https://github.com/unisonweb/unison/releases/tag/release%2FM1m) way back in May 2020 and a lot has been happening since then. Thanks to [all the contributors who helped make this release possible](https://github.com/unisonweb/unison/blob/trunk/CONTRIBUTORS.markdown).

First, there's a snazzy new UI for browsing Unison codebases: 

<br />

<video style="border-radius: 10px;" controls muted width="100%" src="/media/unison-share-demo-m2.mp4" poster="/media/unison-share-demo-m2.png"></video>

<br />

This UI now comes embedded in UCM and a version is hosted at [share.unison-lang.org](http://share.unison-lang.org). If you have public Unison code you'd like to be browseable at [share.unison-lang.org](http://share.unison-lang.org), you can [open a PR for this file](https://github.com/unisonweb/shipwright/edit/trunk/files/initialize-codebase.sh).

All the code shown in the UI is hyperlinked to support click through to definitions, and this interface will soon support find usages, rich rendering of documentation, and more. This excellent work was a joint effort by [@hojberg](https://github.com/hojberg) (designed and built the front end) and [@runarorama](https://github.com/runarorama) (wrote the back end server that provides an interface to the codebase over HTTP). There's still some ongoing work to improve the performance of this UI which [can be tracked here](https://github.com/unisonweb/unison/issues/2045).

Besides the Codebase UI, here's what else is new:

- There's a powerful new [computable documentation format](/docs/documentation) which makes it a joy to write deeply interlinked documentation with embedded live examples. Work by [@pchiusano](https://github.com/pchiusano). For now there's just a console renderer for docs within UCM, but the codebase UI will soon support doc viewing.
- The M2 release uses a new [SQLite-based codebase format](https://github.com/unisonweb/unison/blob/trunk/docs/repoformats/v2.markdown) which is about 100x smaller on disk and uses up to 75x less RAM, with further performance improvements on the way. Work by [@aryairani](https://github.com/aryairani). Performance issues with the simplistic V1 codebase format were getting in the way of library development.
- The Unison runtime has been rewritten: it's faster and comes with revamped I/O and concurrency primitives including software transactional memory and more. We'll be publishing docs on this soon. Work by [@dolio](https://github.com/dolio).
- M2 has lots of new builtin functions, improvements to the base library, and various new syntax. Work by [@stew](https://github.com/stew), [@pchiusano](https://github.com/pchiusano), [@runarorama](https://github.com/runarorama) and [many others](https://github.com/unisonweb/unison/blob/trunk/CONTRIBUTORS.markdown).

See [the release notes](https://github.com/unisonweb/unison/issues/1930) for the full details.

You can head over to [unisonweb.org/docs](http://unisonweb.org/docs) for instructions on getting started or upgrading. And come [say hello in the Slack](https://unisonweb.org/slack).

## What's next?

There are a few events coming up: regular "office hours", a documentation day, and a Unison workshop at ZuriHac. See [the event calendar](/calendar).

Following M2, the next major release will be a beta release which includes the distributed programming API and a number of improvements to UCM and the codebase UI. We'll be publishing a roadmap soon. After the beta release will be mostly bugfixes and polish before our first general availability release!

🌻
