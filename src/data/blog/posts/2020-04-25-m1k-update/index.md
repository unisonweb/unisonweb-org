---
slug: april-update
title: Get set up for publishing Unison libraries with milestone M1k
description: "We've just released milestone M1k of the the Unison Codebase Manager, which focused on essentials for ecosystem growth, specifically: guidance and tools for structuring and licensing your own libraries, and contributing to others."
date: 2020-04-25
authors: ["arya-irani"]
categories: ["news"]
featuredImage: /media/thing4.svg
---

Hi folks!  We've just released milestone M1k of the the Unison Codebase Manager (the [quickstart guide][quickstart] has install instructions), which focused on essentials for ecosystem growth, specifically: guidance and tools for structuring your own libraries and contributing to others.

### A Slack channel to talk about Unison libraries you're working on

Rúnar has started [#hackathon][hackathon] on the [Unison Slack][slack], as a place to talk about Unison libraries you're working on, find collaborators, and compare notes. He's also started streaming Unison live-coding sessions! Check out reruns [on Twitch](https://twitch.tv/runarorama), or join [#hackathon][hackathon] to chat about the next one.

### Organizing your codebase

We've had our first few PRs to `unisonweb/base`, which has been been rewarding, and also forced us to sit down and figure out what a nice process in Unison might look like.  So check out the draft docs on [how to organize your codebase][codebase-organization].  It gives some guidance on how to install new Unison libraries (both "released" and pre-released), doing the day-to-day work of creating, or reviewing and merging pull requests, and how to publish a release of your own.

### Publishing a library

Speaking of publishing your own libraries, we are now hosting a [Unison code catalog][libraries] to show off what projects people are working on, or maybe accepting contributions for.  As of this writing, we've only listed `unisonweb/base`, so please submit your new libraries to the list via PR (until we have an automated solution)! 🙂

You can use the new `create.author` command to create `Author` and `CopyrightHolder` values to attach, along with your library's `License`, as metadata to your published definitions.

As of M1k, you can [configure the Unison Codebase Manager][configuration] with some default metadata to attach to all of your work.  You can also associate a default Git url to a given namespace, meaning that with some configuration,

```
._coolproject> push git@github.com:myorg/coolproject
```

can become simply:

```
._coolproject> push
```

and similarly for `pull`.

### UCM improvements

Speaking of `push` and `pull`, these commands have been updated to be a bit snappier.  The `view` and `display` commands now support suffix-based lookups (we're tracking down all the stragglers that don't!). The runtime now supports more operations on `Int` and `Nat`, and we've fixed a few other whoopsies.  (Thanks to @pete-ts, @noahhaasis, @stew, and @atacratic for their PRs!)

### What's next?

Work on the faster new runtime has been humming along, and we plan to release it soon in milestone M2.  We'll add better support for the abovementioned proposed codebase organization format to UCM, e.g. good project scoping for commands where it matters, and we're also about to start devoting more resources to the distributed computing libraries. :rocket:

Are we forgetting anything?  Tweet [@unisonweb][twitter] or come tell us [on Slack][slack]!



[codebase-organization]: /docs/codebase-organization
[configuration]: /docs/configuration
[libraries]: /docs/libraries
[quickstart]: /docs/quickstart
[hackathon]: https://slack.com/app_redirect?channel=C011CJFTQP9&team=TLL09QC85
[slack]: /slack
[twitter]: https://twitter.com/unisonweb

