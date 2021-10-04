---
title: A tour of Unison
description: A tour of Unison and its codebase management tool
---

# A tour of Unison

## Introduction

This document introduces "the big idea" behind Unison and walks through the basics of using the Unison codebase manager to develop and publish your first Unison library. We will introduce bits and pieces of the core Unison language and its syntax as we go. The [Unison language reference][langref] is a more in-depth resource on this if you have questions or want to learn more.

If you want to follow along with this document (highly recommended), this guide assumes you've already gone through the steps in [the quickstart guide][quickstart].

The source for this document is [on GitHub][on-github]. Feedback and improvements are most welcome!

[repoformat]: https://github.com/unisonweb/unison/blob/trunk/docs/repoformats/v2.markdown
[on-github]: https://github.com/unisonweb/unisonweb-org/edit/master/src/data/docs/tour/README.md
[roadmap]: roadmap.html
[quickstart]: /docs/quickstart
[langref]: /docs/language-reference
[editorsetup]: editorsetup.html
[manager]: /docs/tour#hello-ucm

## The most important goal

If there is one motivating idea behind Unison, it's this: the technology for creating software should be _thoughtfully crafted_ in all aspects. Needless complexity and difficulties should be stripped away, leaving only that exhilarating creative essence of programming that made many of us want to learn this subject in the first place. Or at the very least, if we can't have this, let's have programming be _reasonable_. The fact that things were done a certain way in the 1970s is not a good reason to keep doing them, especially if they make programming worse.

Sure, it's sensible to make compromises regarding when and where to innovate, rather than trying to revolutionize everything right now. But let's be honest that it's a compromise, and not forget to improve things later.

## 🧠 The big technical idea

Now, if there is one big _technical_ idea behind Unison, explored in pursuit of the overall goal of making programming better, it's this: __Unison definitions are identified by content.__ Each Unison definition is some syntax tree, and by hashing this tree in a way that incorporates the hashes of all that definition's dependencies, we obtain the Unison hash which uniquely identifies that definition. This is the basis for some serious improvements to the programmer experience: it eliminates builds and most dependency conflicts, allows for easy dynamic deployment of code, typed durable storage, and lots more.

When taken to its logical endpoint, this idea of content-addressed code has some striking implications. Consider this: if definitions are identified by their content, _there's no such thing as changing a definition_, only introducing new definitions. That's interesting. What may change is how definitions are mapped to human-friendly names. For example, `x -> x + 1` (a definition) as opposed to `Nat.increment` (a name we associate with it for the purposes of writing and reading other code that references it). An analogy: Unison definitions are like stars in the sky. We can discover the stars in the sky and pick different names for these stars, but the stars exist independently of what we choose to call them.

But the longer you spend with the odd idea of content-addressed code, the more it starts to take hold of you. It's not arbitrary or strange, but a logical and sensible choice with tremendous practical benefits. You start to appreciate the simplicity of the idea and see the need for it everywhere ("this would be a lot easier if the code were content-addressed..."). Is it really feasible, though, to build a programming language around this idea?

Part of the fun in building Unison was in working through the implications of what seemed like a great core idea. A big question that arose: even if definitions themselves are unchanging, we do sometimes want to change which definitions we are interested in and assign nice names to. So how does that work? How do you refactor or upgrade code? Is the codebase still just a mutable bag of text files, or do we need something else?

We __do__ need something else to make it nice to work with content-addressed code. In Unison we call this something else the _Unison Codebase Manager_.

## 👋 to the Unison codebase manager

When first launching Unison in a new directory, we get a message like:

> No codebase exists here so I'm initializing one in: .unison/v2

What's happening here? This is the Unison Codebase Manager starting up and initializing a fresh codebase. We're used to thinking about our codebase as a bag of text files that's mutated as we make changes to our code, but in Unison the codebase is represented as a collection of serialized syntax trees, identified by a hash of their content and stored in a collection of files inside of that `.unison/v2` directory.

The Unison codebase format has a few key properties:

* It is _append-only_: once a file in the `.unison` directory is created, it is never modified or deleted, and files are always named uniquely and deterministically based on their content.
* As a result, a Unison codebase can be versioned and synchronized with Git or any similar tool and will never generate a conflict in those tools.

If you haven't already worked through the [quickstart guide][quickstart], let's download the Unison base library to the `.base` namespace:
```
---
title: ucm
---
.> pull https://github.com/unisonweb/base:.releases._latest base
```

This command uses Git behind the scenes to sync new definitions from the remote Unison codebase to the local codebase.

> 📁 Here the command is performed in the top-level namespace, represented by `.`. The prompt shows us which namespace we are currently in. If we were in a different namespace, we would need to change the `pull` command from using the _relative path_ `base` to the _absolute path_ `.base`. 

Because of the append-only nature of the codebase format, we can cache all sorts of interesting information about definitions in the codebase and _never have to worry about cache invalidation_. For instance, Unison is a statically-typed language and we know the type of all definitions in the codebase--the codebase is always in a well-typed state. So one thing that's useful and easy to maintain is an index that lets us search for definitions in the codebase by their type. Try out the following commands (new syntax is explained below):

```
---
title: ucm
show-carets: true
---
.> find : [a] -> [a]

  1. base.List.distinct : [a] -> [a]
  2. base.Heap.sort : [a] -> [a]
  3. base.List.dropLast : [a] -> [a]
  4. base.List.reverse : [a] -> [a]
  5. base.Heap.sortDescending : [a] -> [a]

.> view 4

  base.List.reverse : [a] -> [a]
  base.List.reverse as = List.foldLeft (acc a -> a +: acc) [] as
```

Here, we did a type-based search for functions of type `[a] -> [a]`, got a list of results, and then used the `view` command to look at the nicely formatted source code of one of these results. Let's introduce some Unison syntax:

* `base.List.reverse : [a] -> [a]` is the syntax for giving a [type signature](/docs/language-reference#type-signatures) to a definition. We pronounce the `:` symbol as "has type", as in "reverse has the type `[a] -> [a]`".
* `[Nat]` is the syntax for the type consisting of lists of natural numbers (terms like `[0,1,2]` and `[3,4,5]`, and `[]` will have this type), and more generally `[Foo]` is the type of lists whose elements have some type `Foo`.
* Any lowercase variable in a type signature is assumed to be [universally quantified](/docs/language-reference#polymorphic-types), so `[a] -> [a]` really means and could be written `forall a . [a] -> [a]`, which is the type of functions that take a list whose elements are some (but any) type, and return a list of elements of that same type.
* `base.List.reverse` takes one parameter, called `as`. The stuff after the `=` is called the _body_ of the function, and here it's a [block](/docs/language-reference#blocks-and-statements), which is demarcated by whitespace.
* `acc a -> ..` is the syntax for an anonymous function.
* Function arguments are separated by spaces and function application binds tighter than any operator, so `f x y + g p q` parses as `(f x y) + (g p q)`. You can always use parentheses to control grouping more explicitly.

> Try doing `view base.List.foldLeft` if you're curious to see how it's defined.

### Names are stored separately from definitions so renaming is fast and 100% accurate

The Unison codebase, in its definition for `reverse`, doesn't store names for the definitions it depends on (like the `foldLeft` function); it references these definitions via their hash. As a result, changing the name(s) associated with a definition is easy.

Let's try this out. `reverse` is defined using `List.foldLeft`. Let's rename that to `List.foldl` to make it more familiar to Haskell fans. Try out the following command (you can use tab completion here if you like):

```
---
title: ucm
show-carets: true
---
.> move.term base.List.foldLeft base.List.foldl

  Done.

.> view base.List.reverse

  base.List.reverse : [a] -> [a]
  base.List.reverse as =
    use base.List +:
    base.List.foldl (acc a -> a +: acc) [] as
```

Notice that `view` shows the `foldl` name now, so the rename has taken effect. Nice!

To make this happen, Unison just changed the name associated with the hash of `foldLeft` _in one place_. The `view` command just looks up the names for the hashes on the fly, right when it's printing out the code.

This is important: Unison __isn't__ doing a bunch of text mutation on your behalf, updating possibly thousands of files, generating a huge textual diff, and also breaking a bunch of downstream library users who are still expecting that definition to be called by the old name. That would be crazy, right?

So rename and move things around as much as you want. Don't worry about picking a perfect name the first time. Give the same definition multiple names if you want. It's all good!

> ☝️ Using `alias.term` instead of `move.term` introduces a new name for a definition without removing the old name(s).

> 🤓 If you're curious to learn about the guts of the Unison codebase format, you can check out the [v2 codebase format specification][repoformat].

[repoformat]: https://github.com/unisonweb/unison/blob/trunk/docs/repoformats/v2.markdown

Use `undo` to back up a step.  (We don't have a `redo` yet, though).

```
---
title: ucm
---
.> undo

  ⏪

  Here's the changes I undid:

  > Moves:

    Original name   New name
    base.List.foldLeft base.List.foldl

.>
```

Great!  OK, go drink some water, and then let's learn more about Unison's interactive way of writing and editing code.

## Unison's interactive scratch files

The codebase manager lets you make changes to your codebase and explore the definitions it contains, but it also listens for changes to any file ending in `.u` in the current directory. When any such file is saved (which we call a "scratch file"), Unison parses and typechecks that file. Let's try this out.

Keep your `ucm` terminal running and open up a file, `scratch.u` (or `foo.u`, or whatever you like) in your preferred text editor (if you want syntax highlighting for Unison files, [follow this link](/docs/editor-setup) for instructions on setting up your editor).

Now put the following in your scratch file:

```unison
---
title: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x
```

This defines a function called `square`. It takes an argument called `x` and it returns `x` multiplied by itself.

The first line, `use .base`, tells Unison that you want to use short names for the base libraries in this file (which allows you to say `Nat` instead of having to say `base.Nat`).

When you save the file, Unison replies:

```
---
title: ucm
show-carets: true
---
✅

I found and typechecked these definitions in ~/unisoncode/scratch.u. If you do an
`add` or `update` , here's how your codebase would change:

  ⍟ These new definitions are ok to `add`:

    square : base.Nat -> base.Nat

Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.
```

It typechecked the `square` function and inferred that it takes a natural number and returns a natural number, so it has the type `Nat -> Nat`. It also tells us that `square` is "ok to `add`". We'll do that shortly, but first, let's try calling our function right in the `scratch.u` file, just by starting a line with `>`:

```unison
---
title: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x

> square 4
```

And Unison replies:

```
---
title: ucm
---
6 | > square 4
      ⧩
      16
```

That `6 |` is the line number from the file. The `> square 4` on line 6 of the file, starting with a `>` is called a "watch expression", and Unison uses these watch expressions instead of having a separate read-eval-print-loop (REPL). The code you are editing can be run interactively, right in the same spot as you are doing the editing, with a full text editor at your disposal, with the same definitions all in scope, without needing to switch to a separate tool.

The `use .base` is a _wildcard use clause_. This lets us use anything from the `base` namespace under the root unqualified. For example we refer to `base.Nat` as simply `Nat`.

__Question:__ do we really want to reevaluate all watch expressions on every file save? What if they're expensive? Luckily, Unison keeps a cache of results for expressions it evaluates, keyed by the hash of the expression, and you can clear this cache at any time without ill effects. If a result for a hash is in the cache, Unison returns that instead of evaluating the expression again. So you can think of and use your `.u` scratch files a bit like spreadsheets, which only recompute the minimal amount when dependencies change.

> 🤓 There's one more ingredient that makes this work effectively, and that's functional programming. When an expression has no side effects, its result is deterministic and you can cache it as long as you have a good key to use for the cache, like the Unison content-based hash. Unison's type system won't let you do I/O inside one of these watch expressions or anything else that would make the result change from one evaluation to the next.

Let's try out a few more examples:

```unison
-- A comment, ignored by Unison

> base.List.reverse [1,2,3,4]
> 4 + 6
> 5.0 / 2.0
> not true
```

```
---
title: ucm
show-carets: true
---
✅

~/unisoncode/scratch.u changed.

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.

  6 | > base.List.reverse [1,2,3,4]
        ⧩
        [4, 3, 2, 1]

  7 | > 4 + 6
        ⧩
        10

  8 | > 5.0 / 2.0
        ⧩
        2.5

  9 | > not true
        ⧩
        false
```

## Testing your code

Let's add a test for our `square` function:

```unison
---
title: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x

use test

test> square.tests.ex1 = check (square 4 == 16)
```

Save the file, and Unison comes back with:

```
---
title: ucm
show-numbers: false
---
8 | test> square.tests.ex1 = check (square 4 == 16)

✅ Passed : Proved.
```

Some syntax notes:

* The `test>` prefix tells Unison that what follows is a test watch expression. Note that we're also giving a name to this expression, `square.tests.ex1`.
* Note: there's nothing special about the name `square.tests.ex1`; we could call those bindings anything we wanted. Here we use the convention that tests for a definition `foo` go in `foo.tests`.

The `check` function has type `Boolean -> Test.Result`. It takes a `Boolean` expression and gives back a list of test results, of type `[base.Test.Result]` (try `view Test.Result`). In this case there was only one result, and it was a passed test.

### A property-based test

Let's test this a bit more thoroughly. `square` should have the property that `square a * square b == square (a * b)` for all choices of `a` and `b`. The testing library supports writing property-based tests like this. There's some new syntax here, explained afterwards:

```unison
---
title: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x

use test

test> square.tests.ex1 = check (square 4 == 16)

test> square.tests.prop1 =
  go _ = a = !gen.nat
         b = !gen.nat
         expect (square a * square b == square (a * b))
  runs 100 go
```

```
---
title: ucm
show-numbers: false
---
11 |   go _ = a = !nat

✅ Passed : Passed 100 tests.
```

This will test our function with a bunch of different inputs.

#### Syntax notes

* The Unison block, which begins after an `=`, can have any number of _bindings_ (like `a = ...`) all at the same indentation level, terminated by a single expression (here `expect (square ..)`), which is the result of the block.
* You can call a function parameter `_` if you just plan to ignore it. Here, `go` ignores its argument; its purpose is just to make `go` [lazily evaluated](/docs/language-reference#delayed-computations) so it can be run multiple times by the `runs` function.
* `!expr` means the same thing as `expr ()`, we say that `!expr` _forces_ the [delayed computation](/docs/language-reference#delayed-computations) `expr`.

`nat` comes from `test` - `test.gen.nat`. It's a _generator_ of natural numbers. `!nat` generates one of these numbers.

## Adding code to the codebase

The `square` function and the tests we've written for it are not yet part of the codebase. So far they only exists in our scratch file. Let's add it now. Switch to the Unison console and type `add`. You should get something like:

```
---
title: ucm
show-carets: true
---
.> add

  ⍟ I've added these definitions:

    square             : Nat -> Nat
    square.tests.ex1   : [Result]
    square.tests.prop1 : [Result]
```

You've just added a new function and some tests to your Unison codebase. Try typing `view square` or `view square.tests.prop1`. Notice that Unison inserts precise `use` statements when rendering your code. `use` statements aren't part of your code once it's in the codebase. When rendering code, a minimal set of `use` statements is inserted automatically by the code printer, so you don't have to be precise with your `use` statements.

If you type `test` at the Unison prompt, it will "run" your test suite:

```
---
title: ucm
show-carets: true
---
.> test

  Cached test results (`help testcache` to learn more)

  ◉ base.Abort.tests.ex1                                  : Proved.
  ◉ base.Abort.tests.ex2                                  : Proved.
  ◉ base.Abort.tests.ex3                                  : Proved.
  ◉ base.Ask.tests.ex1                                    : Proved.
  ◉ base.Bag.add.tests.adds                               : Passed 100 tests.
...
  ◉ square.tests.ex1       : Proved.
  ◉ square.tests.prop1     : Passed 100 tests.

  ✅ 304 test(s) passing

  Tip:  Use view base.Abort.tests.ex1 to view the source of a test.
```

But actually, it didn't need to run anything! All the tests had been run previously and cached according to their Unison hash. In a purely functional language like Unison, tests like these are deterministic and can be cached and never run again. No more running the same tests over and over again!

## Unison namespaces and use clauses

Now that we've added our `square` function to the codebase, how do we reference it elsewhere?

The _Unison namespace_ is the mapping from names to definitions. Names in Unison look like this: `math.sqrt`, `.base.Int`, `base.Nat`, `base.Nat.*`, `++`, or `foo`. That is: an optional `.`, followed by one or more segments separated by a `.`, with the last segment allowed to be an operator name like `*` or `++`.

We often think of these names as forming a tree, much like a directory of files, and names are like file paths in this tree. [Absolute names](/docs/language-reference#absolutely-qualified-identifiers) (like `.base.Int`) start with a `.` and are paths from the root of this tree and _relative_ names (like `math.sqrt`) are paths starting from the current namespace, which you can set using the `namespace` (or equivalently `cd`) command:

```
---
title: ucm
show-carets: true
---
.> namespace mylibrary

  ☝️  The namespace .mylibrary is empty.

.mylibrary>
```

Notice the prompt changes to `.mylibrary>`, indicating your current namespace is now `.mylibrary`. When editing scratch files, any relative names not locally bound in your file will be resolved by prefixing them with the current namespace of `.mylibrary`. And when you issue an `add` command, the definitions are put directly into this namespace. For instance, if we added `x = 42` to our scratch file and then did `.mylibrary> add`, that would create the definition `.mylibrary.x`.

> You can use `namespace .` to move back to the root.

When we added `square`, we were at the root, so `square` and its tests are directly under the root. To keep our root namespace a bit tidier, let's go ahead and move our definitions into the `mylibrary` namespace:

```
---
title: ucm
---
.mylibrary> move.term .square square

  Done.

.mylibrary> find

  1.  square : .base.Nat -> .base.Nat

.mylibrary> move.namespace .square.tests square.tests

  Done.
```

We're using `.square` to refer to the `square` definition directly under the root, and then moving it to the _relative_ name `square`. When you're done shuffling some things around, you can use `find` with no arguments to view all the definitions under the current namespace:

```
---
title: ucm
show-carets: true
---
.mylibrary> find

  1. square : Nat -> Nat
  2. square.tests.ex1 : [Result]
  3. square.tests.prop1 : [Result]
```

Also notice that we don't need to rerun our tests after this reshuffling. The tests are still cached:

```
---
title: ucm
show-carets: true
---
.mylibrary> test

  Cached test results (`help testcache` to learn more)

  ◉ square.tests.ex1       : Proved.
  ◉ square.tests.prop1     : Passed 100 tests.

  ✅ 2 test(s) passing

  Tip:  Use view square.tests.ex1 to view the source of a test.
```

We get this for free because the test cache is keyed by the hash of the test, not by what the test is called.

> ☝️  The `use` statement can do absolute names as well, for instance `use .base.List map`.

When you're starting out writing some code, it can be nice to just put it in a temporary namespace, perhaps called `temp` or `scratch`. Later, without breaking anything, you can move that namespace or bits and pieces of it elsewhere, using the `move.term`, `move.type`, and `move.namespace` commands.

## Modifying existing definitions

Instead of starting a function from scratch, often you just want to slightly modify something that already exists. Here we'll make a change to the implementation of our `square` function.

### Using the `edit` command

Try doing `edit square` from your prompt (note you can use tab completion):

```
---
title: ucm
show-carets: true
---
.mylibrary> edit square
  ☝️

  I added these definitions to the top of ~/unisoncode/scratch.u

    square : Nat -> Nat
    square x =
      use Nat *
      x * x

  You can edit them there, then do `update` to replace the definitions currently in this branch.
```

This copies the pretty-printed definition of `square` into you scratch file "above the fold". That is, it adds a line starting with `---` and puts whatever was already in the file below this line. Unison ignores any file contents below the fold.

Let's edit `square` and instead define `square x` (just for fun) as the sum of the first `x` odd numbers (here's a [nice geometric illustration of why this gives the same results](https://math.stackexchange.com/a/639079)):

```unison
use .base

square : Nat -> Nat
square x =
  sum (map (x -> x * 2 + 1) (range 0 x))

sum : [Nat] -> Nat
sum = foldLeft (+) 0
```

```
---
title: ucm
show-carets: true
---
✅

I found and typechecked these definitions in ~/unisoncode/scratch.u. If you do an
`add` or `update` , here's how your codebase would change:

    ⍟ These new definitions are ok to `add`:

      sum : [Nat] -> Nat

    ⍟ These names already exist. You can `update` them to your new definition:

      square : Nat -> Nat
```

### Adding an updated definition to the codebase

Notice the message says that `square` is "ok to `update`". Let's try that:

```
---
title: ucm
show-carets: true
---
.mylibrary> update

  ⍟ I've added these definitions:

    sum : [Nat] -> Nat

  ⍟ I've updated these names to your new definition:

    square : Nat -> Nat
```

### Only affected tests are rerun on `update`

If we rerun the tests, the tests won't be cached this time, since one of their dependencies has actually changed:

```
---
title: ucm
show-carets: true
---
.mylibrary> test

  ✅
  
    New test results:

  ◉ square.tests.ex1      : Proved.
  ◉ square.tests.prop1    : Passed 100 tests.

  ✅ 2 test(s) passing

  Tip: Use view square.tests.ex1 to view the source of a test.
```

Notice the message indicates that the tests weren't cached. If we do `test` again, we'll get the newly cached results.

The dependency tracking for determining whether a test needs rerunning is 100% accurate and is tracked at the level of individual definitions. You'll only rerun a test if one of the individual definitions it depends on has changed.

## Publishing code and installing Unison libraries

Code is published using the `push` command and libraries are installed via the `pull` command (recall how in the [quickstart guide](/docs/quickstart), we installed the base libraries with a `pull`). There's no separate tooling needed for managing dependencies or publishing code and you'll never encounter dependency conflicts in Unison. 

[This document](/docs/codebase-organization) covers the details of how to organize your codebase, issue and review pull requests, install libraries, and make releases.

## What next?

Before getting going writing Unison code, you can [configure UCM to set author and license information](/docs/configuration). Also see the guide on [organizing your codebase and day-to-day workflows](/docs/codebase-organization).

Other topics:

* [Libraries](/docs/libraries) has a catalog of open source Unison projects. If you're working on something in Unison, feel free to open a PR to add it here.
* [Abilities in Unison](/docs/abilities) covers a unique aspect of Unison's type system.
* [Writing documentation](/docs/documentation) is a tutorial on Unison's approach to documentation.
* [The core language reference](/docs/language-reference) describes Unison's core language and current syntax in more detail.
