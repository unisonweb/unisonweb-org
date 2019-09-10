---
title: Introduction
description: placeholder
---

# Introduction

This document introduces "the big idea" behind Unison and walks through the basics of using the Unison codebase manager to develop and publish your first Unison library. We will introduce bits and pieces of the core Unison language and its syntax as we go. The [Unison language reference][langref] is a more in-depth resource on this if you have questions or want to learn more.

If you want to follow along with this document (highly recommended), this guide assumes you've already gone through the steps in [the quickstart guide](quickstart.html).

The source for this document is [on GitHub][on-github]. Feedback and improvements are most welcome!

[repoformat]: https://github.com/unisonweb/unison/blob/master/docs/repoformats/v1-DRAFT.markdown
[on-github]: https://github.com/unisonweb/docsite/blob/gh-pages/_includes/unisontour.markdown
[roadmap]: roadmap.html
[quickstart]: quickstart.html
[langref]: /docs/language-reference
[editorsetup]: editorsetup.html
[manager]: /docs/tour/hello-ucm

## The most important goal

If there is one motivating idea behind Unison, it's this: the technology for creating software should be _thoughtfully crafted_ in all aspects. Needless complexity and difficulties should be stripped away, leaving only that exhilarating creative essence of programming that made many of us want to learn this subject in the first place. Or at the very least, if we can't have this, let's have programming be _reasonable_. The fact that things were done a certain way in the 1970s is not a good reason to keep doing them, especially if they make programming worse.

Sure, it's sensible to make compromises regarding when and where to innovate, rather than trying to revolutionize everything right now. But let's be honest that it's a compromise, and not forget to improve things later.

## 🧠 The big technical idea

Now, if there is one big _technical_ idea behind Unison, explored in pursuit of the overall goal of making programming better, it's this: __Unison definitions are identified by content.__ Each Unison definition is some syntax tree, and by hashing this tree in a way that incorporates the hashes of all that definition's dependencies, we obtain the Unison hash which uniquely identifies that definition. This is the basis for some serious improvements to the programmer experience: it eliminates builds and most dependency conflicts, allows for easy dynamic deployment of code, typed durable storage, and lots more.

When taken to its logical endpoint, this idea of content-addressed code has some striking implications. Consider this: if definitions are identified by their content, _there's no such thing as changing a definition_, only introducing new definitions. That's interesting. What may change is how definitions are mapped to human-friendly names. For example, `x -> x + 1` (a definition) as opposed to `Nat.increment` (a name we associate with it for the purposes of writing and reading other code that references it). An analogy: Unison definitions are like stars in the sky. We can discover the stars in the sky and pick different names for these stars, but the stars exist independently of what we choose to call them.

But the longer you spend with the odd idea of content-addressed code, the more it starts to take hold of you. It's not arbitrary or strange, but a logical and sensible choice with tremendous practical benefits. You start to appreciate the simplicity of the idea and see the need for it everywhere ("this would be a lot easier if the code were content-addressed..."). Is it really feasible, though, to build a programming language around this idea?

Part of the fun in building Unison was in working through the implications of what seemed like a great core idea. A big question that arose: even if definitions themselves are unchanging, we do sometimes want to change which definitions we are interested in and assign nice names to. So how does that work? How do you refactor or upgrade code? Is the codebase still just a mutable bag of text files, or do we need something else?

We __do__ need something else to make it nice to work with content-addressed code. In Unison we call this something else the _Unison Codebase Manager_.

__Next:__ [👋 to the Unison codebase manager][manager].
