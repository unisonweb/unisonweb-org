---
title: Roadmap
description: placeholder
---

# Roadmap

Thanks for participating in alpha testing of Unison. This document has a quick project status update and rough roadmap for future work so you have some idea of what to expect.

## What's in this release?

This alpha release (which we're calling "Milestone 1" or "M1") is mostly focused on the core Unison language and its tooling. With this release, you should be able to to write new Unison code using other Unison libraries and publish new code yourself. The tools you'll use for this are just your preferred text editor and the _Unison codebase manager_. The codebase manager is an all-in-one tool you'll get to know well that handles everything other than text editing related to working with Unison code: typechecking it, running it, browsing the codebase, refactoring, publishing, and so on.

There's very few libraries in this M1 release and the distributed programming example you'll run to get started is just a toy. You will not hear us claiming that we have solved distributed programming or anything like that. Over the next 6 months, with the foundations of the language and tooling now laid down, we do plan to start rolling out real libraries for doing distributed programming in Unison, and that will be pretty exciting. :) See the rough [roadmap](#roadmap) below if you're curious.

Or jump right to the [install and quickstart guide](/quickstart) to get going.

## Roadmap

* Ongoing bugfixes and quality of life improvements for Unison, driven by what gets surfaced by testing and usage of Unison. :)
* New primitive functions for hashing and serialization of arbitrary Unison values. This is the basic building block of actual distributed execution as well as typed durable storage.
* Core library: concurrency and I/O. There's a super early version of this in M1.
* Core library: typed durable storage, with pluggable storage backends (local file system, IPFS, your favorite cloud...) This is a typed, durable storage library for Unison which lets you save any value and read it back later. No more parsing untyped blobs of bytes! Durable values can also be nested so this can be used to build lazily loaded durable data structures.
* Core library: stateless distributed execution. The distributed mergesort example from the quickstart guide shows this kind of library. It has fewer design unknowns than the more general distributed programming case and would be used for batch processing jobs that don't require shared cluster state.
* R&D and pre-alpha versions of libraries for more general distributed execution. There's more design work and research to be done here.
* A new runtime: we'll be staring first with a faster bytecode interpreter but would like to eventually move to an LLVM backend. Sam Griffin has done some early work on the LLVM side.
* Other core libraries that for whatever reason can't be implemented in pure Unison, though generally we would prefer to add a minimal set of new primitives to the language so that innovation can be done by anyone as a pure Unison library. The distributed programming support is an example of this: it will be built off a few primitives for code hashing and serialization so that anyone can innovate on new libraries and protocols without needing a language upgrade.

Longer term, we expect to be starting up work again on the [Unison semantic editor](http://unisonweb.org/2016-03-16/semantic-vs-text.html). This will basically be a different front-end for the codebase manager which talks to the same model and shares much of the same code, and Unison code could be written using the current command line interface + text editor, the semantic editor, or both.

## What's next?

Go to the [install and quickstart guide](/quickstart) to get started.