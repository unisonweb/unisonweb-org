# Three-minute quickstart guide

This short guide will have you downloading and installing Unison and running your first program (a toy distributed mergesort implementation). There isn't much exposition here and the focus is on getting you up and running as quickly as possible. 🏎

More in-depth guides follow this one.

If you have any trouble with the process, or have ideas about how to improve this document, [come talk to us in the #alphatesting Slack channel][slack]! This document is also [on GitHub][on-github].

[slack]: https://join.slack.com/t/unisonlanguage/shared_invite/enQtNzAyMTQ4ODA0MDM4LWYxZTNkMGUxMDEzNTg3NTMxNjMxOGM2Zjg4ODFjM2RhNGY0OGU2NTMzYmQ1YWIwN2Y0YTc1NjQ1NjgzYzEzOWI
[on-github]: https://github.com/unisonweb/docsite/edit/gh-pages/_includes/quickstart.markdown
[guide]: /docs/tour

## Step 1: Install Unison

If you haven't already, please join the [#alphatesting channel on Slack][slack]. Once you're logged in, [this Slack post](https://unisonlanguage.slack.com/files/TLL09QC85/FMT7TDDDY?origin_team=TLL09QC85) gives the (very brief and simple) install instructions.

When Unison is further along and ready for more general availability we'll just include those instructions here. For now, given the many rough edges that exist, we are really hoping that if you are trying out Unison you'll come talk to us, ask questions, and report bugs!

## Step 2: Create your Unison codebase

Create a new directory, `unisoncode` (or any name you choose), then run the `ucm` binary from within that directory. You'll see a note about "No codebase exists here so I'm initializing one..." and a welcome screen.
<script id="asciicast-dvwP7oXFwf0qwQWds1ShFXMP8" src="https://asciinema.org/a/dvwP7oXFwf0qwQWds1ShFXMP8.js" data-speed="1.4" data-cols="65" async></script>

## Step 3: Fetch and run a distributed mergesort example

__Prerequisites for this step:__ you'll need to have Git installed and on your path.

At the Unison `.>` prompt, before doing anything else, do:

```
---
title: ucm
show-numbers: false
---
.> pull https://github.com/unisonweb/unisonbase.git
```

to fetch a base library with the first example. You'll see some output from `git` in the background, and once that's done you can do:

```
---
title: ucm
show-numbers: false
---
.> edit quickstart.dsort
```

to add the `dsort` distributed mergesort function to the top of a newly created _scratch file_, `scratch.u`:

<script id="asciicast-o9lfrfetnmUT4ArqdDFMXZkr9" src="https://asciinema.org/a/o9lfrfetnmUT4ArqdDFMXZkr9.js" data-speed="1.4" data-rows="30" data-cols="65" async></script>

Open that file and add the following _watch expression_ (a line starting with `>`) to the top, then save the file:

```unison
---
filename: scratch.u
---
> runLocal '(quickstart.dsort (<) [8,2,3,1,4,5,6,7])
```

<script id="asciicast-aTn8qIa3DHaxhspsZJmXodfO7" src="https://asciinema.org/a/aTn8qIa3DHaxhspsZJmXodfO7.js" data-speed="1.4" data-t="1.5" data-autoplay="0" async></script>

You should see your watch expression evaluate to a sorted list. You are now up and running!

_Disclaimer:_ This example is a toy that simulates execution locally and does no error handling. It's just meant to be suggestive of the general idea of being able to test Unison distributed programs locally (perhaps with simulated latency and failures injected) and then run them unchanged atop an actual elastic source of distributed compute. This _will_ be something you'll be able to do in Unison in not too long (see [the roadmap](/roadmap)).

## What next?

* Come [say hello in Slack][slack], tell us what you thought about this guide, and ask questions. 👋
* A [more leisurely tour][guide] of the Unison language and the `ucm` command line tool. (25 minutes)
