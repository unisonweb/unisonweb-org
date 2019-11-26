---
title: The joy of refactoring a Unison codebase
description: At Scale By the Bay 2019 we gave a talk on Unison's unique approach to refactoring. This post gives a brief overview of how it works.
date: 2019-11-26
categories: ["news"]
featuredImage: /media/thing10.svg
---

At [Scale By the Bay this month](https://www.youtube.com/watch?v=IvENPX0MAZ4) we gave a talk on Unison's unique approach to refactoring. Unison takes a different approach to refactoring and updating code: rather than modifying definititons in place, which generates lots of (often misleading) compile errors and prevents you from running or writing other code, Unison refactoring is a structured process whereby a new, compiling version of the code is built up incrementally off to the side. We like this process much better and it has significant benefits:

* A Unison codebase is always runnable and never broken, even when in the middle of a refactoring.
* There's no need to "upgrade your whole codebase" just to be able to test out or play with a code change within some smaller context.

If you're interested in learning more about this, see [the SBTB talk](https://www.youtube.com/watch?v=IvENPX0MAZ4) and also check out the newly added [docs on refactoring](/docs/refactoring). The documentation goes through a longer worked example.

One very common refactoring which Unison makes quite easy is updating a pure function to one that uses abilities like `IO`. For those who have used Scala or Haskell, you might have bad memories of tedious refactoring converting pure code to monadic, which involves switching from pure to monadic syntax and updating a bunch of type signatures, often all along an entire dependency chain. It's not very fun. 😬 In Unison, this work just vanishes and ability requirement changes can be propagated automatically. See [the docs to learn more about this](/docs/refactoring).
