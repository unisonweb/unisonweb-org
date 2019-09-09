---
title: Roadmap
description: Plans for the next 6 months of Unison development
---

# Roadmap

* Ongoing bugfixes and quality of life improvements for Unison, driven by what gets surfaced by alpha testing.
* New primitive functions for hashing and serialization of arbitrary Unison values. This is the basic building block of actual distributed execution as well as typed durable storage.
* Core library: concurrency and I/O. There's a super early version of this in M1.
* Core library: typed durable storage, with pluggable storage backends (local file system, IPFS, or your favorite cloud storage). This is a typed, durable storage library for Unison which lets you save any value and read it back later. No more parsing untyped blobs of bytes! Durable values can also be nested so this can be used to build lazily loaded durable data structures.
* Core library: stateless distributed execution. The distributed mergesort example from the quickstart guide shows this kind of library. It has fewer design unknowns than the more general distributed programming case and would be used for batch processing jobs that don't require shared cluster state.
* R&D and pre-alpha versions of libraries for more general distributed execution. There's more design work and research to be done here.
* A new runtime: we'll be starting first with a faster bytecode interpreter but would like to eventually move to an LLVM backend. Sam Griffin has done some early work on the LLVM side.
* Other core libraries that for whatever reason can't be implemented in pure Unison, though generally we would prefer to keep new primitives in language to a minimum so that innovation can be done by anyone in pure Unison libraries. The distributed programming support is an example of this: it will be built on top of a few primitives for code hashing and serialization so that anyone can innovate on new libraries and protocols without needing a language upgrade.

Longer term, we expect to be starting up work again on the [Unison semantic editor](http://unisonweb.org/2016-03-16/semantic-vs-text.html). This will basically be a different front-end for the codebase manager which talks to the same model and shares much of the same code, and Unison code could be written using the current command line interface + text editor, the semantic editor, or both.

### What's next?

Go to the [install and quickstart guide](/quickstart) to get started.
