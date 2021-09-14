---
title: Three-minute quickstart guide
description: This short guide will have you downloading and installing Unison and running your first program.
---

# Three-minute quickstart guide

This short guide will have you downloading and installing Unison and running your first program. There isn't much exposition here and the focus is on getting you up and running as quickly as possible. 🏎

More in-depth guides follow this one.

If you have any trouble with the process, or have ideas about how to improve this document, [come talk to us in the #alphatesting Slack channel][slack]! This document is also [on GitHub][on-github].

[slack]: /slack
[on-github]: https://github.com/unisonweb/unisonweb-org/blob/master/src/data/docs/quickstart.md
[guide]: /docs/tour
[roadmap]: /docs/roadmap
[editor]: /docs/editor-setup

## Step 1: Install Unison

If you haven't already, please join the [#alphatesting channel on Slack][slack]. Once you're logged in, [this Slack post](https://unisonlanguage.slack.com/files/TLL09QC85/FMT7TDDDY?origin_team=TLL09QC85) gives the (very brief and simple) install instructions.

When Unison is further along and ready for more general availability we'll just include those instructions here. For now, given the many rough edges that exist, we are really hoping that if you are trying out Unison you'll come talk to us, ask questions, and report bugs!

## Step 2: Create your Unison codebase

Run `ucm` to initialize a Unison codebase in `$HOME/.unison`. This is where Unison will store function definitions, types, namespaces, and so on. By default, the UCM will begin downloading the standard library, called `base`, which you'll use to write Unison code. It may take a moment, and once that's done you'll see a big list of definitions that were added. Press `q` to exit the list of definitions.

## Run your first program

Back in your terminal, make a directory to work in, and create a new file there called `scratch.u` with the following contents: 

```unison
---
title: scratch.u
---
> List.map (x -> x * 10) [1,2,3,4,5,6]
```

A line beginning with `>` is a _watch expression_, and this one multiplies every element in a list by `10`, using the `List.map` function.

If `ucm` is not running launch it again in the folder you created. `ucm` monitors all the unison source files in the current directory for changes and evaluates any watch expressions:

```unison
.>

  ✅

  ~/ucm1/scratch.u changed.

  Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.


    1 | > List.map (x -> x * 10) [1,2,3,4,5,6]
          ⧩
          [10, 20, 30, 40, 50, 60]
```

Congratulations, you ran your first Unison program!

## What next?

* Come [say hello in Slack][slack], tell us what you thought about this guide, and ask questions. 👋
* A [more leisurely tour][guide] of the Unison language and the `ucm` command line tool. (25 minutes)
* A [document][editor] for setting up your favorite editor with Unison.
