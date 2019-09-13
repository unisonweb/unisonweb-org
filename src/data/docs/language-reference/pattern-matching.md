---
title: Case expressions and pattern matching
description: placeholder
---

# Case expressions and pattern matching

A _case expression_ has the general form:

``` unison
case e of
  pattern_1 -> block_1
  pattern_2 -> block_2
  ...
  pattern_n -> block_n
```

Where `e` is an expression, called the _scrutinee_ of the case expression, and each _case_ has a [pattern to match against the value of the scrutinee](#pattern-matching) and a [block](/docs/language-reference/blocks) to evaluate in case it matches.

The evaluation semantics of case expressions are as follows:
1. The scrutinee is evaluated.
2. The first pattern is evaluated and matched against the value of the scrutinee.
3. If the pattern matches, any variables in the pattern are substituted into the block to the right of its `->` (called the _match body_) and the block is evaluated. If the pattern doesn’t match then the next pattern is tried and so on.

It's possible for Unison to actually evaluate cases in a different order, but such evaluation should always have the same observable behavior as trying the patterns in sequence.

It is an error if none of the patterns match. In this version of Unison, the  error occurs at runtime. In a future version, this should be a compile-time error.

## Pattern matching
A _pattern_ has one of the following forms:

### Blank patterns
A _blank pattern_ has the form `_`. It matches any expression without creating a variable binding.

For example:

``` unison
case 42 of
  _ -> "Always matches"
```

### Literal patterns
A _literal pattern_ is a literal `Boolean`, `Nat`, `Int`, `Float`, or `Text`. A literal pattern matches if the scrutinee has that exact value.

For example:

``` unison
case 2 + 2 of
  4 -> "Matches"
  _ -> "Doesn't match"
```

### Variable patterns
A _variable pattern_ is a [regular identifier](/docs/language-reference/identifiers) and matches any expression. The expression that it matches will be bound to that identifier as a variable in the match body.

For example, this expression evaluates to `3`:

``` unison
case 1 + 1 of
  x -> x + 1
```

### As-patterns
An _as-pattern_ has the form `v@p` where `v` is a [regular identifier](/docs/language-reference/identifiers) and `p` is a pattern. This pattern matches if `p` matches, and the variable `v` will be bound in the body to the value matching `p`.

For example, this expression evaluates to `3`:

``` unison
case 1 + 1 of
  x@4 -> x * 2
  y@2 -> y + 1
  _   -> 22
```

### Constructor patterns
A _constructor pattern_ has the form `C p1 p2 ... pn` where `C` is the name of a data constructor in scope, and `p1` through `pn` are patterns such that `n` is the arity of `C`. Note that `n` may be zero. This pattern matches if the scrutinee reduces to a fully applied invocation of the data constructor `C` and the patterns `p1` through `pn` match the arguments to the constructor.

For example, this expression uses `Some` and `None`, the constructors of the `Optional` type, to return the 3rd element of the list `xs` if present or `0` if there was no 3rd element.

``` unison
case List.at 3 xs of
  None -> 0
  Some x -> x
```

### List patterns

A _list pattern_ matches a `List t` for some type `t` and has one of three forms:

1. `head +: tail` matches a list with at least one element. The pattern `head` is matched against the first element of the list and `tail` is matched against the suffix of the list with the first element removed.
2. `init :+ last` matches a list with at least one element. The pattern `init` is matched against the prefix of the list with the last element removed, and `last` is matched against the last element of the list.
3. A _literal list pattern_ has the form `[p1, p2, ... pn]` where `p1` through `pn` are patterns. The patterns `p1` through `pn` are  matched against the elements of the list. This pattern only matches if the length of the scrutinee is the same as the number of elements in the pattern. The pattern `[]` matches the empty list.

Examples:

``` unison
first : [a] -> Optional a
first as = case as of
  h +: _ -> Some h
  [] -> None

last : [a] -> Optional a
last as = case as of
  _ :+ l -> Some l
  [] -> None

exactlyOne : [a] -> Boolean
exactlyOne a = case a of
  [_] -> true
  _   -> false
```

### Tuple patterns
 A _tuple pattern_ has the form `(p1, p2, ... pn)` where `p1` through `pn` are patterns. The pattern matches if the scrutinee is a tuple of the same arity as the pattern and `p1` through `pn` match against the elements of the tuple. The pattern `(p)` is the same as the pattern `p`, and the pattern `()` matches the literal value `()` of the trivial type `()` (both pronounced “unit”).

For example, this expression evaluates to `4`:

``` unison
case (1,2,3) of
  (a,_,c) -> a + c
```

### Ability patterns
An _ability pattern_ only appears in an _ability handler_ and has one of two forms (see [Abilities and ability handlers](/docs/language-reference/abilities) for details):

1. `{C p1 p2 ... pn -> k}` where `C` is the name of an ability constructor in scope, and `p1` through `pn` are patterns such that `n` is the arity of `C`. Note that `n` may be zero. This pattern matches if the scrutinee reduces to a fully applied invocation of the ability constructor `C` and the patterns `p1` through `pn` match the arguments to the constructor.  The scrutinee must be of type `Request A T` for some ability `{A}` and type `T`. The variable `k` will be bound to the continuation of the program. If the scrutinee has type `Request A T` and `C` has type `X ->{A} Y`, then `k` has type `Y -> {A} T`.
2. `{p}` where `p` is a pattern. This matches the case where the computation is _pure_ (the value of type `Request A T` calls none of the constructors of the ability `{A}`). A pattern match on an `Request` is not complete unless this case is handled.

See the section on [abilities and ability handlers](/docs/language-reference/abilities) for examples of ability patterns.

### Guard patterns
A _guard pattern_ has the form `p | g` where `p` is a pattern and `g` is a Boolean expression that may reference any variables bound in `p`. The pattern matches if `p` matches and `g` evaluates to `true`.

For example, the following expression evaluates to 6:

``` unison
case 1 + 2 of
  x | x == 4 -> 0
  x | x + 1 == 4 -> 6
  _ -> 42
```

