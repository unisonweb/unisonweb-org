---
title: Organizing your codebase
description: How to organize your codebase, install dependencies, create and review pull requests, and make releases
---

# Organizing your codebase

Though the Unison namespace tree can be organized however you like, this document suggests handy conventions to keep things tidy even with multiple concurrent workstreams, pull requests, library releases, and external dependencies being added and upgraded. We like conventions that can be followed without much thought and which make things easy, so you can direct your brainpower to actually writing Unison code, not figuring out how to organize it. 😀

We recommend using this exact same set of conventions for library maintainers, library contributors, and application developers. It makes it easy to follow the conventions regardless of which of these roles you are working in, and doesn't require reorganizing anything if you decide you want to publish your personal Unison repository as a library for others to build on.

> 🖋  This documentation is still in draft form. Please help test out these conventions and let us know how they work for you. Also any general feedback or questions are welcome! See [this ticket](https://github.com/unisonweb/unison/issues/1409) or start a thread [in Slack #alphatesting](/slack).

Here's what a namespace tree will look like that follows these conventions. This will be explained more below, and we'll also show how common workflows (like installing and upgrading libraries and opening pull requests) can be handled with a few UCM commands:

    trunk/
      List/
      Nat/
      ...
      README : Doc
      releaseNotes : Doc
    
    external/
      dependency1.v7/
      alice.mylib.v94/
      alice.mylib.v87/
      bob.somelib.trunk/

    prs/
      _myGreatPR
      _anotherNewFeature
      ...
              
    releases/
      _v1/
      _v2/
      ...
    
    series/
      _v1/
      _v2/
      ...

Directly under the namespace root, we have a `trunk` (sub-)namespace (for the latest stable code), an `external` namespace (for external dependencies), a `prs` namespace (for pull requests in development, to be merged into `trunk` or to some external dependency once ready), a `series` namespace (for releases branches, forked off `trunk`), and a `releases` namespace, contained released versions of trunk.

> 🏗 The various namespaces starting with `_` is a naming convention signifying an "archived namespace". A future version of Unison will make the contents of archived namespaces invisible unless you `cd` into them (see [this ticket](https://github.com/unisonweb/unison/issues/1340) to track). 

Let's now look at some common workflows:

* [Installing a library](#installs)
* [Day-to-day development: creating and merging pull requests](#prs)
* [Using an unreleased library](#using-unreleased)
* [Creating a release](#releases)

> 🐘 __Reminder:__ If you ever goof anything up while doing these commands, never fear! Just use the [`reflog` command](/docs/commands#reflog) to review your local command history and switch your namespace tree back to an earlier point in history.

<a id="installs"></a>

## Installing a library is easy, just `pull`

Just use `pull` into your `external` namespace. Library authors will publish [the exact `pull` command to tell people how to fetch the latest release](/docs/libraries), but it will look something like:

```ucm
.> pull https://github.com/alice/mylib:.releases._v6 .external.alice.mylib.v6 
```

There's nothing magic happening here, this "installation" process is just including part of the remote namespace tree locally so it can be referenced by new code. Note that in this command, the release isn't put in an archived namespace, so it can be seen by the `find` command, located during parsing of scratch files, and so on.

### Upgrading libraries to the latest version

There's no problem with having multiple versions of a library installed at once, though sometimes you want to upgrade to the latest version of a library and delete any references to the old version. There are a couple cases you can encounter here. If `alice.mylib.v6` is a superset of `alice.mylib.v5`, this is as simple as just deleting the `v5` after `v6` is installed.

> 😎 Since references to definitions are by hash, not by name, any renaming of definitions done between `v5` and `v6` of a library won't break any of your code. Though we recommend reading the release notes to discover these sorts of changes, or using `diff.namespace somelib.v5 somelib.v6` for an overview.

If `v6` replaced any definitions with new ones (using the `update` command or `replace.term` or `replace.type`), these are recorded in a _patch_ ([more background on refactoring and patches in Unison](/docs/refactoring/)) which can be applied locally. As a norm, `alice.mylib.v6.releaseNotes` will cover how to apply patches to your local namespace. It will typically be commands like:

```ucm
.> fork trunk prs.upgradeAliceLib
.> patch external.mylib.v6.patches.v5_v6 prs.upgradeAliceLib
.> merge prs.upgradeAliceLib trunk
```

<a id="prs"></a>

## Day-to-day development: creating and merging pull requests 

Here's the basic workflow for drafting changes to `trunk`. It's not much different than a typical Git workflow, where you create branches, hack on them, then merge them to `master` / `trunk` when done: 

1. `.> fork .trunk .prs._myCoolPR`
2. `.> cd .prs._myCoolPR` and hack away. Use `diff.namespace .trunk .prs._myCoolPR` at any time to see what you've changed.
3. `.> merge .prs._myCoolPR .trunk` when you're done

> 🧐 We use an archived namespace for the PR itself so the definitions there don't pollute the namespace and are only visible if you're actively working on the PR by `cd`-ing into it.

To propose changes to another Unison codebase works similarly. We'll use [the Unison base library](https://github.com/unisonweb/base/blob/master/CONTRIBUTING.md) as an example:

1. `.> pull https://github.com/unisonweb/base:.trunk _base` (you can do this both for initial fetch and for subsequent updates)
2. `.> fork _base .prs.base._mything` to create a copy of `_base`. You can create multiple forks in `.prs.base`, if you have multiple things you're working on.
3. If you haven't already done so, set your default license for `.prs.base` to match the license of the codebase you're contributing to (for [base](https://github.com/unisonweb/base/blob/master/CONTRIBUTING.md) it's the MIT license). See [these instructions on how to configure just a sub-namespace with a different license](https://www.unisonweb.org/docs/configuration/#setting-default-metadata-like-license-and-author).
4. Now `cd .prs.base._mything` and hack away as before. At any time review what's changed between your namespace and `_base` with `diff.namespace ._base .prs.base._mything`.
5. Push your forked version somewhere public. Suggestion: just mirror your root Unison namespace to a git repo `.> push git@github.com:mygithubname/allmyunisoncode`. No need to maintain a separate Git repo for every Unison library you want to contribute to.
6. `.prs.base._mything> pull-request.create https://github.com/unisonweb/base:.trunk https://github.com/myuser/allmyunisoncode:.prs.base._mything` and this will create some output. Copy that output to your clipboard. We don't literally use the GitHub pull request mechanism for Unison repositories, we use GitHub issues instead.
7. Next, create a GitHub issue in the repo you're submitting the code to (that's right, an _issue_, __not__ a GitHub PR). Many Unison repositories will have [a GitHub issue template](https://github.com/unisonweb/base/issues/new?template=unison-pull-request-template.md) for this purpose. Make the issue title something descriptive, and for the issue body, paste in the output generated by `pull-request.create` as well as some text describing the change, just like you would for any other pull request.
8. Use the GitHub issue comments for coordinating the review. Once merged, the maintainer will close the issue.

This workflow also works fine even if the source and destination repository are the same, so you might use the above PR process when suggesting changes to a library that you maintain with other people.

### Reviewing pull requests

We'll use [this issue as an example](https://github.com/unisonweb/base/issues/12). The issue created for the PR will have a `pull-request.load` command to review the PR locally. We'll run that command in any empty namespace:

```ucm
.review.pr12> pull-request.load https://github.com/unisonweb/base:.trunk https://github.com/pchiusano/unisoncode:.prs.random2
```

If you `.review.pr12> ls` you'll see three or four sub-namespaces: `base` (the original namespace), `head` (the new namespace), `merged` (the result of `merge head base`) and potentially `squashed` (the same content as `merged` but without intermediate history). The following commands can be performed against either the `merged` or `squashed` namespace, depending on if preserving history is important to you: 

1. `.review.pr12> diff.namespace base merged` to see what's changed. The numbered entries in the diff can be referenced by subsequent commands, so `diff.namespace base merged` might be followed by `view 1-7` to view the first 7 definitions listed there.
2. You can use comments on the GitHub issue to coordinate if there's any changes you'd like the contributor to make before accepting the PR. You can also make changes directly in `merged`.
3. `.review.pr12> push git@github.com:unisonweb/base:.trunk merged` to push `merged` to `trunk`
4. `.review.pr12> history merged` and copy the top namespace hash. That's the Unison namespace hash as of the merged PR. Then close the GitHub issue with a comment like "Merged to trunk in hash #pjdnqduc38" and thank the contributor. 😀 If you ever want to go back in time, you can say `.> fork #pjdnqduc38 .pr12` to give the `#pjdnqduc38` namespace hash the name `.pr12` in your tree.
5. If you like, `.> delete.namespace .review.pr12` to tidy up afterwards.

<a id="syncing"></a>

### Keeping in sync with `trunk`

Periodically, you can `pull` the latest `trunk` using:

```ucm
.> pull https://gitub.com/unisonorama/myproject trunk
```

If you have in-progress PRs that you want to sync with the latest, you can bring them up to date using `.prs._myPR> merge .trunk`.

<a id="using-unreleased"></a>

## Using unreleased library versions

Sometimes, you want to use some code that's only in `trunk` of a library but hasn't made its way into a release. No problem. The install process looks the same, just do a `pull`:

```ucm
.> pull https://github.com/bob/mylib:.trunk .external.bob.mylib.trunk
```

As often as you like, you can re-issue the above command to fetch the latest version of the library. After doing so, you should then apply patches from the library to your local namespace. Check the project's README for information on how to do this, but typically, for a namespace, `bob.mylib.trunk`, there will just be a patch called `bob.mylib.trunk.patch` which can be applied with:

```ucm
.> fork trunk prs.upgradeBob
.> patch external.bob.mylib.trunk.patch prs.upgradeAliceLib
```

Assuming all is well after that `patch`, you can `.> merge prs.upgradeBob trunk` (and then sync that with any other PRs being drafted, as discussed in the previous section).

If you are feeling adventurous it's also possible to directly apply the patch to your in-progress PRs or even `trunk`.

<a id="releases"></a>

## How to create a release

Suppose you are creating `v12` of a library. The process is basically to `fork` a copy of `trunk`:

0. Before getting started, we suggest reviewing the curent patch in `trunk` with `.> view.patch trunk.patch`. The term and type replacements listed here should generally be bugfixes or critical upgrades that you expect users of your library to make as well. You can use `delete.term-replacement` and `delete.type-replacement` to remove any entries you don't want to force on library users. See [below](#patches) for more.
1. Fork a copy of `trunk`: `.> fork trunk series._v12`
2. Include the current dependencies in the release: `.> fork external series._v12._external`. This ensures that anyone who obtains your library also receives its dependencies and the naming you had for those definitions at the time. (Would be great to minimize `_external` to just what's needed transitively by `trunk`, but this could come later)
3. Create / update `series._v12.releaseNotes : Doc`. You can include the current namespace hash of `series._v12`, a link to previous release notes (`releases._v11.releaseNotes`), and if the release has a non-empty `patch`, give some guidance on upgrading. Are all the edits type-preserving? If no, what sort of refactoring will users have to do? 
4. `squash series._v12 releases._v12` to create the release. This squashed `releases._v12` will have no history and is more efficient for users to `pull` into their codebase.
5. Reset the patch and release notes in `trunk`: `.trunk> delete.patch patch` and `.master> delete.term releaseNotes`. Anyone can upgrade from a past release, `v3`, by applying the patches `releases._v4.patch`, `releases._v5.patch` up through `releases._v12.patch`.
  * If desired, you can also produce cumulative patches for skipping multiple versions. These can be published on an ad hoc basis. If publishing these, just include them in `releases._v12.patches.v4_to_v12`.
6. Optional: you can add updated instructions for fetching the release to [the libraries page](/docs/libraries/) and also update the README on the repo's GitHub. You can also let folks know about the release via any other communication channels (Twitter, Slack, etc).

We don't recommend any fancy numbering scheme for versioning, just increment the version number. Use the `releaseNotes` to convey metadata and additional nuance about each release.

### Backporting fixes

Creating a bugfix release works the same way. Suppose the `v12` release has a bug. The bug has been fixed in the latest `trunk` and you'd like to backport it. Just backport the fix to the `series._v12` namespace and continue with the release steps as before, but this time create `releases._v12a` (then `_v12b`, `_v12c`, etc).

<a id="patches"></a>

### Patch management

> 🖋  This section is in draft form and undergoing revisions for clarity. Feedback and questions are welcome! See [this ticket](https://github.com/unisonweb/unison/issues/1409).

Patches are collections of mappings from old hash to new hash (these entries are called "replacements"). We've seen above how these patches can be applied to upgrade a namespace using these replacements. The patches are built up via `update` or `replace.term` or `replace.type` commands which add replacements to a default patch (called "patch") that exists under each namespace in the tree. You can view this or any other patch using `view.patch`:

```ucm
.mylib.trunk> view.patch patch

  Edited Terms: List.frobnicate#92jajfh197 -> List.frobnicate
  Edited Terms: CinnamonRoll#93jg10ba -> SugarCookie

  Tip: To remove entries from a patch, use delete.term-replacement or 
       delete.type-replacement, as appropriate.
```

> 🤓 The `update` and `replace.term` and `replace.type` commands also take an optional patch name, if you want to build up a patch somewhere other than the default patch. This is handy for keeping logically unrelated patches separate. You can also `move.patch` and `delete.patch`.

#### Release patches

There are a lot of reasons you might add replacements to a patch during the course of development (see the [development patches](#dev-patches) section below), but for patches published with a release, it's recommended to limit the replacements to cases where the old definition is invalid or would never be preferred the new version (generally just bugfixes for previously released definitions, performance improvements, and critical upgrades). Why do this? Because it makes things a lot easier for your users and avoids needless churn.

In other languages, where definitions are identified by name and the codebase is just mutated in-place, every change to the codebase amounts to a forced upgrade for users. We don't often think of it this way, but by updating `List.frobnicate`, the old version of `List.frobnicate` is effectively _deleted_ and no one gets to reference the old definition of `List.frobnicate` (unless they literally go through the Git history and bring it back somehow). Very often this is done _not_ because the old version is wrong or should never be used, but because we don't feel like coming up with another name for the new definition and decide to just repurpose an existing name. 

When this name repurposing is done for definitions that have already been released, it generates work that often isn't necessary.

<a id="repurposing-names"></a>In Unison, the decision to repurpose a name is _completely separate_ from the decision to force an upgrade on users. If you want to repurpose a name like `List.frobnicate` but the old definition is still valid (ask yourself "could someone reasonably still build on the old definition, or is the new definition always preferable?"), you can first delete the old definition (via `delete.term`), or archive it by moving it to `_archive.y2020_m03_d24_frobnicate`, timestamped with the current date. Then create the new definition for `List.frobnicate`.

If you've already done an `update`, no problem. Just use `delete.term-replacement` or `delete.type-replacement` to remove replacements from the patch before release.

Here are a few common types of updates that won't usually be part of a release patch, but will instead be part of a [development patch](#dev-patch), covered next:

* Adding a parameter to a function to make it more generic: typically the less generic version is still perfectly valid
* Changing the order of parameters: typically the previous argument order is still perfectly valid
* Changing the type of the function: generally, when this is done, the function is actually doing something different

Release patches typically contain bugfixes, performance improvements, or critical updates (say some code depends on an external service, and that external service has a different interface now, invalidating the old code).

<a id="dev-patches"></a>

#### Development patches

During development, new, unreleased definitions may get updated or refactored multiple times before making it into a release, for instance:

* An unreleased definition may have a bug that gets fixed before release. A patch records this bugfix.
* An unreleased definition may be stubbed out (using the `todo` function) then the stubbed definition later filled in. A patch records this replacement.
* Definititons may be refactored multiple times before being released, and these refactorings are recorded in a patch so all the developers on the release can easily stay up-to-date.

With some simple steps, you can make it easy to keep your release patch clean so when it comes time to [make a release](#releases), the default patch in `.trunk.patch` is totally clean and just includes the replacements you want all users to make in their code:

* When developing new definitions to be added to `trunk`, do it in a separate namespace under `prs`, say `prs._myNewStuff` (as discussed in the [day-to-day workflows section](#prs)). Within this namespace, use `update`, `replace.term` and `replace.type` as much as you like. When you're ready to merge, just `delete.patch prs._myNewStuff.patch`.
* For other development patches, like bugfixing an unreleased definition in `trunk`, or replacing a stub, use a separate named development patch for it rather than the default patch that becomes the release patch during the [release process](#releases). We recommend `update .trunk.patches.dev` for the default development patch. Anyone with in-progress pull requests can apply this patch to their work. It can be archived and reset periodically.
* When repurposing the name of a released definition, use the [repurposing names](#repurposing-names) steps covered above rather than using `update` on it.
* For updates to released code that all users should make (like bugfixes or performance improvements), go ahead and do an `update` of the default patch. Note that if you `fork trunk prs._somePR`, then do your updates in `_somePR`, when that namespace is merged back into trunk, the updates you made to the default patch will arrive there as well.

