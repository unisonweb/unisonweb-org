---
title: Getting Started
description: placeholder
---

# A tour of Unison

This guide assumes you've already gone through the steps in [the quickstart guide](quickstart.html). We recommend going through that guide before continuing here.

The source for this document is [on GitHub][on-github]. Feedback and improvements are most welcome!

[repoformat]: todo
[on-github]: todo
[roadmap]: todo
[quickstart]: quickstart.html
[langref]: languagereference.html

## 🧠 The big idea

If there is one motivating idea behind Unison, it's this: the technology for creating software should be _thoughtfully crafted_ in all aspects. Needless complexity and difficulties should be stripped away, leaving only that exhilarating creative essence of programming that made many of us want to learn this subject in the first place. Or at the very least, if we can't have this, let's have programming be _reasonable_. The fact that things were done a certain way in the 1970s is not a good way to keep doing them, especially if they make programming worse.

That said, it's sensible to make compromises regarding when and where to innovate, rather than trying to revolutionize everything right now. But let's be honest that it's a compromise, and not forget to improve things later.

Now, if there is one big _technical_ idea behind Unison, explored in pursuit of the overall goal of making programming better, it's this: __Unison definitions are identified by content.__ Each Unison definition is some syntax tree, and by hashing this tree in a way that incorporates the hashes of all that definition's dependencies, we obtain the Unison hash which uniquely identifies that definition. This is the basis for some serious improvements to the programmer experience: it eliminates builds and most dependency conflicts, allows for easy dynamic deployment of code, typed durable storage, and lots more.

But this one technical idea is also a bit weird, and it has far-reaching consequences. Consider this: if definitions are identified by their content, there's no such thing as changing a definition, there's only introducing new definitions. What can change is how we map definitions to human-friendly names. For example, `x -> x + 1` (a definition) as opposed to `Int.increment` (a name we associate with it for the purposes of writing and reading other code that references it). An analogy: Unison definitions are like stars in the sky. We can discover the stars in the sky and make up new constellations that pick different names for the stars, but the stars exist independently of what we choose to call them.

The longer you spend with this weird idea, the more it starts to take hold of you. You start seeing the need for it everywhere. And you start wanting to see the implications of it worked out in detail.

It does raise lots of questions, though. Like even if definitions themselves are unchanging, we certainly may change which definitions we are interested in and give nice names to. How does that work? How do I refactor or upgrade code? Is the codebase still just a mutable bag of text files, or do we need something else?

We __do__ need something else to make it nice to work with content-addressed code. In Unison we call this something else the _Unison Codebase Manager_.

## 👋 to the Unison codebase manager

When first launching Unison in a new directory, we get a message like:

```
No codebase exists here so I'm initializing one in:
.unison/v1
```

What's happening here? This is the Unison Codebase Manager starting up and initializing a fresh codebase. We're used to thinking about our codebase as a bag of text files that's mutated as we make changes to our code, but in Unison the codebase is represented as a collection of serialized syntax trees, identified by a hash of their content and stored in a collection of files inside of that `.unison/v1` directory.

The Unison codebase format has a few key properties:

* It is _append-only_: once a file in the `.unison` directory is created, it is never modified, and files are always named uniquely and deterministically based on their content.
* As a result, a Unison codebase can be versioned and synchronized with Git or any similar tool and will never generate a conflict in those tools.

> 🐘 Remember that `pull git@github.com:unisonweb/unisonbase.git` we used in the [quickstart guide][quickstart]. This command uses git behind the scenes to sync new definitions from the remote Unison codebase to the local codebase.

Because of the append-only nature of the codebase format, we can cache all sorts of interesting information about definitions in the codebase and _never have to worry about cache invalidation_. For instance, Unison is a statically typed language and we know the type of all definitions added to the codebase, which is always in a well-typed state. So one thing that's useful and easy to maintain is an index that lets us query for definitions in the codebase by their type. Try out the following commands (new syntax is explained below):

```unison
.> find : [a] -> [a]

  1. base.Heap.sort : [a] -> [a]
  2. base.List.distinct : [a] -> [a]
  3. base.List.reverse : [a] -> [a]
  4. base.Heap.sortDescending : [a] -> [a]

.> view 3

  base.List.reverse : [a] -> [a]
  base.List.reverse as =
    use base.List cons
    base.List.foldl (acc a -> cons a acc) [] as
```

Here, we did a type-based search for functions of type `[a] -> [a]`, got a list of results, and then used the `view` command to look at the nicely formatted source code of one of these results. Let's introduce some Unison syntax:

* `base.List.reverse : [a] -> [a]` is the syntax for giving a type signature to a definition. We pronounce the `:` symbol as "has type", as in "reverse has the type `[a] -> [a]`".
* `[Nat]` is the syntax for the type which is lists of natural numbers (terms like `[0,1,2]` and `[3,4,5]`, and `[]` will have this type), and more generally `[Foo]` is the type of lists whose elements have type `Foo`.
* Any lowercase variable in a type signature is assumed to be _universally quantified_, so `[a] -> [a]` really means and could be written `forall a . [a] -> [a]`, which is the type of functions that take a list whose elements are any type, and return a list of elements of that same type.
* `base.List.reverse` takes one parameter, called `as`. The stuff after the `=` is called the _body_ of the function, and here it's a _block_, which is an indentation demarcated  gives one parameter.
* `acc a -> ..` is the syntax for an anonymous function.
* Function arguments are separated by spaces and function application binds tighter than any operator, so `f x y + g p q` parses as `(f x y) + (g p q)`. You can always use parentheses to control grouping more explicitly.
* `use base.List cons` lets us reference `base.List.cons` using just `cons`. Import statements like this can be placed in any Unison block; they don't need to go at the top of your file.

> Try doing `view base.List.foldl` if you're curious to see how it's defined.

## Names are stored separately from definitions so renaming is fast and 100% accurate

The Unison codebase, in its definition for `reverse`, doesn't store names for the definitions it depends on (like the `foldl` function); it references these definitions via their hash. As a result, changing the name(s) associated with a definition is easy.

Let's try this out. `reverse` is defined using `List.foldl`, where `l` is a kind of pointless abbreviation of `left`. Let's rename that to `List.foldLeft` to make things clearer. Try out the following command (you can use tab completion here if you like):

```unison
.> move.term base.List.foldl base.List.foldLeft

  Done.

.> view base.List.reverse

  base.List.reverse : [a] -> [a]
  base.List.reverse as =
    use base.List cons
    base.List.foldLeft (acc a -> cons a acc) [] as
```

Notice that `view` shows the `foldLeft` name now, so the rename has taken effect. Nice!

To make this happen, Unison just changed the name associated with the hash of `foldl` _in one place_. The `view` command just looks up the names for the hashes on the fly, right when it's printing out the code.

This is important: Unison __isn't__ doing a bunch of text mutation on your behalf, updating possibly thousands of files, generating a huge textual diff, and also breaking a bunch of downstream library users who are still expecting that definition to be called by the old name. That would be crazy, right?

So rename and move things around as much as you want. Don't worry about picking a perfect name the first time. Give the same definition multiple names if you want, it's all good!

> ☝️ Using `alias.term` instead of `move.term` introduces a new name for a definition without removing the old name(s).

> 🤓 If you're curious to learn about the guts of the Unison codebase format, you can check out the [v1 codebase format specification][repoformat].

Drink some water and then let's learn more about Unison's interactive way of writing and editing code.

## Unison scratch files are like spreadsheets and replace the usual read-eval-print-loop

The codebase manager lets you make changes to your codebase and explore the definitions it contains, but it also listens for changes to any file ending in `.u` in the current directory (including any subdirectories). When any such file is saved (which we call a "scratch file"), Unison parses and typechecks that file. Let's try this out.

Keep your `unison` terminal running and open up a file, `scratch.u` (or `foo.u`, or whatever you like) in your preferred editor, and put the following in your scratch file:

```unison
---
filename: scratch.u
---
square x = x * x
```

This defines a function called `square`. It takes an argument called `x` and it returns `x` multiplied by itself.

When you save the file, Unison replies:

```unison
✅

I found and typechecked these definitions in ~/Dropbox/projects/unison/scratch.u. If you do an
`add` or `update` , here's how your codebase would change:

  ⍟ These new definitions are ok to `add`:

    square : Nat -> Nat

Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.
```

It typechecked the `square` function and inferred that it takes a natural number and returns a natural number, so it has the type `Nat -> Nat`. It also tells us that `square` is "ok to `add`". We'll do that shortly, but first, let's try calling our function right in the `scratch.u` file, just by starting a line with `>`:

```unison
---
filename: scratch.u
---
square x = x * x

> square 4
```

And Unison replies:

```unison
---
title: output
---
3 | > square 4
      ⧩
      16
```

The line `> square 4` starting with a `>` is called a "watch expression", and Unison uses these watch expressions instead of having a separate read-eval-print-loop (REPL). The code you are editing can be run interactively, right in the same spot as you are doing the editing, with a full text editor at your disposal, with the same imports all in scope, all without needing to switch to a separate tool.

__Question:__ do we really want to reevaluate all watch expressions on every file save? What if they're expensive? Luckily, Unison keeps a cache of results for expressions it evaluates, keyed by the hash of the expression, and you can clear this cache at any time without ill effects. If a result for a hash is in the cache, Unison returns that instead of evaluating the expression again. So you can think of and use your `.u` scratch files a bit like spreadsheets, which only recompute the minimal amount when dependencies change.

> 🤓 There's one more ingredient that makes this work effectively, and that's functional programming. When an expression has no side effects, its result is deterministic and you can cache it as long as you have a good key to use for the cache, like the Unison content-based hash. Unison's type system won't let you do I/O inside one of these watch expressions or anything else that would make the result change from one evaluation to the next.

Let's try out a few more examples:

```unison
---
filename: scratch.u
---
-- A comment, ignored by Unison

> base.List.reverse [1,2,3,4]
> 4 + 6
> 5.0 / 2.0
> not true
```

```unison
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

## Testing

Let's add add a test for our `square` function:

```unison
---
filename: scratch.u
---
square x = x * x

use test.v1

test> tests.square.ex1 = run (expect (4 == 16))
```

Save the file, and Unison comes back with:

```unison
7 | test> tests.square.ex1 = run (expect (square 4 == 16))

✅ Passed : Passed 1 tests.
```

Some syntax notes:

* `use test.v1` is a _wildcard use clause_. This lets us use anything from the `test.v1` namespace unqualified. For example we refer to `test.v1.run` as simply `run`.
* The `test>` prefix tells Unison that what follows is a test watch expression. Note that we're also giving a name to this expression, `tests.square.ex1`.

The `expect` function has type `Boolean -> Test`. It takes a `Boolean` expression and gives back a `Test`, which can be `run` to produce a list of test results, of type `[base.Test.Result]` (try `view base.Test.Result`). In this case there was only one result, and it was a passed test.

Let's test this a bit more thoroughly. `square` should have the property that `square a * square b == square (a * b)` for all choices of `a` and `b`. The testing library supports writing property-based tests like this. There's some new syntax here, explained afterwards:

```unison
---
filename: scratch.u
---
square x = x * x

use test.v1

test> tests.square.ex1 = run (expect (square 4 == 16))

test> tests.square.prop1 =
  go _ = a = !nat
         b = !nat
         expect (square a * square b == square (a * b))
  runs 100 go
```

```unison
8 |   go _ = a = !nat

✅ Passed : Passed 100 tests. (cached)
```

This will test our function with a bunch of different inputs. Syntax notes:

* The Unison block which begins after an `=` begins a Unison block, which can have any number of _bindings_ (like `a = ...`) all at the same indentation level, terminated by a single expression (here `expect (square ..)`), which is the result of the block.
* You can call a function parameter `_` if you just plan to ignore it. Here, `go` ignores its argument; it's just a delayed computation that will be evaluated multiple times by the `runs` function.
* `!expr` means the same thing as `expr ()`, we say that `!expr` _forces_ the delayed computation `expr`.
* Note: there's nothing special about the names `tests.square.ex1` or `tests.square.prop1`; we could call those bindings anything we wanted. Here we just picked some uncreative names based on the function being tested. Use whatever naming convention you prefer.

`nat` is imported from `test.v1` - `test.v1.nat`. It's a _generator_ of natural numbers. `!nat` generates one of these numbers.

The `square` function and the tests we've written for it are not yet part of the codebase. So far they only exists in our scratch file. Let's add it now. Switch to the Unison console and type `add`. You should get something like:

```unison
.> add

  ⍟ I've added these definitions:

    tests.square.ex1    : [base.Test.Result]
    tests.square.prop1  : [base.Test.Result]
    square              : base.Nat -> base.Nat
```

You've just added a new function and some tests to your Unison codebase. Try typing `view square` or `view tests.square.prop1`. Notice that Unison inserts precise `use` statements when rendering your code. `use` statements aren't part of your code once it's in the codebase. When rendering code, a minimal set of `use` statements is inserted automatically by the code printer, so you don't have to be precise with your `use` statements.

If you type `test` at the Unison prompt, it will "run" your test suite:

```unison
.> test

  Cached test results (`help testcache` to learn more)

  ◉ tests.square.ex1       : Passed 1 tests.
  ◉ tests.square.prop1     : Passed 100 tests.

  ✅ 2 test(s) passing

  Tip:  Use view tests.square.ex1 to view the source of a test.
```

But actually, it didn't need to run anything! All the tests had been run previously and cached according to their Unison hash. In a purely functional language like Unison, tests like these are deterministic and can be cached and never run again. No more running the same tests over and over again!

## Unison namespaces and use clauses

Now that we've added our `square` function to the codebase, how do we reference it elsewhere?

The _Unison namespace_ is the mapping from names to definitions. Names in Unison look like this: `math.sqrt`, `.base.Int`, `base.Nat`, `base.Nat.*`, `++`, or `foo`. That is: an optional `.`, followed by one or more segments separated by a `.`, with the last segment allowed to be an operator name like `*` or `++`.

We often think of these names as forming a tree, much like a directory of files, and names are like file paths in this tree. _Absolute_ names (like `.base.Int`) start with a `.` and are paths from the root of this tree and _relative_ names (like `math.sqrt`) are paths starting from the current namespace, which you can set using the `namespace` command:

```unison
.> namespace mylibrary

  ☝️  The namespace .mylibrary is empty.

.mylibrary>
```

Notice the prompt changes to `.mylibrary>`, indicating your current namespace is now `.mylibrary`. When editing scratch files, any relative names not locally bound in your file will be resolved by prefixing them with the current namespace of `.mylibrary`. And when you issue an `add` command, the definitions are put directly into this namespace. For instance, if we added `x = 42` to our scratch file and then did `.mylibrary> add`, that would create the definition `.mylibrary.x`.

> You can use `namespace .` to move back to the root.

When we added `square`, we were at the root, so `square` and its tests are directly under the root. To keep our root namespace a bit tidier, let's go ahead and move our definitions into the `mylibrary` namespace:

```unison
.mylibrary> move.term .square square

  Done.

.mylibrary> find

  1.  square  : .base.Nat -> .base.Nat

.mylibrary> move.namespace .tests tests

  Done.
```

We're using `.square` to refer to the `square` definition directly under the root, and then moving it to the _relative_ name `square`. When you're done shuffling some things around, you can use `find` with no arguments to view all the definitions under the current namespace:

```unison
.mylibrary> find

  1.  tests.square.ex1  : [.base.Test.Result]
  2.  tests.square.prop1  : [.base.Test.Result]
  3.  square  : .base.Nat -> .base.Nat
```

Also notice that we don't need to rerun our tests after this reshuffling. The tests are still cached:

```unison
.mylibrary> test

  Cached test results (`help testcache` to learn more)

  ◉ tests.square.ex1       : Passed 1 tests.
  ◉ tests.square.prop1     : Passed 100 tests.

  ✅ 2 test(s) passing

  Tip:  Use view tests.square.ex1 to view the source of a test.
```

We get this for free because the test cache is keyed by the hash of the test, not by what the test is called.

> ☝️  The `use` statement can do absolute imports as well, for instance `use .base.List map`.

When you're starting out writing some code, it can be nice to just put it in a temporary namespace, perhaps called `temp` or `scratch`. Later, without breaking anything, you can move that namespace or bits and pieces of it elsewhere, using the `move.term`, `move.type`, and `move.namespace` commands.

## Modifying an existing definition

Instead of starting a function from scratch, often you just want to slightly modify something that already exists. Here we'll make a trivial change to our `square` function. Try doing `edit square` from your prompt (note you can use tab completion):

```unison
.mylibrary> edit square
  ☝️

  I added these definitions to the top of ~/scratch.u

    square : .base.Nat -> .base.Nat
    square x =
      use .base.Nat *
      x * x

  You can edit them there, then do `update` to replace the definitions currently in this branch.
```

This copies the pretty-printed definition of `square` into you scratch file "above the fold". That is, it adds a line starting with `---` and puts whatever was already in the file below this line. Unison ignores any file contents below the fold.

> Notice that Unison has put the correct type signature on `square`. The absolute names `.base.Nat` look a bit funny. We will often do `use .base` at the top of our file to refer to all the basic functions and types in `.base` without a fully qualified name.

Let's edit `square` and instead define `square x` (just for fun) as the sum of the odd numbers less than `x * 2`:

```unison
---
filename: scratch.u
---
use Nat >

square : .base.Nat -> .base.Nat
square x = 
  go k acc = 
    if k > 0 then go (k + 1) (k * 2 `drop` 1 + acc) else acc
  go x 0
```

```unison
✅

I found and typechecked these definitions in ~/Dropbox/projects/unison/scratch.u. If you do an
`add` or `update` , here's how your codebase would change:

  ⍟ These new definitions will replace existing ones of the same name and are ok to `update`:

    square  : .base.Nat -> .base.Nat

Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.
```

Notice the message says that `square` is "ok to `update`". Let's try that:

```unison
.mylibrary> update

  ⍟ I've updated to these definitions:

    square  : .base.Nat -> .base.Nat
```

If we rerun the tests, the tests won't be cached this time, since one of their dependencies has actually changed:

```unison
.mylibrary> test

TODO: fixme - update doesn't propagate
```

Notice the message indicates that the tests weren't cached. If we do `test` again, we'll get the newly cached results.

## Publishing code

Unison code is published just by virtue of it being pushed to github; there's no separate publication step. You might choose to make a copy of your namespace. Let's go ahead and do this:

```unison
.mylibrary> path .
.> copy.path mylibrary mylibrary.releases.v1

  Done.

.> cd mylibrary.releases.v1
.mylibrary.releases.v1> find

  1.  tests.square.ex1  : [.base.Test.Result]
  2.  tests.square.prop1  : [.base.Test.Result]
  3.  square  : .base.Nat -> .base.Nat
```

But this is just a naming convention, there's nothing magic happening here.

Now let's publish our `mylibrary` to a fresh Unison repo. First, fork the Unison base library, using the button below (you'll need a GitHub account to do this). This creates a valid minimal Unison codebase repo that you can push to:

<iframe src="https://ghbtns.com/github-btn.html?user=unisonweb&repo=unisonbase&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>

> ☝️ There's nothing special about using GitHub here; you can also host your Unison git repos elsewhere. Just use whatever git URL you'd use on your git hosting provider for a `git push`.

After you've forked the base repo, you can push to it:

```unison
.mylibrary.releases.v1> path .
.> push git@github.com:<yourgithubuser>/unisonbase.git
```

You'll see some git logging output. Your code is now live on the internet!

## Installing libraries written by others

This section under construction.

From the root, do:

```unison
.> pull git@github.com:<github-username>/unisonbase.git temp
..
.> move.path temp.myfirstlibrary.releases.v1 myfirstlibrary
.> delete.path temp
```

The namespace you created is now available under `.myfirstlibrary`, so `.myfirstlibrary.square` will resolve to the function you wrote.

## What next?

* [The core language reference][langref] describes Unison's core language and current syntax in more detail.
* TODO: writing a more interesting library
