---
title: Examples of abilities
description: placeholder
---

# Examples of abilities

## `Store`

The following ability lets us write programs that have access to mutable state.

``` unison
ability Store v where
  get : v
  put : v -> ()
```

💡 Notice that this ability has a type parameter, `v`.  Abilities can have these, just like type declarations can.  

The `Store` ability can be implemented using handlers, even though Unison does not offer mutable state as a language primitive — we'll see the implementation later.  

Here's an example, using `Store` to help label a binary tree with numerical indices, in left-to-right ascending order.

``` unison
type Tree a = Branch (Tree a) a (Tree a) | Leaf

labelTree : Tree a ->{Store .base.Nat} Tree (a, .base.Nat)
labelTree t =
  use Tree Branch Leaf
  case t of
    Branch l v r ->
      use .base.Nat +
      l' = labelTree l
      n = Store.get
      Store.put (n + 1)
      r' = labelTree r
      Branch l' (v, n) r'
    Leaf -> Leaf
```

💡 Observe how the first branch of the `case` statement includes four side-effecting statements — the two lines with recursive calls to `labelTree`, and the lines in between.  Unison supports these **blocks** of statements, and handles the statements in sequence, because order of execution is important when running side-effecting code.  Note that the last line is in this case a non-side-effecting expression — the value of the block is just the value of this final expression.

> Note, the `'` in the identifiers `l'` and `r'` here are just part of the names — nothing to do with delay syntax this time.

## `IO`

The main reason for having abilities is to give our programs a way of having an effect on the world outside the program.  There is a special ability, called `IO` (for 'Input/Output'), which lets us do this.  It's built into the language and runtime, so it's not defined and implemented in the normal way, but we can take a look at its ability declaration.

``` unison
.base.io> view IO

  ability IO where
    send_ :
      Socket
      -> base.Bytes
      ->{IO} base.Either Error base.()
    getLine_ :
      Handle ->{IO} base.Either Error base.Text
    openFile_ :
      FilePath
      -> Mode
      ->{IO} base.Either Error Handle
    throw : Error ->{IO} a
    fork_ :
      '{IO} a ->{IO} base.Either Error ThreadId
    systemTime_ : {IO} (base.Either Error EpochTime)

    -- ... and many more operations, omitted here for brevity.
```

The `IO` ability spans many different types of I/O — the snippet above shows sockets, files, exceptions, and threads, as well as the system clock.  

> Typically you access these operations via the helper functions in the `.base.io` namespace, e.g. `.base.IO.systemTime : '{IO} EpochTime`.

So, since all the ways in which we can interact with the world are captured in the `IO` ability, why do we ever need any other abilities?  There are several reasons.

1. We don't want to write all our code in terms of low-level concepts like files and threads.  We want higher-level abstractions, for example persistent distributed stores for typed data, and stream-based concurrency.  The low-level stuff is what we're used to from traditional programming environments, but we want to hide it behind powerful libraries, written in Unison, that expose better abstractions.  

2. We don't want `{IO}` to feature too often in the type signatures of the functions we write, because it doesn't tell us much.  Since `IO` contains so many different types of I/O, it leaves the behavior of our functions very unconstrained.  We want to use our type signatures to document and enforce the ability requirements of our functions in a more fine-grained way.  For instance, it's useful that we know, just by looking at its signature, that `tomorrow : '{SystemTime} .base.Nat` isn't going to write to file or open a socket.  If we instead had `tomorrow : '{IO} .base.Nat`, then we'd have no such guarantee, without going and inspecting the code.  

3. Some things can be expressed well using abilities, but *don't* require interaction with the outside world. `Store` is an example.  

This leads us to a common pattern: 

👉 Typically, one ability is implemented by building on top of another.  And often, when we get down to the bottom of the pile, we'll find `IO`.  

For example, the handler for our `SystemTime` ability is going to require the `IO` ability, and it's going to call `.base.io.systemTime`.

In terms of the architecture of our programs, this typically means that the top level entry points for our 'business logic' are annotated with all the fine-grained abilities our program can use, like this:

``` unison
placeOrder : 
  Order ->{Database, 
           Log, 
           TimeService, 
           AuthService} OrderConfirmation
```

And then we have one or more functions to wrap that logic, invoking handlers to collapse the signature down to one using only `IO`, like this:

``` unison
orderServer : ServerConfig ->{IO} ()
```

> ### Executing a Unison program
> 
> Here's the help for `ucm`'s `execute` command.
> ```
> .> help execute
> 
>   `execute foo` evaluates the Unison expression 
>   `foo` of type `()` with access to the `IO` ability.
> ```
>
> This shows us that we *need* to collapse our functions down to something like `orderServer`, so Unison knows how to run them.  

## `Log`

Here's an example of an ability to let us append text to a log — for example a log file kept on disk.

``` unison
ability Log where
  log : .base.Text -> ()
```

You could imagine the handler decorating the text with timestamps and other useful contextual information.  

The `Log` ability is typical of the class of abilities which let the program emit a sequence of data or commands.  The information flow is purely *out* of the computation using the ability.  Contrast this with the `Store` and `IO` abilities, in which the flow of information is two-way, both in and out of the computation.  

Most abilities are concerned with emitting and/or receiving data from/to the program.  However, abilities can do more than that: they can affect the program's control flow in ways that a regular function can't, as shown in the next example.  

## `Abort` and `Exception`

The `Abort` ability lets us write programs which can terminate early.  

``` unison
ability Abort where
  abort : a
```

Here's `Abort` in action:

``` unison
use .base

getName : Input ->{Abort} Text
getName i = name = if not (valid i)
                   then Abort.abort
                   else extract "name" i
            canonicalName name

handleInput : Input ->{Abort} ()
handleInput i = name = getName i
                handleRequest name i
```

Suppose we're running `handleInput`, and we hit the `not (valid i)` error case inside `getName`: then we call `Abort.abort` and exit immediately.  Execution resumes from after the first enclosing `Abort` handler.  So, in this case, we exit both `getName` and `handleInput` immediately, since there's no handler in between the two.

> Note that the `abort` operation has polymorphic type, `abort : a`.  This means it can be used in any context, and still typecheck.  It doesn't actually need to be able to return an `a`, because computation is not going to continue after the call to `abort`.  In `getName`, `abort` is being used where a `Text` is required, so `a` is instantiated to `Text`.  

There's a variant of `Abort`, which lets you provide a value to describe what's happened — this is analogous to the exception handling provided in some other languages.  

``` unison
ability Exception e where
  throw : e -> a
```

The ability mechanism is sufficiently general and powerful that what might otherwise be a whole separate single-purpose language feature, exception handling, instead becomes a few lines of library code.  Isn't that cool?!

## `Choice`

Here's another example — shown here to demonstrate further the idea of an ability affecting control flow.  

``` unison
ability Choice where
  choose : .base.Boolean
```

There's a handler for this ability (which we'll see later), which gives the program not just one Boolean value after a call to `choose`, but both.  It then tries continuing the program under *both* conditions.  Each successive call to `choose` is a fork in the tree of possibilities.  The handler collects all the results from all the possible execution paths.  

This trick can be neat for exhaustively exploring a space of possibilities, for example to optimize some decision.  

That's the end of our tour of interesting example abilities.  Now let's dive deeper into the ability lists that can appear in type signatures, and what they mean.  

__Next:__ [More on abilities in type signatures](/docs/ability-tutorial/ability-signatures)