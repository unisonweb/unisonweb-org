# Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis pellentesque, lacinia dui sed, ultricies sapien. Pellentesque orci lectus, consectetur vel posuere posuere, rutrum eu ipsum..

## Subsection A

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh. Suspendisse luctus mattis cursus. Nam consectetur ante at nisl hendrerit gravida. Donec vehicula rhoncus mattis. Mauris dignissim semper mattis. Fusce porttitor a mi at suscipit. Praesent facilisis dolor sapien, vel sodales augue mollis ut. Mauris venenatis magna eu tortor posuere luctus. Aenean tincidunt turpis sed dui aliquam vehicula. Praesent nec elit non dolor consectetur tincidunt sed in felis. Donec elementum, lacus at mattis tincidunt, eros magna faucibus sem, in condimentum est augue tristique risus.

### Subheading 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
2. Ut pretium pretium tempor.
3. Ut eget imperdiet neque.
4. In volutpat ante semper diam molestie, et aliquam erat laoreet.
5. Sed sit amet arcu aliquet, molestie justo at, auctor nunc.
6. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Ut pretium pretium tempor.
- Ut eget imperdiet neque.
- In volutpat ante semper diam molestie, et aliquam erat laoreet.
- Sed sit amet arcu aliquet, molestie justo at, auctor nunc.
- Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

### Subheading 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit `amet arcu aliquet`, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

```unison
---
title: output
filename: filename
---
-- A comment. Extends to end of line.

-- Keywords:
--   if, then, else, forall, ∀, handle, in, unique, where, use, and, or, true, false,
--   with, type, ability, alias, let, namespace, case, of

-- Other notable tokens:

42, 9.7, 1e100, "hello", +99, -42, true, false -- various literals

->
  (x -> x + 1) -- used for anonymous functions:
  Nat -> Nat -- used in type signatures:

{}
  Nat ->{Async, IO} () -- used for ability lists, color should match ->

: -- Start of a type signature
  List.map : (a ->{e} b) -> [a] ->{e} [b]

[x, y, z] -- syntax for lists
(x,y) -- syntax for tuples

elems `drop` 1 -- any function can be used infix by putting it in backticks:

'x -- delays a computation
!x -- forces a delayed computation, so !('x) == x

> 1 + 1 -- A watch expression - line starting with >

-- A test watch, line starts with test>
test> runs 100 ' let
  x = !nat  --
  y = !nat
  expect (isEven (2 * (x + y)))

use base.Optional None Some -- import statement

-- handle blocks
handle state 0 in
  x = State.get + 1
  State.set x

-- More examples:

List.map : (a ->{e} b) -> [a] ->{e} [b]
List.map f a =
  go i as acc = case List.at i as of
    None -> acc
    Some a -> go (i + 1) as (acc :+ f a)
  go 0 a []

b = if true then 1 else false

ability Remote where
  spawn : Node
  at : Node -> '{Remote} a -> Future a
  force : Future a -> a

type Optional a = None | Some a

--- Three dashes marks 'the fold'. Anything below the fold is ignored by Unison.
```

```unison
---
title: output
filename: filename
---
factorial n =
    product (range 1(n+1))

factorial-at bob n =
    at bob {factorial n}
```

```unison
---
title: output
---
factorial n =
    product (range 1(n+1))

factorial-at bob n =
    at bob {factorial n}
```

```unison
factorial n =
    product (range 1(n+1))

factorial-at bob n =
    at bob {factorial n}
```

```unison
---
filename: filename
---
factorial n =
    product (range 1(n+1))

factorial-at bob n =
    at bob {factorial n}
```

### Subheading 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh.

