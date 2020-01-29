---
title: Abilities in Unison
description: Unison provides a convenient feature called _abilities_ which lets you use the same ordinary Unison syntax for programs that do I/O, stream processing, parsing, distributed computation, and lots more.
---

# Abilities in Unison

Unison provides a convenient feature called _abilities_ which lets you use the same ordinary Unison syntax for programs that do (asynchronous) I/O, stream processing, parsing, distributed computation, and lots more. This tutorial walks the basics of how you'll interact with abilities and how they are typechecked, using `IO` as an example, then we'll cover how you can create and use new abilities for yourself. There's some (totally optional) exercises you can do along the way, and answers at the end of this document!

> 📚  Unison's "abilities" are called _algebraic effects_ in the literature. See the [bibliography](https://www.unisonweb.org/docs/bibliography/#programming-language-theory) if you're interested in the research behind this aspect of Unison.
>
> Also see [the language reference section on abilities](https://www.unisonweb.org/docs/language-reference/#abilities-and-ability-handlers).

<a id="usage"></a>

## Usage of abilities and ability checking

Functions that need to do `IO` (like `printLine`, which prints a line to the console) indicate this fact in their type signature. For instance, the function `printLine` requires `IO`:

```ucm
.> find base.io.printLine

  1. base.io.printLine : Text ->{IO} ()
  

.> view 1

  base.io.printLine : Text ->{IO} ()
  base.io.printLine t =
    putText stdout t
    putText stdout "\n"

```
Notice the `{IO}` attached to the `->` in `Text ->{IO} ()`. We read this type signature as saying that `printLine` is a function from `Text` to `()` which _requires the `IO` ability_ (or we say that its _ability requirements_ are `{IO}`). A function that requires no abilities is sometimes called _pure_.

> __Note:__ a function can have 0 or more multiple abilities inside the `{}`. If there is more than one they are separated by commas, like so: `Text ->{IO, Error Text} ()`

If we call `printLine` from another function, that function will pick up the same `IO` requirement:

```unison
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
Notice that Unison infers `IO` in the ability requirements for `greet`. If we wish to enforce that a function has no ability requirements, we can do with a type signature by using an empty `{}` after the `->`. That is, we can constrain ability requirements for functions with just a tweak to the type signature.

If we do this for `greet`, we'll get a type error called an _ability check failure_ because the function's implementation still requires `IO` but the type signature doesn't make that ability available:

```unison
greet : Text ->{} ()
greet name =
  printLine ("Hello there, " ++ name)
```

```ucm

  The expression in red needs the {base.io.IO} ability, but this location does not have access to any abilities.
  
      3 |   printLine ("Hello there, " ++ name)
  

```
The empty `{}` attached to the arrow on the `greet` type signature tells the typechecker we are expecting `greet` to be pure. The typechecker therefore complains when the function tries to call a function (`printLine`) that requires abilities.

When writing a type signature, any unadorned `->` (without `{..}` immediately following it) is treated as a request to infer the abilities associated with that function arrow. For instance, this works and `greet` gets `IO` correctly inferred as its requirement.

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
If you don't want this inference, just add a `{..}` to the arrow (as in `->{}` or `->{IO}`) to say exactly what abilities you want to make available to the function.

### Delayed computations can have ability requirements

Since a [delayed computation](/docs/language-reference#delayed-computations), `f : 'Nat` is just syntax sugar for `f : () -> Nat`, delayed computations can also have ability requirements, for instance, these both typecheck:

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

The type signature on `greet2` isn't needed and would be inferred. Likewise, to force a delayed computation of type `'{IO} a` requires that the `IO` ability be available, since the typechecker treats forcing a thunk exactly the same as calling a function.

> _Note on syntax:_ Syntactically, `a -> '{IO} Nat ->{} b` parses as `a -> ('{IO} Nat) -> b`, that is, the `'` binds tighter than the `->`.

### Ability polymorphism

Often, higher order functions (like `List.map`) don't care whether their input functions require abilities or not. We call such functions _ability polymorphic_ (or "ability parametric"). For instance, here's the definition and signature of `List.map`:

```unison
List.map : (a ->{m} b) -> [a] ->{m} [b]
List.map f as =
  go acc rem = case rem of
    [] -> acc
    hd +: tl -> go (snoc acc (f hd)) tl
  go [] as
```

Notice the function `f` has type `a ->{m} b` where `m` is a universally quantified type variable, just like `a` and `b` (there's nothing special about the variable name `m`, we could use `zonk` or `myFavTypeVar` or whatever we like). Since `List.map` is ability polymorphic, we can call it with a pure function or one requiring abilities:

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

That's the basics! See [the typechecking rule for abilities](/docs/language-reference#ability-typechecking) for more detail on the typechecking of abilities. Now let's move onto defining and _handling_ your own abilities.

<a id="creating"></a>

## Creating and handling abilities

Abilities aren't just for working with `IO`. You can create your own abilities! An _ability_ in Unison is introduced by a type declaration which has some set of operations.

### An example ability: `Stream`

A simple example ability is something like `Stream`, which can be used to produce streams of output:

```unison
ability Stream e where
  emit : e ->{Stream e} ()
  -- equivalently
  -- emit : e -> ()

Stream.range : Nat -> Nat ->{Stream Nat} ()
Stream.range n m =
  if n >= m then ()
  else
    emit n
    Stream.range (n + 1) m
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:
  
    ⍟ These new definitions are ok to `add`:
    
      ability Stream e
      Stream.range : Nat ->{Stream Nat} Nat ->{Stream Nat} ()
   
  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

```
This declaration introduces the function `Stream.emit ` which has exactly the type provided in the ability declaration: `e ->{Stream e} ()` so calling `emit` requires the `Stream e` ability. We call `emit` one of the _operations_ of the ability. In general, an ability declaration can have any number of operations in it.

The `Stream.range` example shows how we can use `emit` to produce streams. (Exercise: try changing `range` to be pure and you'll get an ability check failure.) We can think of the calls to `emit` as suspending the computation and requesting that the `emit` operation be handled by an external piece of code that will interpret the operation and (if it wants) resume the computation.

The operations of an ability are all abstract: the ability declaration just states the signatures of the operations but doesn't say how they are implemented or what they mean. We give meaning to the operations of an ability by interpreting them with a _handler_. Let's now look at an example of a handler, which interprets `Stream` computations by collecting all the emited values into a list. There's a bunch of new things here, which will all be explained!

```unison
ability Stream e where
  emit : e -> ()

Stream.range : Nat -> Nat ->{Stream Nat} ()
Stream.range n m =
  if n >= m then ()
  else
    emit n
    Stream.range (n + 1) m

Stream.toList : '{Stream a} () -> [a]
Stream.toList stream =
  handle !stream with
    h : [a] -> Request {Stream a} () -> [a]
    h acc req = case req of
      {Stream.emit e -> resume} ->
        handle resume () with h (snoc acc e)
      {u} -> acc
    h []

> Stream.toList '(Stream.range 0 10)
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:
  
    ⍟ These new definitions are ok to `add`:
    
      ability Stream e
      Stream.range  : Nat ->{Stream Nat} Nat ->{Stream Nat} ()
      Stream.toList : '{Stream a} () -> [a]
   
  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    21 | > Stream.toList '(Stream.range 0 10)
           ⧩
           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

```
What's happening here?

* Here, the recursive function `h` is the handler. Its first argument `[a]` is an accumulated list of the values emited so far. Its second argument is the requested operation, which it inspects before resuming. Handlers will frequently be recursive functions like this where the state of the handler is represented with the first argument(s) and request is the final parameter to the function. We'll explain the `case req of ...` part in a minute.
* `handle h [] in !stream` says to start evaluating the `stream` computation and if it makes any requests, pass them to the handler `h []`".
  * `h []` is just a partial application of the function `h`, `h []` will have type `Request {Stream a} () -> [a]`.
* Let's look now at the body of `h`, the `case req of ...` part:
  * In the line `{Stream.emit e -> resume}`, think of `resume` as a function which represents "the rest of the computation"  (or _continuation_) after the point in the code where the request was made. The name `resume` here isn't special, we could call it `k`, `frobnicate`, or even `_` if we planned to ignore the continuation and never resume the computation.
  * In the line `handle h (snoc acc e) in resume ()`, we are resuming the computation and saying "handle any additional requests made after resuming with the handler `h (snoc acc e)`. Notice how we are using that first parameter to `h` to represent the state we are accumulating.
  * The case `{u} -> acc` matches when there are no further operations to process (called the "pure case"). `u` can be any pattern (it could be `_` here since we are ignoring it). When matching on a `Request e a`, the type of the pure case will be `a`. Here, since we were given a `{Stream a} ()`, `u` will be of type `()`.
* See [this part of the language reference](/docs/language-reference#abilities-and-ability-handlers) for more about the syntax of `handle` blocks and handlers.

#### Exercise: writing your first handler

Try writing a function `Stream.sum : '{Stream Nat} () -> Nat` which sums up the values produced by a stream. Use a new handler rather than first converting the stream to a list.

__Bonus:__ Try defining `Stream.sum` in terms of a more general operation, `Stream.foldLeft`:

```
Stream.foldLeft : (b -> a -> b) -> b -> '{Stream b} () -> b

```

Answers are at the bottom of this tutorial.

#### Advanced exercises

Try writing the following stream functions:

```
Stream.map : (a -> b) -> '{Stream a} r -> '{Stream b} r
Stream.filter : (a -> Boolean) -> '{Stream a} () -> '{Stream a} ()
Stream.terminated : '{Stream a} () -> '{Stream (Optional a)} ()

```

`Stream.map` should apply a function to each emitted element, `filter` should skip over any elements not matching the `a -> Boolean` predicate, and `terminated` should wrap all elements emitted in `Some`, then emit a final `None` once the stream terminates.

### Another example ability: `Ask`

Here's another example ability, `Ask a`, which provides one operation, `ask`, for requesting a value of type `a` from whatever code handles the ability.

```unison
ability Ask a where
  ask : {Ask a} a
  -- equivalently, `ask : a`

Ask.provide : a -> '{Ask a} r -> r
Ask.provide a asker =
  handle !asker with
    h req = case req of
      {r}                 -> r
      {Ask.ask -> resume} -> handle resume a with h
    h

use Ask ask

> provide 10 '(1 + ask + ask)
> provide "Bob" '("Hello there, " ++ ask)
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:
  
    ⍟ These new definitions are ok to `add`:
    
      ability Ask a
      Ask.provide : a -> '{Ask a} r -> r
   
  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    15 | > provide 10 '(1 + ask + ask)
           ⧩
           21
  
    16 | > provide "Bob" '("Hello there, " ++ ask)
           ⧩
           "Hello there, Bob"

```
> __Note:__ `Ask.ask : {Ask a} a` is an example of a _nullary_ operation (it doesn't take any arguments). Nullary operations are typechecked like a function call: in order to reference a nullary operation like `ask` in a definition, its ability requirements (here, `{Ask a}`) must be available. If instead you want to pass around a nullary operation without evaluating it, you can wrap it in a quote, as in `'Ask.ask`.

`Ask.ask` requests that the handler provide a value of type `a`. The `provide` function is an example handler which always provides the same constant value. Notice the usages of it, for instance in `provide 10 (1 + ask + ask)`, which will essentially replace each `ask` with the value `10`.

A common usage of `Ask` is to avoid needing to pass around common configuration settings, just `provide myConfig 'myMain` to make `myConfig` available anywhere in `myMain` with a call to `ask`.

### Exercise (very challenging)

Computations that use `Ask a` can also be thought of as stream consumers. Try writing a function `pipe`, which can be used to statefully transform a stream:

```
Stream.pipe : '{Ask a, Stream b} r -> '{Stream a} () -> '{Stream b} ()

```

In implementing this, you'll have a handler that matches on a `Request {Ask a, Stream b} r`. Handlers that match on multiple abilities at once like this are sometimes called _multihandlers_. There's nothing special you need to do in Unison to write multihandlers; just match on the operations from more than one ability in your handler!

Once you've written `pipe`, try writing `Stream.map` and `Stream.filter` using `pipe`.

## Learning more

That's all for the basics, but here are some topics you might be interested to learn more about:

* [Other interesting examples of abilities](#other-examples). Abilities are a very general mechanism, capable of expressing exceptions, coroutines, nondeterminism, and more.
* [More about the typechecking of abilities](/docs/language-reference#ability-typechecking) in the language reference.
* If you're coming from a functional programming background and are knowledgeable about monads and the free monads, [this gist discusses the connection between abilities and the free monad](https://gist.github.com/pchiusano/2e804c2aa81894c854a6b7f27c06fe28)

## Appendix

<a id="other-examples"></a>

### Other interesting examples

#### The `Abort` and `Exception` abilities

The `Abort` ability is analogous to `Optional` and can be used to terminate a computation.

```unison
ability Abort where
  abort : forall a . {Abort} a

Abort.toOptional : '{Abort} a -> Optional a
Abort.toOptional a = handle !a with
  req -> case req of
    {a} -> Some a
    {Abort.abort -> _} -> None

Optional.toAbort : Optional a ->{Abort} a
Optional.toAbort a = case a of
  None -> Abort.abort
  Some a -> a

> Abort.toOptional 'let
    x = 1
    x + Abort.abort + 42

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
The `Exception` ability is similar, but the operation for failing the computation (which we'll call `raise`) takes an argument:

```unison
ability Exception e where
  raise : e -> a

Exception.toEither : '{Exception e} a -> Either e a
Exception.toEither a = handle !a with
  req -> case req of
    {a} -> Right a
    {Exception.raise e -> _} -> Left e

Either.toException : Either e a ->{Exception e} a
Either.toException a = case a of
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

We can use abilities to generate all possible values chosen from a list:

```unison
ability Choose where
  choose : [a] -> a

Choose.toList : '{Choose} a -> [a]
Choose.toList p = handle !p with
  h req = case req of
    {a} -> [a]
    {Choose.choose as -> resume} ->
      List.flatMap (x -> handle resume x with h) as
  h

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
<a id="answers"></a>

### Answers

```unison
ability Stream a where
  emit : a -> ()

Stream.sum : '{Stream Nat} () -> Nat
Stream.sum ns = handle !ns with
  h : Nat -> Request {Stream Nat} () -> Nat
  h acc req = case req of
    {_} -> acc
    {Stream.emit n -> resume} ->
      handle resume () with h (acc + n)
  h 0

Stream.foldLeft : (b -> a -> b) -> b -> '{Stream a} () -> b
Stream.foldLeft f b s = handle !s with
  h acc req = case req of
    {_} -> acc
    {Stream.emit a -> resume} ->
      handle resume () with h (f acc a)
  h b

Stream.terminated : '{Stream a} () -> '{Stream (Optional a)} ()
Stream.terminated s _ = handle !s with
  h : Request {Stream a} () ->{Stream (Optional a)} ()
  h req = case req of
    {_} -> emit None
    {Stream.emit a -> resume} ->
      emit (Some a)
      handle resume () with h
  h

Stream.sum' = Stream.foldLeft (Nat.+) 0

ability Ask a where
  ask : a

Stream.pipe : '{Stream a} () -> '{Ask a, Stream b} r -> '{Stream b} ()
Stream.pipe s f _ = handle !f with
  h s req = case req of
    {_} -> ()
    {Ask.ask -> resumeF} ->
      handle !s with req -> case req of
        {_} -> ()
        {Stream.emit a -> resumeS} ->
          handle resumeF a with h resumeS
    {Stream.emit b -> resumeF} ->
      emit b
      handle resumeF () with h s
  h s

Stream.filter f s =
  go _ =
    a = Ask.ask
    if f a then emit a
    else !go
  Stream.pipe s go

Stream.map f s =
  go _ = emit (f Ask.ask)
         !go
  Stream.pipe s go
```

