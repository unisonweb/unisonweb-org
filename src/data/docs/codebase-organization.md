---
title: Organizing your codebase
description: How to organize your Unison namespace tree to support multiple workstreams, releases, external dependencies, and pull requests.
---

# Organizing your codebase

Though the Unison namespace tree can be organized however you like, this document suggests handy conventions to keep things tidy even with multiple concurrent workstreams, pull requests, library releases, and external dependencies being added and upgraded. We like conventions that can be followed without much thought and which make things easy, so you can direct your brainpower to actually writing Unison code, not figuring out how to organize it. 😀

We recommend using this exact same set of conventions for library maintainers, library contributors, and application developers. It makes it easy to follow the conventions regardless of which of these roles you are working in, and doesn't require reorganizing anything if you decide you want to publish your personal Unison repository as a library for others to build on.

Without further ado, here's what a namespace tree will look like that follows these conventions. This will be explained more below, and we'll also show how common workflows (like installing and upgrading libraries and opening pull requests) can be handled with a few UCM commands:

    trunk/
      List/
      Nat/
      ...
      README : Doc
      releaseNotes : Doc
      _changelog/
    
    external/
      dependency1.v7/
      alice.mylib.v94/
      alice.mylib.v87/
      bob.somelib.trunk/

    prs/
      _closed/
        _y2020_m03_d27_frobnicator_new
        _y2020_m04_d02_quaffle_new
      _somePR
      ...
              
    releases/
      _v1/
      _v2/
      ...

Directly under the namespace root, we have a `trunk` (sub-)namespace (for the latest stable code), an `external` namespace (for external dependencies), a `prs` namespace (for pull requests in development, to be merged into `trunk` or to some external dependency once ready), and a `releases` namespace (for stable releases, forked off `trunk`).

If you're including multiple projects in the same Unison codebase (often the case for your personal Unison repo, which has forks of multiple other projects), you can nest the above structure in namespaces under the root:

    _project1/
      trunk/
      releases/
      ...
    _project2/
      trunk/
      releases/
      ...

> 🏗 The various namespaces starting with `_` is a naming convention signifying an "archived namespace". A future version of Unison will make the contents of archived namespaces invisible unless you `cd` into them (see [this ticket](https://github.com/unisonweb/unison/issues/1340) to track). 

Let's now look at some common workflows:

* [Installing a library](#installs)
* [Day-to-day development: creating and merging pull requests](#prs)
* [Using an unreleased library](#using-unreleased)
* [Creating a release](#releases)

> 🐘 __Reminder:__ If you ever goof anything up while doing these commands, never fear! Just use the [`reflog` command](/docs/commands#reflog) to review your local command history and switch your namespace tree back to an earlier point in history.

<a id="installs"></a>

## Installing a (released) library

Just use `pull` into your `external` namespace. Library authors will publish the exact `pull` command to tell people how to fetch the latest release (recommended convention is to put this in the README of the Git repository where the Unison codebase is hosted), but it will look something like:

```ucm
.> pull https://github.com/alice/mylib:.releases._v6 .external.alice.mylib.v6 
```

There's nothing magic happening here, this "installation" process is just including part of the remote namespace tree locally so it can be referenced by new code. Note that in this command, the release isn't put in an archived namespace, so it can be seen by the `find` command, located during parsing of scratch files, and so on.

### Upgrading to the latest version

There's no problem with having multiple versions of a library installed at once, though sometimes you want to upgrade to the latest version of a library and delete any references to the old version. There are a couple cases you can encounter here. If `alice.mylib.v6` is a superset of `alice.mylib.v5`, this is as simple as just deleting the `v5` after `v6` is installed.

> 😎 Since references to definitions are by hash, not by name, any renaming of definitions done between `v5` and `v6` of a library won't break any of your code. Though we recommend reading the release notes to discover these sorts of changes, or using `diff.namespace somelib.v5 somelib.v6` for an overview.

If `v6` replaced any definitions with new ones (using the `update` command or `replace.term` or `replace.type`), these are recorded in a _patch_ ([more background on refactoring and patches in Unison](/docs/refactoring/)) which can be applied locally. As a norm, `alice.mylib.v6.releaseNotes` will cover how to apply patches to your local namespace. It will typically be commands like:

```ucm
.> fork trunk prs.upgradeAliceLib
.> patch external.mylib.v6.patches.v5_v6 prs.upgradeAliceLib
```

Assuming all is well after that `patch`, you can `merge prs.upgradeAliceLib trunk` back to trunk (and then `merge trunk` into any other pull requests being drafted).

<a id="prs"></a>

## Day-to-day development: creating and merging pull requests 

Rather than making changes directly to `trunk`, we recommend drafting changes to `trunk` in the `prs` namespace. This makes it very easy to switch between workstreams at any time and keep everything straight, and it keeps `trunk` stable. There's two kinds of changes: _new definitions_, and _updates_.

For new definitions (say we'd like to add a function `List.frobnicate` to `base`) just create the definition in `.prs._myPR.List.frobnicate`. Other definitions can be added under `prs._myPR`, with a namespace structure that parallels the target namespace where you'd like to merge.

> 🧐 We use an archived namespace for the PR itself so the definitions there don't pollute the namespace and are only visible if you're actively working on the PR by `cd`-ing into it.

For _updates_ to a namespace, you can `.> fork trunk prs._myOtherPR` and then use `.prs._myOtherPR> update` to make changes to the namespace.

> 🍏 When you're done developing your changes, you may also want to add a writeup for the PR of type [`Doc`](/docs/documentation) in `.prs._myPR._changelog`. Name the writeup `y2020_m03_d27_myPR`, using the date (year, month, day) the PR was created and the PR name. When this gets merged it will become part of the changelog of the target namespace, which can be viewed (in order) just using `ls _changelog` or `find`.

Once your change is looking good, you have a few ways of getting it into `trunk`:

1. If you're the sole maintainer, you can merge it to `trunk` yourself:

  * `.> merge prs._myPR trunk` You can alternately do the merge in a staging namespace with:
      * `.> fork trunk prs.merged_myPR`
      * `.> merge prs._myPR prs.merged_myPR` and then assuming that looks good `.> merge prs.merged_myPR .trunk`
  * `.> move.namespace prs._myPR prs._closed._y2020_m03_d27_myPR` to archive it with the current date
  * `.> push <remoterepo>`

2. If you are collaborating with others and want a fellow committer / maintainer to review and merge:

  * `.> push <sharedgitrepo>`
  * Create a GitHub issue (that's right, an _issue_, not a pull request) and in the issue body, say:
    * Local path to your PR: `prs._coolFeature`
    * The proposed `merge` command assuming the change passes review: `merge prs._coolFeature trunk`
    * The writeup. If the writeup was done as a Unison [`Doc`](/docs/documentation), you can use `display` command on it to produce something that can be pasted into the GitHub issue.
    * The output of the command `diff.namespace trunk prs._coolFeature` for quick review of what's actually changed.
    * The reviewer will merge and archive the PR as in 1), and close the issue afterwards.

3. If you are proposing the change for one of your dependencies or if you aren't a maintainer of the place you'd like to merge, use the `pull-request` command to propose the change. Below is a typical usage of `pull-request.create` that proposes merging something to `base`:

```ucm
.> pull-request.create https://github.com/unisonweb/base:.trunk https://github.com/myusername/myrepo:._prs.someTopic
```

This will create some output. Copy that output to your clipboard. Next, create a GitHub issue in the repo where you're proposing the change (that's right, an _issue_, __not__ a GitHub PR). Make the issue title something descriptive, and for the issue body, paste in the output generated by `pull-request.create` as well as any additional commentary on the change, just like you would for any other pull request.

<a id="syncing"></a>

### Keeping in sync with `trunk`

Periodically, you can `pull` the latest `trunk` using:

```ucm
.> pull https://gitub.com/unisonorama/myproject trunk
```

Here's how you can bring in-progress PRs up to date:

* For __update__ PRs that are forks of the old `trunk`, you can `.prs._myPR> merge .trunk` to bring them up to date. 
* For PRs with __new definitions only__, generally no action is needed unless the new definitions depend on something that's just been updated in `trunk`. In this case, you can do `.prs._myPR> patch .trunk.patch`. It's also not harmful to do this regardless; it will only have an effect if the patch in `trunk` updates a dependency of the definitions in the PR.

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
1. Fork a copy of `trunk`: `.> fork trunk releases._v12`
2. Include the current dependencies in the release: `.> fork external releases._v12._external`. This ensures that anyone who obtains your library also receives its dependencies and the naming you had for those definitions at the time. (Would be great to minimize `_external` to just what's needed transitively by `trunk`, but this could come later)
3. Create / update `releases._v12.releaseNotes : Doc`. Suggested content to include in this:
  * A link to previous release notes (`releases._v11.releaseNotes`) at the end.
  * The current namespace hash of `releases._v12` (accessible via `.releases._v12> history`), so it's clear from the notes alone exactly what version of the code they refer to.
  * If the release has a non-empty `patch`, give some guidance on upgrading. Are all the edits type-preserving? If no, what sort of refactoring will users have to do? 
  * How stable is the API? Do you anticipate many changes going forward? Is it a significant release? Should everyone upgrade?
4. Reset the patch and release notes in `trunk`: `.trunk> delete.patch patch` and `.master> delete.term releaseNotes`. Anyone can upgrade from a past release, `v3`, by applying the patches `releases._v4.patch`, `releases._v5.patch` up through `releases._v12.patch`.
  * If desired, you can also produce cumulative patches for skipping multiple versions. These can be published on an ad hoc basis. If publishing these, just include them in `releases._v12.patches.v4_to_v12`.
5. Update the README on the repo's GitHub to say that the latest release can be gotten via: `.> pull https://github.com/unisonweb/base:.releases._v12 external.base.v12`. You can also let folks know about the release via any other communication channels (Twitter, Slack, etc).

We don't recommend any fancy numbering scheme for versioning, just increment the version number. Use the `releaseNotes` to convey metadata and additional nuance about each release.

### Backporting fixes

Creating a bugfix release works the same way. Suppose the `v12` release has a bug. The bug has been fixed in the latest `trunk` and you'd like to backport it. Instead of forking `trunk`, instead `fork releases._v12 releases._v12a` (then `_v12b`, `_v12c`, etc). Then backport the fix to the `_v12a` namespace, and continue with the release steps as before.

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

