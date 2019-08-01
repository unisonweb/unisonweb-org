# 3 minute quickstart guide

This short guide will have you downloading and installing Unison and running your first program (a toy distributed mergesort implementation). There isn't much exposititon here and the focus here is on getting you up and running as quickly as possible. 🏎 

More in-depth guides follow this one.

If you have any trouble with the process or ideas about how to improve this document, [come talk to us in the #alphatesting Slack channel][slack]! Also this document is [on GitHub][on-github].

[slack]: https://join.slack.com/t/unisonlanguage/shared_invite/enQtNzAyMTQ4ODA0MDM4LWYxZTNkMGUxMDEzNTg3NTMxNjMxOGM2Zjg4ODFjM2RhNGY0OGU2NTMzYmQ1YWIwN2Y0YTc1NjQ1NjgzYzEzOWI
[mac-dl]: todo
[linux-dl]: todo
[windows-dl]: todo
[on-github]: todo
[guide]: unisontour.html

## Step 1: Download Unison

Download the `unison` executable for [Mac][mac-dl], [Linux][linux-dl], or [Windows][windows-dl] and then (optional) add it to your path.

## Step 2: Create your Unison codebase

Create a new directory, `unisoncode` (or any name you choose), then run the `unison` binary from within that directory. You'll see a note about "No codebase exists here so I'm initializing one..." and a welcome screen.

<script id="asciicast-IYWfFwIgyl9Gilk3ZExvLfOjg" src="https://asciinema.org/a/IYWfFwIgyl9Gilk3ZExvLfOjg.js" data-speed="2" data-cols="65" async></script>

## Step 3: Fetch and run a distributed mergesort example

__Prerequisites for this step:__ you'll need to have Git installed and on your path.

At the Unison `.>` prompt, before doing anything else, do:

```
.> pull https://github.com/unisonweb/unisonbase.git
``` 

to fetch a base library with the example you'll be running. You'll see some output from `git` in the background, and once that's done you can do:

```
.> edit quickstart.dsort
```

to add the `dsort` distributed mergesort function to the top of a newly created _scratch file_, `scratch.u`:

<script id="asciicast-o9lfrfetnmUT4ArqdDFMXZkr9" src="https://asciinema.org/a/o9lfrfetnmUT4ArqdDFMXZkr9.js" data-speed="2" data-rows="30" data-cols="65" async></script>

Open that file and add the following _watch expression_ (a line starting with `>`) to the top, then save the file:

```
> runLocal '(quickstart.dsort (<) [8,2,3,1,4,5,6,7])
```

<script id="asciicast-aTn8qIa3DHaxhspsZJmXodfO7" src="https://asciinema.org/a/aTn8qIa3DHaxhspsZJmXodfO7.js" data-speed="2" async></script>

You should see your watch expression evaluate to a sorted list. You are now up and running!

_Disclaimer:_ This example is a toy that simulates execution locally and does no error handling. It's just meant to be suggestive of the general idea of being able to test Unison distributed programs locally (perhaps with simulated latency and failures injected) and then run them unchanged atop an actual elastic source of distributed compute! This _will_ be something you'll be able to do in Unison in not too long, see [the roadmap](roadmap.html).

## What next?

* Come [say hello in Slack][slack], tell us what you thought about this guide, and ask questions. 👋
* A [more leisurely guide][guide] to the Unison language and the `unison` command line tool. (25 minutes)