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

### 🧪 `atacratic/unison-datetime`: Date and time

[This one](https://github.com/atacratic/unison-datetime) is currently just a design - code is TODO!

### 🚢 `atacratic/unison-random-mersenne`: Pseudo-random number generator using the Mersenne Twister algorithm

[This library](https://github.com/atacratic/unison-random-mersenne) implements a widely-used PRNG algorithm, giving you a deterministic stream of pseudo-random numbers based on a seed of your choice.  Suitable for statistical purposes (e.g. Monte Carlo sampling).  To fetch the latest version (v1), do:

```ucm
pull https://github.com/atacratic/unison-random-mersenne.git:.releases._v1 external.unison_random_mersenne.v1
```

### 🚢 `bascott/unison-continuations`: Continuations as an ability

[This library](https://github.com/bascott/unison-continuations) includes the ability to substitute one computation with another regardless of where you are in your current computation. Includes the implementation of control operators such as callCC. To fetch the latest version (v1), do:

```ucm
pull https://github.com/bascott/unison-continuations:.releases._v1 external.continuations.v1
```

### 🚢 `emiflake/unison-json`: Elm-like JSON decoders

[This library](https://github.com/emiflake/unison-json) implements a JSON parser and Decoders to convert JSON values into Unison values using the applicative style. To fetch the latest version (v0), do:

```ucm
pull https://github.com/emiflake/unison-json:.releases._v0 external.json.v0
```

### 🚢 `unisonweb/base`: builtin types and functions, basic data structures, algorithms, and `IO`

[This library](https://github.com/unisonweb/base) includes all builtin functions, basic data structures and algorithms, and `IO`. To fetch the latest version (M1l), do:

```ucm
pull https://github.com/unisonweb/base:.releases._M1l external.base.M1l
```
