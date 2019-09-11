---
title: Testing your code
description: placeholder
---

# Modifying existing definitions

Instead of starting a function from scratch, often you just want to slightly modify something that already exists. Here we'll make a change to the implementation of our `square` function.

## Using the `edit` command

Try doing `edit square` from your prompt (note you can use tab completion):

```
---
title: ucm
carets: true
---
.mylibrary> edit square
  ☝️

  I added these definitions to the top of ~/unisoncode/scratch.u

    square : .base.Nat -> .base.Nat
    square x =
      use .base.Nat *
      x * x

  You can edit them there, then do `update` to replace the definitions currently in this branch.
```

This copies the pretty-printed definition of `square` into you scratch file "above the fold". That is, it adds a line starting with `---` and puts whatever was already in the file below this line. Unison ignores any file contents below the fold.

> Notice that Unison has put the correct type signature on `square`. The absolute names `.base.Nat` look a bit funny. We will often do `use .base` at the top of our file to refer to all the basic functions and types in `.base` without a fully qualified name.

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
carets: true
---
✅

I found and typechecked these definitions in ~/unisoncode/scratch.u. If you do an
`add` or `update` , here's how your codebase would change:

  ⍟ These new definitions will replace existing ones of the same name and are ok to `update`:

    square : .base.Nat -> .base.Nat

Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.
```

## Adding an updated definition to the codebase

Notice the message says that `square` is "ok to `update`". Let's try that:

```
---
title: ucm
carets: true
---
.mylibrary> update

  ⍟ I've added these definitions:

    sum : [.base.Nat] -> .base.Nat

  ⍟ I've updated to these definitions:

    square             : .base.Nat -> .base.Nat
```

## Only affected tests are rerun on `update`

If we rerun the tests, the tests won't be cached this time, since one of their dependencies has actually changed:

```
---
title: ucm
carets: true
---
New test results:

◉ tests.square.prop1    : Passed 100 tests.
◉ tests.square.ex1      : Passed 1 tests.

✅ 2 test(s) passing

Tip: Use view tests.square.prop1 to view the source of a test.
```

Notice the message indicates that the tests weren't cached. If we do `test` again, we'll get the newly cached results.

The dependency tracking for determining whether a test needs rerunning is 100% accurate and is tracked at the level of individual definitions. You'll only rerun a test if one of the individual definitions it depends on has changed.

__Next:__ [Publishing code and using third-party code](/docs/tour/sharing)
