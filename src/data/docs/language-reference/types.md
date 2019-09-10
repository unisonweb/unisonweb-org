---
title: Types
description: placeholder
---

# Unison types
This section describes informally the structure of types in Unison.

Formally, Unison’s type system is an implementation of the system described by Joshua Dunfield and Neelakantan R. Krishnaswami in their 2013 paper [Complete and Easy Bidirectional Typechecking for Higher-Rank Polymorphism](https://arxiv.org/abs/1306.6032).

Unison extends that type system with, [pattern matching](#pattern-matching), [scoped type variables](#scoped-type-variables), _ability types_ (also known as _algebraic effects_). See the section titled [Abilities and Ability Handlers](#abilities-and-ability-handlers) for details on ability types.

## Types in Unison

Unison attributes a type to every valid expression. For example:

* `4 < 5` has type `Boolean`
* `42 + 3` has type `Nat`,
* `"hello"` has type `Text`
* the list `[1,2,3]` has type `[Nat]`
* the function `(x -> x)` has type `forall a. a -> a`

The meanings of these types and more are explained in the sections below.

A full treatise on types is beyond the scope of this document. In short, types help enforce that Unison programs make logical sense. Every expression must be well typed, or Unison will give a compile-time type error. For example:

* `[1,2,3]` is well typed, since lists require all elements to be of the same type.
* `42 + "hello"` is not well typed, since the type of `+` disallows adding numbers and text together.
* `printLine "Hello, World!"` is well typed in some contexts and not others. It's a type error for instance to use I/O functions where an `IO` [ability](#abilities-and-ability-handlers) is not provided.

Types are of the following general forms.

## Type variables
Type variables are [regular identifiers](#identifiers) beginning with a lowercase letter. For example `a`, `x0`, and `foo` are valid type variables.

## Polymorphic types
A _universally quantified_ or _polymorphic_ type has the form `forall v1 v2 vn. t`, where `t` is a type. The type `t` may involve the variables `v1` through `vn`.

The symbol `∀` is an alias for `forall`.

A type like `forall x. F x` can be written simply as `F x` (the `forall x` is implied) as long as `x` is free in `F x` (it is not bound by an outer scope; see [Scoped Type Variables](#scoped-type-variables) below).

A polymorphic type may be _instantiated_ at any given type. For example, the empty list `[]` has type `forall x. [x]`. So it's a type-polymorphic value. Its type can be instantiated at `Int`, for example, which binds `x` to `Int` resulting in `[Int]` which is also a valid type for the empty list. In fact, we can say that the empty list `[]` is a value of type `[x]` _for all_ choices of element type `e`, hence the type `forall x. [x]`.

Likewise the identity function `(x -> x)`, which simply returns its argument, has a polymorphic type `forall t. t -> t`. It has type `t -> t` for all choices of `t`.

## Scoped type variables
Type variables introduced by a type signature for a term remain in scope throughout the definition of that term.

For example in the following snippet, the type annotation `temp:x` is telling Unison that `temp` has the type `x` which is bound in the type signature, so `temp` and `a` have the same type.

``` unison
ex1 : x -> y -> x
ex1 a b =
  -- refers to the type x in the outer scope
  temp : x
  temp = a
  a
```

To explicitly shadow a type variable in scope, the variable can be reintroduced in the inner scope by a `forall` binder, as follows:

``` unison
ex2 : x -> y -> x
ex2 a b =
  -- doesn’t refer to x in outer scope
  id : ∀ x . x -> x
  id v = v
  temp = id 42
  id a
```

Note that here the type variable `x` in the type of `id` gets instantiated to two different types. First `id 42` instantiates it to `Nat`, then `id a`, instantiates it to the outer scope's type `x`.

## Type constructors
Just as values are built using data constructors, types are built from _type constructors_. Nullary type constructors like `Nat`, `Int`, `Float` are already types, but other type constructors like `List` and `->` (see [built-in type constructors](#built-in-type-constructors)) take type parameters in order to yield types. `List` is a unary type constructor, so it takes one type (the type of the list elements), and `->` is a binary type constructor. `List Nat` is a type and `Nat -> Int` is a type.

### Kinds of Types
Types are to values as _kinds_ are to type constructors. Unison attributes a kind to every type constructor, which is determined by its number of type parameters and the kinds of those type parameters.

A type must be well kinded, just like an expression must be well typed, and for the same reason. However, there is currently no syntax for kinds and they do not appear in Unison programs (this will certainly change in a future version of Unison).

Unison’s kinds have the following forms:

* A nullary type constructor or ordinary type has kind `Type`.
* A type constructor has kind `k1 -> k2` where `k1` and `k2` are kinds.

For example `List`, a unary type constructor, has kind `Type -> Type` as it takes a type and yields a type. A binary type constructor like `->` has kind `Type -> Type -> Type`, as it takes two types (it actually takes a type and yields a partially applied unary type constructor that takes the other type). A type constructor of kind `(Type -> Type) -> Type` is a _higher-order_ type constructor (it takes a unary type constructor and yields a type).

## Type application
A type constructor is applied to a type or another type constructor, depending on its kind, similarly to how functions are applied to arguments at the term level. `C T` applies the type constructor `C` to the type `T`. Type application associates to the left, so the type `A B C` is the same as the type `(A B) C`.

## Function types
The type `X -> Y` is a type for functions that take arguments of type `X` and yield results of type `Y`. Application of the binary type constructor `->` associates to the right, so the type `X -> Y -> Z` is the same as the type `X -> (Y -> Z)`.

## Tuple types
The type `(A,B)` is a type for binary tuples (pairs) of values, one of type `A` and another of type `B`.  The type `(A,B,C)` is a triple, and so on.

The type `(A)` is the same as the type `A` and is not considered a tuple.

The nullary tuple type `()` is the type of the unique value also written `()` and is pronouced “unit”.

In the standard Unison syntax, tuples of arity 2 and higher are actually of a type `Tuple a b` for some types `a` and `b`. For example, `(X,Y)` is syntactic shorthand for the type `Tuple X (Tuple Y ())`.

Tuples are either constructed with the syntactic shorthand `(a,b)` (see [tuple literals](#tuple-literals)) or with the built-in `Tuple.Cons` data constructor: `Tuple.Cons a (Tuple.Cons b ())`.

## Built-in types
Unison provides the following built-in types:

* `.base.Nat` is the type of 64-bit natural numbers, also known as unsigned integers. They range from 0 to 18,446,744,073,709,551,615.
* `.base.Int` is the type of 64-bit signed integers. They range from -9,223,372,036,854,775,808 to +9,223,372,036,854,775,807.
* `.base.Float` is the type of [IEEE 754-1985](https://en.wikipedia.org/wiki/IEEE_754-1985) double-precision floating point numbers.
* `.base.Boolean` is the type of Boolean expressions whose value is `true` or `false`.
* `.base.Bytes` is the type of arbitrary-length 8-bit byte sequences.
* `.base.Text` is the type of arbitrary-length strings of Unicode text.
* The trivial type `()` (pronounced “unit”) is the type of the nullary tuple. There is a single data constructor of type `()` and it’s also written `()`.

See [literals](#literals) for more on how values of some of these types are constructed.

## Built-in type constructors
Unison has the following built-in type constructors.

* `(->)` is the constructor of function types. A type `X -> Y` is the type of functions from `X` to `Y`.
*  `base.Tuple` is the constructor of tuple types. See [tuple types](#tuple-types) for details on tuples.
* `.base.List` is the constructor of list types. A type `List T` is the type of arbitrary-length sequences of values of type `T`. The type `[T]` is an alias for `List T`.
* `.base.Request` is the constructor of requests for abilities. A type `Request A T` is the type of values received by ability handlers for the ability `A` where current continuation requires a value of type `T`.

__Next:__ [Abilities and ability handlers](/docs/language-reference/abilities)

