---
title: Abilities and ability handlers
description: placeholder
---


# Abilities and ability handlers
Unison provides a system of _abilities_ and _ability handlers_ as a means of modeling computational effects in a purely functional language.

Unison is a purely functional language, so no expressions are allowed to have _side effects_, meaning they are evaluated to a result and nothing else. But we still need to be able to write programs that have _effects_, for example writing to disk, communicating over a network, generating randomness, looking at the clock, and so on. Ability types are Unison's way of allowing an expression to request effects it would like to have. Handlers then interpret those requests, often by translating them in turn to a computation that uses the built-in `IO` ability. Unison has a built-in handler for the `IO` ability which cannot be invoked in Unison programs (it can only be invoked by the Unison runtime). This allows Unison to provide I/O effects in a purely functional setting.

Unison's system of abilities is based on the Frank language by Sam Lindley, Conor McBride, and Craig McLaughlin (https://arxiv.org/pdf/1611.09259.pdf). Unison diverges slightly from the scheme detailed in this paper. In particular, Unison's ability polymorphism is provided by ordinary polymorphic types, and a Unison type with an empty ability set explicitly disallows any abilities. In Frank, the empty ability set implies an ability-polymorphic type.

See also the in-depth tutorial, [Introducing abilities](/docs/ability-tutorial).

## Abilities in function types

The general form for a function type in Unison is `I ->{A} O`, where `I` is the input type of the function, `O` is the output type, and `A` is the set of _abilities_ that the function requires.

A function type in Unison like `A -> B` is really syntactic sugar for a type `A ->{e} B` where `e` is some set of abilities, possibly empty. A function that definitely requires no abilities has a type like `A ->{} B` (it has an empty set of abilities).

If a function `f` calls in its implementation another function requiring ability set `{A}`, then `f` will require `A` in its ability set as well. If `f` also calls a function requiring abilities `{B}`, then `f` will require abilities `{A,B}`.

Stated the other way around, `f` can only be called in contexts where the abilities `{A,B}` are available. Abilities are provided by `handle` blocks. See the [Ability Handlers](/docs/language-reference/abilities/#ability-handlers) section below. The only exception to abilities being provided by handlers is the built-in provider of the `IO` ability in the Unison runtime.

## User-defined abilities

A user-defined ability is declared with an `ability` declaration such as:

``` unison
ability Store v where
  get : v
  put : v -> ()
```

This results in a new ability type constructor `Store` which takes a type argument `v`. It also create two value-level constructors named `get` and `put`. The idea is that `get` provides the ability to "get" a value of type `v` from somewhere, and `put` allows "putting" a value of type `v` somewhere. Where exactly these values of type `v` will be kept depends on the handler.

The `Store` constructors `get` and `put` have the following types:

* `get : forall v. {Store v} v`
* `put : forall v. v ->{Store v} ()`

The type `{Store v}` means that the computation which results in that type requires a `Store v` ability and cannot be executed except in the context of an _ability handler_ that provides the ability.

## Ability handlers

A constructor `{A} T` for some ability `A` and some type `T`  (or a function which uses such a constructor), can only be used in a scope where the ability `A` is provided. Abilities are provided by `handle` expressions:

``` unison
handle h in x
```

This expression gives `x` access to abilities handled by the function `h` which must have the type `Request A T -> T` if `x` has type `{A} T`. The type constructor `Request` is a special builtin provided by Unison which will pass arguments of type `Request A T` to a handler for the ability `A`.

The examples in the next section should help clarify how ability handlers work.

### Pattern matching on ability constructors

Each constructor of an ability corresponds with a _pattern_ that can be used for pattern matching in ability handlers. The general form of such a pattern is:

``` unison
{A.c p_1 p_2 p_n -> k}
```

Where `A` is the name of the ability, `c` is the name of the constructor, `p_1` through `p_n` are patterns matching the arguments to the constructor, and `k` is a _continuation_ for the program. If the value matching the pattern has type `Request A T` and the constructor of that value had type `X ->{A} Y`, then `k` has type `Y -> {A} T`.

The continuation will always be a function accepting the return value of the ability constructor, and the body of this function is the remainder of the `handle .. in` block immediately following the call to the constructor. See below for an example.

A handler can choose to call the continuation or not, or to call it multiple times. For example, a handler can ignore the continuation in order to handle an ability that aborts the execution of the program:

``` unison
ability Abort where
  aborting : ()

-- Returns `a` immediately if the program `e` calls `abort`
abortHandler : a -> Request Abort a -> a
abortHandler a e = case e of
   { Abort.aborting -> _ } -> a
   { x } -> x

p : Nat
p = handle abortHandler 0 in
  x = 4
  Abort.aborting
  x + 2

```

The program `p` evaluates to `0`. If we remove the `Abort.aborting` call, it evaluates to `6`.

Note that although the ability constructor is given the signature `aborting : ()`, its actual type is `{Abort} ()`.

The pattern `{ Abort.aborting -> _ }` matches when the `Abort.aborting` call in `p` occurs. This pattern ignores its continuation since it will not invoke it (which is how it aborts the program). The continuation at this point is the expression `_ -> x + 2`.

The pattern `{ x }` matches the case where the computation is pure (makes no further requests for the `Abort` ability and the continuation is empty). A pattern match on a `Request` is not complete unless this case is handled.

When a handler calls the continuation, it needs describe how the ability is provided in the continuation of the program, usually with a recursive call, like this:

``` unison
use .base Request

ability Store v where
  get : v
  put : v -> ()

storeHandler : v -> Request (Store v) a -> a
storeHandler storedValue s = case s of
  {Store.get -> k} ->
    handle storeHandler storedValue in k storedValue
  {Store.put v -> k} ->
    handle storeHandler v in k ()
  {a} -> a
```

Note that the `storeHandler` has a `handle` clause that uses `storeHandler` itself to handle the `Requests`s made by the continuation. So it’s a recursive definition. The initial "stored value" of type `v` is given to the handler in its argument named `storedValue`, and the changing value is captured by the fact that different values are passed to each recursive invocation of the handler.

In the pattern for `Store.get`, the continuation `k` expects a `v`, since the return type of `get` is `v`. In the pattern for `Store.put`, the continuation `k` expects `()`, which is the return type of `put`.

It's worth noting that this is a mutual recursion between `storeHandler` and the various continuations (all named `k`). This is no cause for concern, as they call each other in tail position and the Unison compiler performs [tail call elimination](/docs/language-reference/expressions/#function-application).

An example use of the above handler:

``` unison
modifyStore : (v -> v) ->{Store v} ()
modifyStore f =
  v = Store.get
  Store.put (f v)
```

Here, when the handler receives `Store.get`, the continuation is `v -> Store.put (f v)`. When the handler receives `Store.put`, the continuation is `_ -> ()`.

__Next:__ [Name resolution and the environment](/docs/language-reference/name-resolution)
