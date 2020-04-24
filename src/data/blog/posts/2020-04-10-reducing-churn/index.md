---
slug: reducing-churn
title: How Unison reduces ecosystem churn
description: Unison doesn't have library dependency conflicts, and many sources of ecosystem churn just disappear. This fact got a brief mention in the Strange Loop 2019 talk, but that talk didn't make all the benefits totally clear. This article will attempt to highlight some of the more surprising benefits of Unison's approach.
date: 2020-04-10
categories: ["viewpoints", "learn"]
authors: ["paul-chiusano"]
featuredImage: /media/thing12.svg
---

Unison doesn't have library dependency conflicts, and many sources of ecosystem churn just disappear. This fact got a brief mention in [the Strange Loop 2019 talk](https://www.youtube.com/watch?v=gCWtkvDQ2ZI), but that talk didn't make all the benefits totally clear. This article will attempt to highlight some of the more surprising benefits of Unison's approach.

This topic is important because library churn disproportionately affects younger language ecosystems and can be a major reason that people wait to adopt new stuff: "I'd rather wait until things settle down".

There’s a basic principle followed by Unison: correct definitions should never * require* upgrading. Though this sounds like it should be a given, existing language tooling does a poor job here and forces upgrade work for things like name changes, moving definitions, repurposing names for a new definition (even when the old definition is valid), and more. We can do better in Unison.

## A lot of churn is artificial

In language ecosystems, library authors are regularly releasing new versions. Every time a new version arrives, any dependent libraries and applications need to upgrade if they want the latest features and fixes. Sometimes the new version is significantly incompatible with the old one, in which case authors will do "point releases" and backport some of the improvements to a backward-compatible version, but there’s a limited amount of this that can happen and it’s extra work for the maintainers.

Just keeping up with library version churn can be lots of work. Some users are happy to do this because they get new functionality and bugfixes; other users are less happy, especially if they're just consuming a small and stable portion of a library. "Why am I forced to upgrade just because some functions I'm not even using got updated?" Library version churn is one reason why people are loath to add new dependencies and they resort to "vendoring" (copying and pasting library code into their codebase).

We should not have to force upgrades of correct code. Existing languages don't (or can't) uphold this principle because of how they're designed. With Unison's design, we can eliminate these needless sources of churn:

### Definitions getting renamed or moved

When a library's definitions change names or move elsewhere (perhaps spun off into a separate library), users get a tedious textual find/replace task to bring their code up to date. The definition is still correct and hasn't changed; it just has a new name. Since Unison definitions reference each other by hash instead of by name, any moving or renaming breaks no code and generates no upgrade work for users.

### Incompatible library versions

Many systems make it inconvenient or impossible to use multiple versions of a library in the same codebase, because all the library versions "compete" for the same names. That seems silly; why do different definitions compete for the same names anyway? Because the code is stored as text and all references are by name. If you don't use the same names for each version, users will have a bunch of manual work to upgrade to the latest version, just like they would for any other name change. Unison solves this as before: by representing the codebase in a more structured way and referencing definitions by hash.

### Upgrades of stuff you don't care about

Tracking dependencies at the level of whole libraries is imprecise and generates needless pressure to upgrade. You may be using 3 functions from Alice’s library and would prefer to hold off on upgrades except for bugfixes to the functions you're actually using. But there's a problem: If _any_ of the libraries that depend transitively on Alice get an upgrade you want, then you must upgrade your usage of _all_ these libraries (including Alice's), since multiple library versions can't peacefully coexist. This churn becomes increasingly likely because libraries batch together lots of definitions, fixes, and improvements. In Unison, dependencies are tracked at the level of individual definitions, not whole packages. Multiple library versions can coexist, so you can grab the latest version of a library (to get new stuff you like) and continue using the old.

### Names getting repurposed

Names are regularly _repurposed_ to point to new definitions, even when the old definitions are still perfectly valid. For instance, a library author might make a function a bit more generic by adding an extra parameter, or decide to switch the parameter order. That's fine, but the old definition was not wrong, so should users be forced to upgrade? No.

Repurposing names is fine; it's hard to come up with good names for definitions, so using an old name for a related new definition often makes sense. The trouble is that _existing tooling doesn't distinguish between repurposing a name and upgrading a definition._ Unison changes that by making a distinction:

1. You can change the name of a definition or repurpose a name as often as you like.
2. You can choose to replace one definition with another, because the old definition is buggy or invalid.

You change or repurpose Unison names just by editing the namespace directly with `move.term`, `delete.type`, and related commands in the Codebase Manager. Separately, replacements are tracked in Unison _patches_ which are built up using distinct commands: `update`, `replace.term`, etc. Library authors use patches to let their users upgrade code from one version of the library to another. Patches identify their replacements by hash instead of by name, so they too are unaffected by any name shuffling.

Though existing tooling conflates these two activities, replacing one definition with another (because the old definition is invalid) is actually different from repurposing a name (because the authors feel a name is better suited for a different definition). Keeping these concepts separate eliminates a lot of needless churn and gives library authors a lot more options.

## Learn more

If this sounds interesting to you and you'd like more information on how it all plays out, either as a library consumer or a library author, see the documentation on [organizing your codebase](/docs/codebase-organization).
