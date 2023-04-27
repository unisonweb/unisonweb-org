---
title: Frequently Asked Questions
description: A list of frequently asked questions about Unison, compiled and curated by the community.
---

This is a list of frequently asked questions about Unison, compiled and curated by the community.  The source of this doc is [here](https://github.com/unisonweb/unisonweb-org/tree/master/src/data/docs/faq.md) and contributions are welcome!

## Build/install

### Is there a nix expression for Unison?

Check out the [unison-nix repository](https://github.com/ceedubs/unison-nix/).

Nix is not officially supported, but there seems to be a substantial overlap between nix enthusiasts and Unison enthusiasts, so feel free to give it a try and ask on [slack](https://www.unisonweb.org/community) if you get stuck.

### I get `error while loading shared libraries: libtinfo.so.5`

Some people see the following error when they try to run the `ucm` executable for the first time.

```
ucm: error while loading shared libraries: libtinfo.so.5: cannot
open shared object file: No such file or directory
```

As a workaround try the following:

```
-- assumes APT is your package manager
sudo apt-get install libtinfo5
```

(This issue is tracked under [#602](https://github.com/unisonweb/unison/issues/682).)

### When I save my scratch file, `ucm` doesn't react

On Linux, this can happen if your system has run out of 'inotify watches'.  (Backup applications often use a lot of these.)

You can see if this is the case by running `tail -f <file>` on a file of your choice, and looking out for the following output.
```
tail: inotify cannot be used, reverting to polling: Too many open files
```

If so you can up the limit by doing
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Search stackoverflow for more tips if that command doesn't work for you.

## Language

### Does Unison have Haskell-style type classes?

No, or at least, not yet.  We're considering our options for how to allow people to express bounded polymorphism.  See [this post](https://www.unisonweb.org/2019/04/04/writeup-of-our-first-unison-meetup#other-questions) for some initial observations.

Currently there are two ideas which have been developed at least to some extent.
1) Like this: `mconcat : [a] ->{Monoid a} a`, where `Monoid a` is an ability.
2) Like this: `mconcat : Monoid a -> [a] -> a`, where `Monoid a` is a record type.

Both of these would require a set of supporting language enhancements, for example to supply the `Monoid a` handlers/values automatically.

### How similar is Unison to Haskell?

As a programming language, Unison can be viewed as a descendant of Haskell, with many similarities including
- type inference
- pattern matching
- ADTs
- purity (i.e. no side effects).

Some key differences...
- As a new language, Unison is a good deal smaller and simpler than Haskell.  The flip side of this is that it's currently missing a number of conveniences which Haskell users take for granted.
- Unison supports algebraic effects, which it calls 'abilities', which replace monads and monad transformers for writing effectful code.
- Unison uses a strict evaluation model, whereas Haskell's model is lazy.

### Does Unison have an FFI?

Unison does not currently support a Foreign Function Interface, for invoking code written in other languages.

Your programs can interact with the outside world via the `IO` ability, and this includes interaction via network sockets - so you can interact with code written in other languages if that code can expose a network interface, for example as a web service.  We'd like to improve on this position in the future.

The sketch design for how it will work is as follows.
- A foreign API, let's say one for working with the GPU, will be exposed through a top-level ability, let's say `GPU`.
- The Unison runtime will let you run a program of type `'{GPU} ()` just as it lets you run a `'{IO} ()`.
- There will be an extensible binding mechanism for defining new such abilities and forwarding their operations to external APIs.

There's still plenty to work out, for example in
- designing the binding mechanism
- managing `ucm` linkage dependencies to external binaries
- making it play nicely with distribution, so computations can jump between nodes, and make use of the varying FFI abilities on each one.

Note how using the ability mechanism gives a great story for testing.  You can define a test handler, in pure Unison, to handle your `GPU` ability, and use it to add regular Unison tests for your GPU code, that can run anywhere regardless of whether the right GPU is installed.

## Distributed computing

### How can Unison's distributed execution be made secure?

There are actually a bunch of questions here - some are listed below.  Some aspects of this need more research, but overall we believe that it will be possible to build secure systems using Unison.

**How can a Unison node ensure that a peer which sends it a computation (a) is who it says it is, (b) is authorized to consume compute resources on the node, (c) is authorized to access data or perform effects on the node?**

Computations from remote notes will be sandboxed, with resource and capability permissions applied to the sandbox.  There will be a system for authenticating remote nodes and authorizing them for a given usage.

**How can a Unison node know that code which it syncs in from a peer is safe to run, and will only use resources or privileges that the sender is authorized for?**

Resource usage will be limited dynamically through the sandbox mechanism, with code execution throttled or cancelled if it breaches the limits. A program will only be able to use effects and I/O if the sandbox explicitly provides it the ability to do so. Unison’s type system enforces that programs only have access to the abilities they’re given.

**How can a piece of Unison code/data be kept private to a node - so it doesn't get synced to other nodes?**

For data, there is a plan to add a 'pinned data' facility, see issue [#798](https://github.com/unisonweb/unison/issues/798).

For code, this is an active topic of research - see issue [#799](https://github.com/unisonweb/unison/issues/799).

**Given that Unison transfers code and data to peers, are any special code patterns required in Unison to prevent vulnerabilities?**

Certainly yes, and it will be fun to build out our understanding of these patterns as we gain experience with the distributed execution API!

### What does each node need to run to enable distributed execution?

A Unison runtime environment must be running on each node.  This environment will accept network connections from Unison peers, and run the code syncing and distributed evaluation protocol.

Details on how this environment looks are TBD.

### Where can I learn more about Unison's support for distributed computation?

This area of Unison has had plenty of thought and research, but isn't built yet.  But here are some resources to give you a preview.

- Paul's [Scale By The Bay 2018 talk](https://www.youtube.com/watch?v=v7L-5AQQkbM), from about 8 minutes in.
- The 2015 [blog post](https://github.com/unisonweb/oldblog/blob/master/_posts/2015-06-02-distributed-evaluation.markdown) on distributed evaluation.
- The current [API sketch](https://github.com/unisonweb/unison/blob/trunk/docs/distributed-programming-rfc.markdown).

## Codebase model

### If definitions never change, how do you fix a bug or refactor an old definition?

> You can also check out Paul's [Scale By The Bay 2019 talk](https://www.youtube.com/watch?v=IvENPX0MAZ4) on the Unison codebase model for an explanation!

Definitions never change, but the names we give them do.  Suppose I have a term with hash `#1krif5`, and I've given it the name `foo`.  We can draw that as follows.

```
  foo   ->   #1krif5
```

Then I decide my code for `foo` is bugged, so I present Unison with a new definition for it.  Then Unison will work out the hash of the *new* definition for `foo`, say `#amrl61`, and change the name `foo` to point to it.  We end up with the following.

```
             #1krif5

  foo   ->   #amrl61
```

So, no terms have *changed*, but a new term has been added, and a *name* has changed to point to a different term.

#### Propagation

So that's all good, but what about the function `bar` which called `foo`?

Suppose we actually originally started with the following - one term referencing (calling out to)
 another, those terms being called `bar` and `foo` respectively.
```
  foo   ->   #1krif5
                ↑
  bar   ->   #doq7s1
```

Then our edit to `foo` actually left the codebase (for a moment) in the following situation, with `bar` still referencing the _old_ version of `foo`.

```
             #1krif5
               ↑
  bar   ->   #doq7s1

  foo   ->   #amrl61
```

However, Unison assumes that this is not where you want to end up, and that actually, you want to *propagate* the updated definition of `foo` to the set of *transitive dependents* of the old term `#1krif5`.

As long as the old `foo` and the new `foo` have the same (or compatible) types, then Unison does this propagation automatically and leaves you with the following.

```
  (unused)   #1krif5

  bar   ->   #doq7s1
                ↓
  foo   ->   #amrl61
```

This propagation works recursively, so it deals with dependents of `bar` as well, and their dependents in turn, and so on.

If the types aren't compatible, then Unison can't automatically propagate the change.  Let's suppose the old definition of `bar` had type `Int`, the new one has type `Nat`, and `bar` requires `foo` to be an `Int`.  Then the `todo` command in ucm reports the following:

```
.> todo

  🚧

  The namespace has 1 transitive dependent(s) left to upgrade. Your edit frontier is the dependents
  of these definitions:

    foo#1krif5 : .base.Int

  I recommend working on them in the following order:

    bar : .base.Int

```

This is your cue to resolve the type discrepancy by editing `bar` (or rather, switching the name `bar` to refer to some new definition) so that it copes with `foo` being a `Nat`.  If that edit to `bar` preserves its type, then Unison can take it from there and continue the propagation process automatically.

Notice that even while we were in the transient state as reported by `todo`, our codebase was still valid, and all our tests would still pass - it's just that at least some of them would still refer to the old definitions of `foo` and `bar`.  And at no stage did we have to wade through a mass of compile errors: instead, the `todo` command leads us through a structured refactoring process, in which everything is valid and well-typed at all times.

Another thing: the instruction to 'replace `#1krif5` with `#amrl61`' gets recorded by Unison in a 'patch'.  Suppose you publish `foo` in a library for other people to use.  Then your library users can take advantage of your patch to help them update their own code.

### What happens if I hit a hash collision?

Your name will go down in history!

Unison uses 512-bit SHA3 digests to hash terms and types. The chance of two Unison objects hashing to the same digest is unimaginably small. If we wrote one billion unique Unison terms every second, we could expect a hash collision roughly every 100 trillion years.

If it did happen, you could simply tweak your term so it gets a different hash. For example, you could wrap it in a call to the identity function (which does nothing).

### Is it inefficient to have the codebase be a purely functional data structure? Won't that involve a lot of copying?

Since the codebase is an immutable data structure where the elements of the structure never change, we can get the same kind of structural sharing we’re used to getting with data structures in functional programming.

In fact, Unison may waste a lot less disk space than traditional languages, since Unison does not have builds and therefore doesn’t generate build artifacts.

### Does the codebase always keep getting bigger over time?  Is there any way to remove code?

The codebase stores its complete history - the same as git does.  That gives you a complete view of the operations that brought the codebase to its current state.  It also means that you can refer to a given definition in the codebase, by hash, and be sure that that reference will never become undefined.

In the future, we may introduce a 'prune' operation to allow you to remove definitions which have no inward references (from within the codebase).

### How do I share my code?

If you want to _publicly_ share your code (or look at code that others have shared), check out [Unison Share](https://share.unison-lang.org/).

You use the Unison Codebase Manager's `push` command, to write it to a git repository - for example, one hosted on GitHub. Run `help push` within `ucm` for more information.

Currently git is the only supported VCS protocol, but it would be perfectly feasible to add others.

(There's also always the option of zipping up your `.unison` directory!  Its contents are free-standing and portable.)

### How does hashing work for mutually recursive definitions?

We treat a set of mutually recursive definitions as a single “cycle” for hashing purposes.

For example:

```
f x = g (x - 1)
g x = f (x / 2)
```

First we replace any recursive calls in the cycle with the De Bruijn index of the cycle itself, like this (not valid Unison syntax):

```
$0 =
  f x = $0 (x - 1)
  g x = $0 (x / 2)
```

Nested cycles will get higher De Bruijn indices, but a top-level cycle will have index `0`.

This transformation makes the elements of the cycle independent of any names. Then we hash each element of this new structure individually. Let’s say `f` gets the hash `#222` and `g` get the hash `#111`. We then sort them to get a canonical order that is independent of their order in the source. This yields something like:

```
$0 =
  $0.0 x = #111
  $0.1 x = #222
```

We then hash this structure. Let’s say that hash is `#ccc`. Each definition gets a hash `#ccc.n` where `n` is the position of that definition in the cycle. Here `g` gets `#ccc.0` and `f` gets `#ccc.1`. The final cycle will be:

```
#ccc =
  $0 x = $1 (x / 2)
  $1 x = $0 (x - 1)
```

This creates two new hashes, `#ccc.0` and `#ccc.1`. Note that their definitions don’t refer to each other by hash, but by position in the overall cycle.

## General

### How do I run a program that uses `IO`?

In `ucm`, you can type `run myProgram`, where `myProgram` is some term of type `'{IO, Exception} ()`.

### Does Unison have IDE support? Editor support? Language Server Protocol (LSP) support?

We have editor support for the Unison syntax in Vim, Atom, and VS Code - see https://www.unison-lang.org/learn/usage-topics/editor-setup/.

No editors currently understand the Unison codebase format, or offer function like 'find references', 'extract function', etc.  You can use `ucm` commands to get some of these abilities, for example `find`.

With Unison ships a [local UI](https://github.com/unisonweb/codebase-ui) to browse your codebase. Libraries can be explored and published on [Unison Share](https://share.unison-lang.org)

Since the Unison codebase is a structured object containing full type information and metadata, we expect it will be possible to build developer tooling which beats that which exists for today's languages!

A previous incarnation of the Unison project actually started with a structure editor, meaning that the 'input some freeform text' stage is bypassed entirely.  This is a direction we hope to come back to in the future.

### Does Unison compile to LLVM?

Not yet!  We have done some exploratory work on this in the past, and expect to come back to it.  For the moment, we have a nice, clean, but unoptimized interpreter.  We definitely want to be able to compile Unison to native binaries in the future.

### Are you looking for help with developing Unison?

Yes!  Please come and get involved 😊

The first step is to play with the language, and get familiar with writing Unison code.  Also come join the slack, and browse through the issue tracker to see what's going on.

#### Contributing Unison code

Is there a library you could write in Unison?  That's a way to contribute which requires very little coordination with the compiler team, and can have a big impact on the usability of the overall Unison ecosystem.  There's a catalog of libraries [here](https://www.unisonweb.org/docs/libraries) - do add yours!  Let us know in the slack (channel #hackathon) what you're working on 😎

You could also try fixing some omissions from the base library - see [here](https://github.com/unisonweb/base/blob/master/CONTRIBUTING.md#contributions-that-are-most-welcome) for the contributions that would be most welcome.

#### Contributing to the Unison language/compiler/toolchain

You can dip your toes by finding small ways to contribute a little piece:
- take a look at the issues labelled '[good first issue](https://github.com/unisonweb/unison/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)' and '[help wanted](https://github.com/unisonweb/unison/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)'
- see if you can find any tidying or refactoring you think needs doing in the parser-typechecker source (chat to us on slack before spending much time)
- are there any contributor docs you'd like to see which you could make a start on?

Once you've had your first PR merged and gotten to know how we work, have a think whether you want to take on a bigger project!  There's lots of cool stuff to do.  Get in touch with Paul Chiusano via the slack and give him an idea of your areas of interest and level of experience.  If you have your own suggestions for what you could work on then let him know!
