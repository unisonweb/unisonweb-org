---
title: Interactive scratch files, not a REPL
description: Unison scratch files replace the traditional REPL for interactive development
slug: scratch-files
---

# Unison scratch files are like spreadsheets and replace the usual read-eval-print-loop

The codebase manager lets you make changes to your codebase and explore the definitions it contains, but it also listens for changes to any file ending in `.u` in the current directory (including any subdirectories). When any such file is saved (which we call a "scratch file"), Unison parses and typechecks that file. Let's try this out.

Keep your `ucm` terminal running and open up a file, `scratch.u` (or `foo.u`, or whatever you like) in your preferred text editor (if you want syntax highlighting for Unison files, [follow this link][editorsetup] for instructions on setting up your editor).

Now put the following in your scratch file:

```unison
---
filename: scratch.u
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
filename: scratch.u
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

__Next:__ [Testing your code](/docs/tour/testing)
