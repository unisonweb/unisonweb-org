---
title: Unison code catalog
description: A list of open-source Unison code
slug: libraries
---

# Unison code catalog

This page has a catalog of Unison libraries, experiments, and other Unison-related projects. The entries in this catalog can be found using the docs search bar above. If you're working on something in Unison, you can share it here by [opening a pull request](https://github.com/unisonweb/unisonweb-org/edit/master/src/data/docs/libraries.md).

Tag each entry in the catalog with one of the following icons:

* 🧪 __(tinkering):__ Just playing around, doing research, or exploring. Possibly still lots of design churn. Might not turn into a "real" library.
* 🏗 __(pre-release):__ Basics of the library are in place and you're working on getting a release ready. You might encourage other people to try out these pre-release versions.
* 🚢 __(released):__ You've released at least one version of the project. It's recommended that releases follow the conventions in [this document](/docs/codebase-organization).
* ⛰ __(super stable):__ A library that changes rarely and is quite stable.

There's active discussion of new library work in the [`#hackathon` channel on Slack](/slack).

This list is in alphabetical order by (user/repo). Each entry has a super brief description in the heading (since headings are indexed by the site-wide search), then a tweet-length blurb about the library which links to the code, then instructions on how to fetch the latest version.

### 🚢 `unisonweb/base`: builtin types and functions, basic data structures, algorithms, and `IO`

[This library](https://github.com/unisonweb/base) includes all builtin functions, basic data structures and algorithms, and `IO`. To fetch the latest version (M1l), do:

```ucm
pull https://github.com/unisonweb/base:.releases._M1l external.base.M1l
```
