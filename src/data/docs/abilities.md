---
title: Abilities in Unison
description: Unison's type system tracks which functions can do I/O, and the same language feature, called _abilities_ can be used for many other things, too. This is a tutorial on abilities.
---

# Abilities in Unison

Look at the following two Unison functions. The second one writes to your computer's terminal, which, unlike the former function, means this function interacts with another system. Unison recognizes this difference and communicates it through their types. We will be exploring this topic further in this tutorial.

```unison
msg name = "Hello there " ++ name ++ "!"

greet name = printLine (msg name)
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    greet : Text ->{IO} ()
    msg   : Text -> Text

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.
```

Notice the `{IO}` attached to the `->` in `greet : Text ->{IO} ()`. We read this type signature as saying that `greet` is a function from `Text` to `()` which "while using I/O in the process". `IO` is what we call an _ability_ in Unison and we say that `greet` "requires the `IO` ability".

This tutorial covers the basics of how you'll interact with abilities and how they are type-checked, using `IO` as an example, then we'll show you how to create and use new abilities. Abilities are a simple-to-use yet powerful language feature that subsumes many other more specific language features: exceptions, asynchronous I/O, generators, coroutines, logic programming, and many more concepts. Enabled by abilities, these concepts can be expressed as regular libraries in Unison.

Let's get started! If you are interested, this tutorial has several fun exercises located throughout the text.

> 📚  Unison's "abilities" are called _algebraic effects_ in the literature. See the [bibliography](/docs/bibliography/#programming-language-theory) if you're interested in the research behind this aspect of Unison.

> Also see [the language reference section on abilities](/docs/language-reference#abilities).

<a id="usage"></a>

## Usage of abilities and ability checking

As we've seen, ability requirements are part of Unison's type system. Functions like `greet : Text ->{IO} ()` that do `IO` (such as calling `printLine`, which prints a line to the console) indicate this fact in their type signature.

A function can require multiple abilities inside the `{}`, separated by commas; a function with zero abilities inside the `{}` is sometimes called _pure_. If we try to give `greet` a type signature that says it's pure, we'll get a type error called an _ability check failure_ because the call to `printLine` still requires `IO` but its type doesn't make that ability available:

```unison
greet : Text ->{} ()
greet name =
  printLine ("Hello there, " ++ name)
```

```ucm
The expression in red needs the {base.io.IO} ability, but this location does not have access to any abilities.

    3 |   printLine ("Hello there, " ++ name)
```

In the example above, the empty `{}` attached to the arrow on the `greet` type signature tells the typechecker we are expecting `greet` to be pure. The typechecker therefore complains when the function tries to call another function (`printLine`) that requires abilities. _The ability requirements of a function `f` must include all the abilities required by any function that could be called in the body of `f`._

> 😲  Pretty nifty! The type signature tells us what operations a function may access, and when writing a function, we can limit the abilities the function can access using a type signature.

When writing a type signature, any undecorated `->`, that is, no ability brackets immediately following it, is treated as a request for Unison to infer the abilities associated with that function arrow. For instance, the following also works, and infers the same signature we had before.

```unison
greet : Text -> ()
greet name =
  printLine ("Hello there, " ++ name)
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    greet : Text ->{IO} ()

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.
```

If you _don't_ want this inference, just add ability brackets to the arrow, like `->{}` or `->{IO}`, to say exactly what abilities you want to make available to the function.

It is not possible to add an ability to a pure value. For example, the following is not valid Unison,

```unison
f : {IO} ()
f = ...
```

To add abilities to values like this, Unison introduces [delayed computations](#delayed-computations). A delayed computation is annotated using the syntax `'...`, for example `'(printLine "Hi!")` will have the type `'{IO} ()`.  Notice that the `'` can be used at the type- and term-level. The type `'a` can be expanded as `b -> a`, where `b` is any type (typically `()` is used). To force a computation you can use the syntax `!...`, this applies `()` to a delayed computation. For example `!'a` is just `a`. All of the definitions below are equivalent,

```unison
greet : Text -> ()
greet name =
  printLine ("Hello there, " ++ name)

greet1 = '(greet "Alice")

greet2 : '{IO} ()
greet2 = 'let
  greet "Alice"
  greet "Bob"
```

Above, you'll notice another language feature, `'let`, to create a delayed block computation.

> See [the language reference](/docs/language-reference#delayed-computations) for more on this.

> 🏁  In case you're wondering how to run a program that requires the `IO` ability, you can use the `run` command in `ucm`. For example, `run greet` will evaluate `!greet`. You can `run` any `'{IO} ()` functions within the codebase or in the most recently typechecked scratch file.  🏎

> _Note on syntax:_ Syntactically, `a -> '{IO} Nat ->{} b` parses as `a -> ('{IO} Nat) -> b`, that is, the `'` binds tighter than the `->`.

### Ability polymorphism

Often, higher-order functions (like `List.map`) don't care whether their input functions require abilities or not. We say such functions are _ability-polymorphic_ (or "ability-parametric"). For instance, here's the definition and signature of `List.map`, which applies a function to each element of a list:

```unison
List.map : (a ->{m} b) -> [a] ->{m} [b]
List.map f as =
  -- Details of this implementation
  -- aren't important here
  go acc = cases
    [] -> acc
    [hd] ++ tl -> go (acc ++ [f hd]) tl
  go [] as

> List.map (x -> x + 10) [1,2,3]
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    List.map : (a ->{m} b) -> [a] ->{m} [b]

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.

  10 | > List.map (x -> x + 10) [1,2,3]
          ⧩
          [11, 12, 13]
```
Notice the function argument `f` has type `a ->{m} b`, where `m`, like `a` and `b`, is a type variable. This means `m` can represent any set of abilities, according to whatever is passed in for `f`, and that the requirements of `List.map` are just the same as what `f` requires. We say that `List.map` is ability-polymorphic, since we can call it with a pure function or one requiring abilities:

```unison
greeter finalMessage =
  ex1 = List.map (x -> x + 1) [1,2,3]
  ex2 = List.map printLine ["Alice", "Bob", "Carol"]
  printLine finalMessage
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    greeter : Text ->{IO} ()

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.
```

`ex1` calls `List.map` with a pure function, and `ex2` calls it with `printLine`, which requires `IO`. Both calls work fine and we don't need two different versions of `List.map`. Also, Unison correctly infers that `greeter` itself requires `IO`, since in the body of `greeter` there are calls to `printLine`.

> _Note:_ you can also allow Unison to infer the full ability polymorphic type of `List.map`, either by leaving off the signature entirely, or just giving a signature with unadorned arrows like `List.map : (a -> b) -> [a] -> [b]` which tells Unison to infer the ability requirements on each of the arrows.

This is all you need to know to work with existing abilities. See [the typechecking rule for abilities](/docs/language-reference#ability-typechecking) for more detail on the typechecking of abilities.

<a id="creating"></a>

## Creating and handling abilities

The operations of an ability are all abstract: the ability declaration just states the signatures of requests but doesn't say how they are implemented or what they mean. We give meaning to the requests of an ability by interpreting them with a _handler_. Let's now build a handler for `Stream`, implemented by collecting each value it emits to a `List`. First, we should discuss the basics of `Request`s and the `handle` operation.

The `Stream` ability,

```unison
ability Stream e where
  emit : e ->{Stream e} ()
  -- or, emit : e -> ()
```

The ability defines one `Request` called `emit`. A request has the type `Request {Stream e} a` and contains a continuation and a value.  To interpret a request we need to `handle` it. Typically, we generate a recursive function `h` to interpret the requests. As an example, the handler converting the `Stream` computation to a `List` would have the following definition,

```unison
h : [a] -> Request {Stream a} () -> [a]
```

The first `[a]` is used as the accumulator and the latter is the result of running the handler. For example, the `Stream.emit` request can be pattern matched as follows,

```unison
{Stream.emit e -> k}
```

We can do something with `e` and then resume interpreting the program using `k`. Below is an incomplete `Stream` handler,

```unison
h : [a] -> Request {Stream a} () -> [a]
h accumulator = cases
  {Stream.emit e -> resume} -> handle resume hole0 with h hole1
  ...
```

The `hole0` will be replaced with the return type of `Stream.emit` therefore the only viable candidate is `()`. The `hole1` must be replaced with the same type as the `accumulator` and represents the next state in the interpretation of the `Stream`. In this case, we do this by appending `e` to the `accumulator`.  We need to handle all requests, in this case the only request is `Stream.emit`, defined by the ability and the result of the computation. A more complete version of `h`:

```unison
h : [a] -> Request {Stream a} () -> [a]
h accumulator = cases
  {Stream.emit e -> resume} -> handle resume () with h (accumulator :+ e)
  {u} -> accumulator
```

In the value pattern match, `u` can only ever be `()` because `Request {Stream a} ()` returns `()`. Falling through to this pattern means the computation is complete and we can simply return the `accumulator`.  Typically, `h` is embedded into an outer function which takes a delayed `Stream` computation, e.g.

```
Stream.toList : '{Stream a} () -> [a]
Stream.toList stream =
  -- insert `h` from above
  handle !stream with h []
```

The `Stream` computation is now the continuation and is handled with the function `h` partially applied to the initial accumulator `[]`.  There is more information about handlers in [this part of the language reference](/docs/language-reference#handlers)

Let's run an example,

```unison
Stream.range : Nat ->{} Nat ->{Stream Nat} ()
Stream.range n m =
  if n >= m then ()
  else
    emit n
    Stream.range (n + 1) m

> Stream.toList '(Stream.range 0 10)
```

```ucm
Now evaluating any watch expressions (lines starting with `>`)... Ctrl+C cancels.


  1 | > Stream.toList '(Stream.range 0 10)
        ⧩
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Fantastic! Let's look at another example ability `Ask`

```unison
ability Ask a where
  ask : a
  -- or, ask : {Ask a} a
```

Here is the handler for `Ask`,

```unison
Ask.provide : a -> '{Ask a} r -> r
Ask.provide x asker =
  h : '{Ask a} r -> r
  h = cases
    {Ask.ask -> resume} -> handle resume x with h
    {r}                 -> r
  handle !asker with h
```

Let's compare this to our `Stream.toList` handler. First, notice that the continuation (`resume`) is given `x : a` instead of `()` because of the return type of the request. Second, a state is not required in the function `h` because we don't need to accumulate anything. Finally, the request's pure value is polymorphic because its type is chosen by the caller e.g.,

```unison
> provide 10 '(1 + ask + ask)
> provide "Bob" '("Hello there, " ++ ask)
```

The first watch expression returns `Nat` wheres the second returns `Text`

#### Exercise: writing your first handler

Try writing a function `Stream.sum : '{Stream Nat} () -> Nat` which sums up the values produced by a stream. Use a new handler rather than first converting the stream to a list.

__Bonus:__ Try defining `Stream.sum` in terms of a more general operation, `Stream.foldLeft`:

```unison
Stream.foldLeft : (b -> a -> b) -> b -> '{Stream a} () -> b
```

##### `Stream.sum`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.sum : '{Stream Nat} () -> Nat
Stream.sum stream =
  h : Nat -> Request {Stream Nat} () -> Nat
  h acc = cases
    -- Reminder, `!k` and `k ()` are equivalent
    {Stream.emit e -> k} -> handle !k with h (e + acc) 
    {u} -> acc
  handle !stream with h 0
```

</details>

##### `Stream.foldLeft`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.foldLeft : (b -> a -> b) -> b -> '{Stream a} () -> b
Stream.foldLeft f i stream = 
  h : b -> Request {Stream a} () -> b
  h acc = cases
    {Stream.emit e -> k} -> handle !k with h (f acc e)
    {u} -> acc
  handle !stream with h i
```

</details>

##### __Bonus__ `Stream.sum`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.sum : '{Stream Nat} () -> Nat
Stream.sum = Strea.foldLeft (+) 0
```

</details>

#### Exercise: a handler that doesn't return `()`

We are going to work through this one together. The idea is to implement the following `Stream` function,

```
Stream.map : (a -> b) -> '{Stream a} r -> '{Stream b} r
Stream.map f stream =
  ...
```

- Given the signature for `h` below, try writing `Stream.emit`. Keep in mind the type of `h`, does it accumulate state? What is the only value that can be given to the continuation? If neither `h` nor the continuation can `emit` values, where should they be emitted?

```unison
h : Request {Stream a} r -> {Stream b} r
h = cases
  ...
```

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
h : Request {Stream a} r -> {Stream b} r
h = cases
  {Stream.emit e -> k} ->
    Stream.emit (f e)
    handle k () with h
```

The idea is that we make a new request `Stream.emit (f e)` before we continue evaluating the incoming stream. Remember `k ()` and `!k` are equivalent.

</details>

- Add the pure value pattern match to `h`
- Embed `h` into the `Stream.map` function 
- Write the initial handle clause
  - Reminder, you can delay a computation with `'(...)`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.map : (a -> b) -> '{Stream a} r -> '{Stream b} r
Stream.map f stream =
  h : Request {Stream a} r -> {Stream b} r
  h = cases
    {Stream.emit e -> k} ->
      Stream.emit (f e)
      handle k () with h
    {u} -> u
  '(handle !stream with h}
```

</details>

#### Exercise: implement some `Stream` utilities

Try writing the following stream functions, each of which uses an interesting handler. We recommend writing out the signature of your handler function as we did above for the `h` function above.

```unison
Stream.filter : (a -> Boolean) -> '{Stream a} () -> '{Stream a} ()
Stream.take : Nat -> '{Stream a} () -> '{Stream a} ()
Stream.terminated : '{Stream a} () -> '{Stream (Optional a)} ()
```

`Stream.filter` should skip over any elements not matching the `a -> Boolean` predicate, `take n` should emit only the first `n` elements before terminating, and `terminated` should wrap all elements emitted in `Some`, then emit a final `None` once the stream terminates.

###### `Stream.filter`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.filter : (a -> Boolean) -> '{Stream a} () -> '{Stream a} ()
Stream.filter p stream =
  h : Request {Stream a} () ->{Stream a} ()
  h = cases
    {Stream.emit e -> k} ->
      if p e
        then Stream.emit e
        else ()
      handle !k with h
    {u} -> u
  '(handle !stream with h)
```

</details>

###### `Stream.take`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```unison
Stream.take : Nat -> '{Stream a} () -> '{Stream a} ()
Stream.take n stream =
  h : Nat -> Request {Stream a} () -> {Stream a} ()
  h m = cases
    {Stream.emit e -> k} ->
      if m <= n 
        then
          Stream.emit e
          handle !k with h (m + 1)
        else ()
    {u} -> u
  '(handle !stream with h 0)
```

__Note__, be careful to handle the continuation inside the `if` statement. The following implementation typechecks but __always__ processes the entire incoming stream,

```unison
Stream.take : Nat -> '{Stream a} () -> '{Stream a} ()
Stream.take n stream =
  h : Nat -> Request {Stream a} () -> {Stream a} ()
  h m = cases
    {Stream.emit e -> k} ->
      if m <= n 
        then
          Stream.emit e
        else ()
      handle !k with h (m + 1)
    {u} -> u
  '(handle !stream with h 0)
```

</details>

###### `Stream.terminated`

<details>
<summary>👈 Click arrow to reveal the answer</summary>

```
Stream.terminated : '{Stream a} () -> '{Stream (Optional a)} ()
Stream.terminated stream =
  h : Request {Stream a} () -> {Stream (Optional a)} ()
  h = cases
    {Stream.emit e -> k} ->
      Stream.emit (Some e)
      handle !k with h
    {u} ->
      Stream.emit None
      u
  '(handle !stream with h)
```

</details>

#### Exercise: what about polymorphic return types?

In the `Stream.map` example we used a polymorphic return type `r` however in the previous exercises `()` was used. Did we need a polymorphic return type for `Stream.map`? Would any of the previous handlers change if we used `r` instead of `()`?

<details>
<summary>👈 Click arrow to reveal the answer</summary>

For the solutions presented above: no and no.

All of these functions build an output `Stream` from an input `Stream`. The only value we can pass to our continuation is `()` because `Stream.emit : e -> ()` and therefore the pure value attached to the request is always `()`.  We could write a handler to return `0 : Nat`, i.e. `{u} -> 0`, but it wouldn't offer us any advantages.

</details>

#### Abilities can be combined

The `Stream` ability is handy anytime we want to emit some values off to the side while a function is doing something else. For instance, we could use it for logging:

```unison
frobnicate : (Nat ->{IO} Nat) -> Nat ->{IO, Stream Text} Nat
frobnicate transmogrify i =
  emit ("Frobnicating: " ++ Nat.toText i)
  n = transmogrify i * transmogrify (i*2)
  emit ("I think that worked! " ++ Nat.toText n)
  n
```

This defers the choice of how to interpret the logging statements to the handler of that `Stream Text` ability. The handler might choose to ignore the `emit` statements, print them to the console, pipe them to a file, collect them in a list, etc., and the `frobnicate` function doesn't need updating.

## Learning more

That's all for the basics, but here are some topics you might be interested to learn more about:

* [Other interesting examples of abilities](#other-examples). Abilities are a very general mechanism, capable of expressing exceptions, coroutines, nondeterminism, and more.
* [More about the typechecking of abilities](/docs/language-reference#ability-typechecking) in the language reference.
* If you're coming from a functional programming background and are knowledgeable about monads and the free monad, [this gist discusses the connection between abilities and the free monad](https://gist.github.com/pchiusano/2e804c2aa81894c854a6b7f27c06fe28).

## Appendix

<a id="other-examples"></a>

### Other interesting examples

#### The `Abort` and `Exception` abilities

The `Abort` ability is analogous to `Optional` and can be used to terminate a computation.

```unison
ability Abort where
  abort : a
  -- equivalently: `abort : {Abort} a`

Abort.toOptional : '{Abort} a -> Optional a
Abort.toOptional a = handle !a with cases
  {a} -> Some a
  {Abort.abort -> _} -> None

Optional.toAbort : Optional a ->{Abort} a
Optional.toAbort = cases
  None -> Abort.abort
  Some a -> a

> Abort.toOptional 'let
    x = 1
    42 + Abort.abort + x

> Abort.toOptional 'let
    x = Optional.toAbort (Some 1)
    y = 2
    x + y
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    ability Abort
    Abort.toOptional : '{Abort} a -> Optional a
    Optional.toAbort : Optional a ->{Abort} a

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.

  15 | > Abort.toOptional 'let
          ⧩
          None

  19 | > Abort.toOptional 'let
          ⧩
          Some 3
```

That signature for `abort : {Abort} a` looks funny at first. It's saying that `abort` has a return type of `a` for any choice of `a`. Since we can call `abort` anywhere and it terminates the computation, an `abort` can stand in for an expression of any type (for instance, the first example does `42 + Abort.abort`, and the `abort` will have type `Nat`). The handler also has no way of resuming the computation after the `abort` since it has no idea what type needs to be provided to the rest of the computation.

The `Exception` ability is similar, but the operation for failing the computation (which we'll name `raise`) takes an argument:

```unison
ability Exception e where
  raise : e -> a
  -- equivalently: `raise : e -> {Exception e} a`

Exception.toEither : '{Exception e} a -> Either e a
Exception.toEither a = handle !a with cases
  {a} -> Right a
  {Exception.raise e -> _} -> Left e

Either.toException : Either e a ->{Exception e} a
Either.toException = cases
  Left e -> raise e
  Right a -> a

> Exception.toEither '(42 + raise "oh noes!")
> Exception.toEither 'let
    x = toException (Right 1)
    x + 10 + toException (Right 100)
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    ability Exception e
    Either.toException : Either e a ->{Exception e} a
    Exception.toEither : '{Exception e} a -> Either e a

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.

  15 | > Exception.toEither '(42 + raise "oh noes!")
          ⧩
          Left "oh noes!"

  16 | > Exception.toEither 'let
          ⧩
          Right 111
```

#### `Choose` for expressing nondeterminism

We can use abilities to choose nondeterministically, and collect up all results from all possible choices that can be made:

```unison
ability Choose where
  choose : [a] -> a

Choose.toList : '{Choose} a -> [a]
Choose.toList p =
  h = cases
    {a} -> [a]
    {Choose.choose as -> resume} ->
      List.flatMap (x -> handle resume x with h) as
  handle !p with h

> Choose.toList '(choose [1,2,3], choose [3,4,5])
```

```ucm
I found and typechecked these definitions in scratch.u. If you
do an `add` or `update`, here's how your codebase would
change:

  ⍟ These new definitions are ok to `add`:

    ability Choose
    Choose.toList : '{Choose} a -> [a]

Now evaluating any watch expressions (lines starting with
`>`)... Ctrl+C cancels.

  12 | > Choose.toList '(choose [1,2,3], choose [3,4,5])
          ⧩
          [ (1, 3),
            (1, 4),
            (1, 5),
            (2, 3),
            (2, 4),
            (2, 5),
            (3, 3),
            (3, 4),
            (3, 5) ]
```

> 🚧 We are looking for other nice little examples of abilities to include here, feel free to [open a PR](https://github.com/unisonweb/unisonweb-org/blob/master/src/data/transcripts/abilities.md)!
