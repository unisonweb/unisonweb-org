---
title: Testing your code
description: placeholder
---

# Testing your code and adding it to the Unison namespace

Let's add a test for our `square` function:

```unison
---
filename: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x

use test.v1

test> tests.square.ex1 = run (expect (square 4 == 16))
```

Save the file, and Unison comes back with:

```
---
title: ucm
line-numbers: false
---
7 | test> tests.square.ex1 = run (expect (square 4 == 16))

✅ Passed : Passed 1 tests.
```

Some syntax notes:

* The `test>` prefix tells Unison that what follows is a test watch expression. Note that we're also giving a name to this expression, `tests.square.ex1`.

The `expect` function has type `Boolean -> Test`. It takes a `Boolean` expression and gives back a `Test`, which can be `run` to produce a list of test results, of type `[base.Test.Result]` (try `view base.Test.Result`). In this case there was only one result, and it was a passed test.

## A property-based test

Let's test this a bit more thoroughly. `square` should have the property that `square a * square b == square (a * b)` for all choices of `a` and `b`. The testing library supports writing property-based tests like this. There's some new syntax here, explained afterwards:

```unison
---
filename: scratch.u
---
use .base

square : Nat -> Nat
square x = x * x

use test.v1

test> tests.square.ex1 = run (expect (square 4 == 16))

test> tests.square.prop1 =
  go _ = a = !nat
         b = !nat
         expect (square a * square b == square (a * b))
  runs 100 go
```

```
---
title: ucm
line-numbers: false
---
8 |   go _ = a = !nat

✅ Passed : Passed 100 tests. (cached)
```

This will test our function with a bunch of different inputs.

### Syntax notes

* The Unison block which begins after an `=` begins a Unison block, which can have any number of _bindings_ (like `a = ...`) all at the same indentation level, terminated by a single expression (here `expect (square ..)`), which is the result of the block.
* You can call a function parameter `_` if you just plan to ignore it. Here, `go` ignores its argument; its purpose is just to make `go` [lazily evaluated](/docs/language-reference/expressions#delayed-computations) so it can be run multiple times by the `runs` function.
* `!expr` means the same thing as `expr ()`, we say that `!expr` _forces_ the [delayed computation](/docs/language-reference/expressions#delayed-computations) `expr`.
* Note: there's nothing special about the names `tests.square.ex1` or `tests.square.prop1`; we could call those bindings anything we wanted. Here we just picked some uncreative names based on the function being tested. Use whatever naming convention you prefer.

`nat` comes from `test.v1` - `test.v1.nat`. It's a _generator_ of natural numbers. `!nat` generates one of these numbers.

The `square` function and the tests we've written for it are not yet part of the codebase. So far they only exists in our scratch file. Let's add it now. Switch to the Unison console and type `add`. You should get something like:

```
---
title: ucm
carets: true
---
.> add

  ⍟ I've added these definitions:

    tests.square.ex1    : [base.Test.Result]
    tests.square.prop1  : [base.Test.Result]
    square              : base.Nat -> base.Nat
```

You've just added a new function and some tests to your Unison codebase. Try typing `view square` or `view tests.square.prop1`. Notice that Unison inserts precise `use` statements when rendering your code. `use` statements aren't part of your code once it's in the codebase. When rendering code, a minimal set of `use` statements is inserted automatically by the code printer, so you don't have to be precise with your `use` statements.

If you type `test` at the Unison prompt, it will "run" your test suite:

```
---
title: ucm
carets: true
---
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

We often think of these names as forming a tree, much like a directory of files, and names are like file paths in this tree. [Absolute names](languagereference.html#absolutely-qualified-identifiers) (like `.base.Int`) start with a `.` and are paths from the root of this tree and _relative_ names (like `math.sqrt`) are paths starting from the current namespace, which you can set using the `namespace` (or equivalently `cd`) command:

```
---
title: ucm
carets: true
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

.mylibrary> move.namespace .tests tests

  Done.
```

We're using `.square` to refer to the `square` definition directly under the root, and then moving it to the _relative_ name `square`. When you're done shuffling some things around, you can use `find` with no arguments to view all the definitions under the current namespace:

```
---
title: ucm
carets: true
---
.mylibrary> find

  1.  tests.square.ex1 : [.base.Test.Result]
  2.  tests.square.prop1 : [.base.Test.Result]
  3.  square : .base.Nat -> .base.Nat
```

Also notice that we don't need to rerun our tests after this reshuffling. The tests are still cached:

```
---
title: ucm
carets: true
---
.mylibrary> test

  Cached test results (`help testcache` to learn more)

  ◉ tests.square.ex1       : Passed 1 tests.
  ◉ tests.square.prop1     : Passed 100 tests.

  ✅ 2 test(s) passing

  Tip:  Use view tests.square.ex1 to view the source of a test.
```

We get this for free because the test cache is keyed by the hash of the test, not by what the test is called.

> ☝️  The `use` statement can do absolute names as well, for instance `use .base.List map`.

When you're starting out writing some code, it can be nice to just put it in a temporary namespace, perhaps called `temp` or `scratch`. Later, without breaking anything, you can move that namespace or bits and pieces of it elsewhere, using the `move.term`, `move.type`, and `move.namespace` commands.

__Next:__ [modifying definitions](/docs/tour/updating)
