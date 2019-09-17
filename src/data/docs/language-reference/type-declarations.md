---
title: User-defined types
description: placeholder
---

# User-defined data types

A user-defined data type is introduced with the `type` keyword.

For example:

``` unison
type Optional a = None | Some a
```

The `=` sign splits the definition into a _left-hand side_ and a _right-hand side_, much like term definitions.

The left-hand side is the data type being defined. It gives a name for the data type and declares a new _type constructor_ with that name (here it’s named `Optional`), followed by names for any type arguments (here there is one and it’s called `a`). These names are bound as type variables in the right-hand side. The right-hand side may also refer to the name given to the type in the left-hand side, in which case it is a recursive type declaration. Note that the fully saturated type construction `Optional Nat` is a type, whereas `Optional` by itself is a type constructor, not a type (it requires a type argument in order to construct a type).

The right-hand side consists of zero or more data constructors separated by `|`. These are _data constructors_ for the type, or ways in which values of the type can be constructed. Each case declares a name for a data constructor (here the data constructors are `None` and `Some`), followed by the **types** of the arguments to the constructor.

When Unison compiles a type definition, it generates a term for each data constructor. Here they are the terms `Optional.Some : a -> Optional a`, and `Optional.None : Optional a`. It also generates _patterns_ for matching on data (see [Pattern Matching](/docs/language-reference/pattern-matching)).

Note that these terms and patterns receive qualified names: if the type named `x.y.Z` has a data constructor `C`, the generated term and pattern for `C` will be named `x.y.Z.C`.

The general form of a type declaration is as follows:

``` unison
<unique<[<regular-identifier>]?>?> type TypeConstructor p1 p2 … pn
  = DataConstructor_1
  | DataConstructor_2
  ..
  | DataConstructor_n
```

The optional `unique` keyword introduces a [unique type](/docs/language-reference/type-declarations/#unique-types), explained in the next section.

## Unique types

A type declaration gives a name to a type, but Unison does not uniquely identify a type by its name. Rather, the [hash](/docs/language-reference/hashes) of a type's definition identifies the type. The hash is based on the _structure_ of the type definition, with all identifiers removed.

For example, Unison considers these type declarations to declare _the exact same type_, even though they give different names to both the type constructor and the data constructors:

``` unison
type Optional a = Some a | None

type Maybe a = Just a | Nothing
```

So a value `Some 10` and a value `Just 10` are in fact the same value and these two expressions have the same type. Even though one nominally has the type `Optional Nat` and the other `Maybe Nat`, Unison understands that as the type `#5isltsdct9fhcrvu ##Nat`.

This is not always what you want. Sometimes you want to give meaning to a type that is more than just its structure. For example, it might be confusing that these two types are identical:

``` unison
type Suit = Hearts | Spades | Diamonds | Clubs

type Direction = North | South | East | West
```

Unison will consider every unary type constructor with four nullary data constructors as identical to these declarations. So Unison will not stop us providing a `Direction` where a `Suit` is expected.

The `unique` keyword solves this problem:

``` unison
unique type Suit = Hearts | Spades | Diamonds | Clubs

unique type Direction = North | South | East | West
```

When compiling these declarations, Unison will generate a [universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) for the type and use that identifier when generating the hash for the type. As a result, the type gets a hash that is universally unique.

## Record types

In the type declarations discussed above, the arguments to each data constructor are nameless.  For example:

``` unison
type Point = Point Nat Nat
```

Here, the data type `Point` has a constructor `Point.Point`, with two arguments, both of type `Nat`.  The arguments have no name, so they are identified positionally, for example when creating a value of this type, like `Point.Point 1 2`.

Types with a single data constructor can also be defined in the following style, in which case they are called _record types_.

``` unison
type Point = { x : Nat, y : Nat }
```

This assigns names to each argument of the constructor.  The effect of this is to generate some accessor methods, to help get, set, and modify each field.

``` unison
Point.x        : Point -> Nat
Point.x.modify : (Nat -> Nat) -> Point -> Point
Point.x.set    : Nat -> Point -> Point
Point.y        : Point -> Nat
Point.y.modify : (Nat -> Nat) -> Point -> Point
Point.y.set    : Nat -> Point -> Point
```

> 👉 Note that `set` and `modify` are returning new, modified copies of the input record - there's no mutation of values in Unison.

There's currently no special syntax for creating or pattern matching on records.  That works the same as for regular data types:

``` unison
p = Point.Point 1 2
px = case p of
       Point.Point x _ -> x
```

## User-defined abilities

A user-defined _ability_ declaration has the following general form:

``` unison
ability A p_1 p_2 … p_n where
  Request_1 : Type_1
  Request_2 : Type_2
  Request_n : Type_n
```

This declares an _ability type constructor_ `A` with type parameters `p_1` through `p_n`, and _request constructors_ `Request_1` through `Request_n`.

See [Abilities and Ability Handlers](/docs/language-reference/abilities) for more on user-defined abilities.

Next: [Expressions](/docs/language-reference/expressions)
