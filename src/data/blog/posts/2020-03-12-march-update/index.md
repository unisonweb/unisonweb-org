---
title: First class documentation with live examples, rethinking the pull request, a new runtime, and more
description: There have been more than 700 commits to Unison's master branch since we last did one of these update posts, so a lot has happened. We've made a lot of bug-fixes and improvements to the ergonomics of Unison--too many to list them all here. Here are some highlights.
date: 2020-03-12
categories: ["news"]
featuredImage: /media/thing7.svg
---

There have been more than 700 commits to Unison's master branch since we last did one of these update posts, so a lot has happened. We've made a lot of bug-fixes and improvements to the ergonomics of Unison--too many to list them all here. Here are some highlights.

## Support for first-class API docs with live code examples

You can now write documentation for your Unison libraries, and link the docs to the definitions in your codebase. What's more, documentation is first-class, so it's just Unison code! This means:

- You can access documentation from Unison code and compute with it.
- Code snippets and examples in your docs are not just text, but "live" code that typechecks.
- Such code doesn't get out of date. When you refactor or update code that's referenced in documentation, the Unison Codebase Manager automatically updates the docs.

For more information about this, see [Documenting Unison code](https://www.unisonweb.org/docs/documentation).

## New documentation topics on Unison's abilities system and its testing library

We added some new documentation topics! Firstly, we documented Unison's type system feature called [abilities](/docs/abilities) (often called _algebraic effects_ in the literature), a powerful yet easy-to-use feature that can express asynchronous programming, stream processing, coroutines, nondeterminism, and more. See [the docs on abilities](/docs/abilities). As a quick example, here's an implementation of Python-style generators in a few lines of Unison code:

```unison
ability Stream e where
  emit : e -> ()

-- Emit all natural numbers starting from `n`
Stream.from : Nat ->{Stream Nat} ()
Stream.from n =
  emit n
  Stream.from (n + 1)
```

See [the abilities tutorial](/docs/abilities) for more.

We also added [better documentation on how to write tests in Unison](/docs/testing). For a while now, Unison's [base libraries](https://github.com/unisonweb/base) have come with a nice (but not well documented) library for testing, which supports traditional unit tests and programmatically generated test cases. Here's a quick example:

```unison
test> myTest = check (1 + 1 == 2)

test> Nat.tests.addition = runs 1000 'let
  x = natIn 0 100
  y = natIn 100 200
  expect ((x+y) == (y+x))
```

See [the documentation for how to write tests in Unison](/docs/testing) to learn more.

## A workflow for making pull requests against Unison repos

This is still a work in progress, but we have a fairly straightforward workflow that you can use to make "pull requests" against Unison repos. The usual pull request review process involves navigating large textual diffs, using a tool that has little understanding of your code. Unison has a semantic understanding of changes that are made to a namespace, and can report things like "this function was changed" or "this definition was moved from here to there" rather than "these 46 lines in this file are now different, as are these other 74 lines in this other file". Also, by storing the Unison codebase as serialized abstract syntax trees, we avoid merge conflicts and diffs due to things like formatting.

Because of this more semantic understanding, the PR review process can also be more random-access, where one can hop around through semantically meaningful parts of the change rather than scrolling through large textual diffs.

Though we still call them "pull requests" and though Unison repos are hostable on GitHub, we cannot actually use the GitHub pull request mechanism. Or at least, that would not be a nice experience. Instead, Unison has its own kind of pull request.

Let's say we've forked the [Unison Base library](https://github.com/unisonweb/base) to `https://github.com/me/mybase`, and we've added a new function `Char.toText` that we would like to have merged back to `unisonweb/base`. We can create a Unison pull request from the Unison Codebase Manager, with `pr.create`:

```ucm
.> pr.create https://github.com/unisonweb/base https://github.com/me/mybase

  The changes summarized below are available for you to review, using the
  following command:

    pr.load https://github.com/unisonweb/base https://github.com/me/mybase

  Added definitions:

     Char.toText                           : Char -> Text
```

We take the output of this command and send it to the recipient of our pull request. In this case, we could for example paste it into a new GitHub issue opened against `unisonweb/base`. A maintainer of that repo can then run the `pr.load` command in their Codebase Manager:

```ucm
.> pr.load https://github.com/unisonweb/base https://github.com/me/mybase pr1

  I checked out https://github.com/unisonweb/base to pr1.base.
  I checked out https://github.com/me/mybase to pr1.head.

  The merged result is in pr1.merged.
  Use `diff.namespace pr1.base pr1.merged` to see what's been updated.
  Use `todo merged.patch pr1.merged` to see what work is remaining for the merge.
  Use `push https://github.com/unisonweb/base pr1.merged` to push the changes.
```

Following the instructions in the output of `pr.load`, the maintainer of `unisonweb/base` can audit our changes and push them to their repo on GitHub.

There will be a more detailed tutorial on this feature of UCM once it's a little bit more polished.

## An improved process for refactoring data types

We've vastly improved the experience of updating or refactoring types. In Unison, when you make a modification to a data type, you actually create a new type and any existing code needs to be made to use your new type instead of the old one. With the improvements we've made, you just need to issue an `update` command in UCM, and it will try to update any code that depends on the changed data type.

Sometimes this will result in code that doesn't typecheck, and Unison will let you know if that's the case so you can make the changes manually. To this end, we've also added commands that give you somewhat precise control of term and type replacements, `replace.term` and `replace.type`. These let you create patches that (when applied) replace all appearances of one term or type in a namespace with another.

## A number of syntax changes

We've made some changes to Unison's surface syntax, hoping to make the language more ergonomic. Kudos go to Aaron Novstrup who contributed each of these improvements. 🙌 A cool thing about Unison is that we can change the syntax without breaking anyone's existing code! When you update to the latest version of Unison, it will simply start rendering your code using the new syntax.

Here are three major syntax changes:

### Handler blocks

Where you used to write `handle h in x`, such that `h` is an [ability handler](https://www.unisonweb.org/docs/abilities) and `x` is some code that needs the abilities handled by `h`, you now write `handle x with h`. We think this makes the code easier to read and write, since the logic (the `handle` block) comes before the implementation specifics (the handler). Now it looks rather like `try`/`catch` in other languages:

```unison
handle
  doOneThing
  doAnotherThing
with
  theHandler
```

As a bonus, we're able to get rid of the `in` keyword, freeing that name up for use as an ordinary identifier.

### Match-with instead of case-of

Pattern matching gets a facelift as well. Where you used to write `case x of ...`, you now write `match x with ...`. For example:

```unison
match List.head xs with
  Some x -> "Hello, " ++ x
  None -> "Goodbye"
```

### Lambda-case syntax

When writing a lambda literal that pattern matches on its argument, normally you would write:

```unison
x -> match x with ...
```

But if you don't care to give the `x` argument a name, now you can instead just write:

```unison
cases ...
```

This looks especially nice in ability handlers:

```unison
handle
  doOneThing
  doAnotherThing
with cases
  { x } -> x
  { Store.get   -> k } -> ...
  { Store.put v -> k } -> ...
```

## Use any unambiguous name suffix to identify definitions

This change massively cuts down on import boilerplate. For example, you can use `Optional` unqualified, without a `use` clause to import it, as long as there's no other `Optional` type in your tree.

If you have two `Optional` types, `.foo.bar.Optional` and `.my.cool.Optional`, then `cool.Optional` is a suffix of name segments that uniquely identifies the latter type, and can be used without any imports.

Notably, you no longer have to use patterns qualified with their data type. So whereas before you might have had this:

```unison
use .base Optional Text

myFunction : Optional Text -> Text
myFunction x = match x with
  Optional.Some x -> "Hello, " ++ x
  Optional.None -> "Goodbye"
```

you can now just say:

```unison
myFunction : Optional Text -> Text
  Some x -> "Hello, " ++ x
  None -> "Goodbye"
```

More generally, you can now refer to a type or term without imports using any suffix of name segments that has just one referent.

## Builtins for crashing Unison programs

We added two builtins, `bug` and `todo`, which simply crash your program with an error. (A shoutout to Noah Haasis for contributing both of these! 🎉)

The `todo` builtin is handy for when you've only partially implemented something but you want to try out the partial implementation anyway:

```unison
myFunction x = match x with
  Some x -> "Hello, " ++ x
  None -> todo "Handle the None case"
```

The `bug` builtin is for implementing assertions and sanity checks, a way to quickly crash if you hit a case that should be impossible if your code were correct. For example:

```unison
...
tree' = rebalance tree
if isBalanced tree' then
  tree'
else
  bug ("Tree unbalanced after rebalancing!", tree')
```

You can pass any value at all to `bug` or `todo` and it will be nicely formatted by Unison, using the pretty-printing code developed by contributor Chris Gibbs. A common idiom is just to give it a tuple with one element being the description and the other elements being a list of values that you want to be able to see if `bug` or `todo` call is ever hit in running code.

## What's next?

We're going to keep polishing the pull-request workflow to make it nicer to use and will be opening up [the Unison base libraries](https://github.com/unisonweb/base) to new contributors very soon.

Also exciting is that Dan Doel has started implementation on a new runtime for Unison which is going to be a lot faster than what we have now and sets us up to write a proper JIT for Unison. We'd like Unison to be both great to program in and also insanely fast. Unlike the current runtime, Dan's work is the start of a more traditional JIT compiler pipeline, where the code goes through several initial stages of transformations before being converted to an intermediate representation (IR) where various optimizations can be expressed before moving to code generation. The current code generation process Dan's working on goes to a low level representation that gets interpreted efficiently, but the endgame would be to go to something like LLVM.

We might do a more in-depth technical post on the new runtime work. In particular, going to LLVM has interesting challenges due to Unison's [ability system](/docs/abilities) which needs to capture and manipulate continuations at runtime.

The new runtime should land in the next couple of months, along with some new builtin functions we'll need to start building out Unison's distributed computing libraries.

We still have a lot more work to do, but things are coming together!
