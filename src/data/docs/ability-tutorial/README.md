---
title: Introducing abilities
description: placeholder
---

This tutorial explains how Unison handles 'effectful' computations, like storing state or performing I/O, using **abilities**.  It assumes you haven't come across abilities before, and covers everything from the ground up.  If instead you just want a quick overview of the relevant language features and syntax, take a look at the [language reference](/docs/language-reference/abilities).    

> Other languages with ability systems typically call them 'effect handlers' or 'algebraic effects', but many of the ideas are the same.

# Introducing abilities

Let's start with a whistlestop tour of how abilities work.  The subsequent sections of this tutorial will then unpack this all in more detail.  

Here's an ability declaration.

``` unison
ability SystemTime where
  -- Number of seconds since the start of 1970.
  systemTime : .base.Nat
```

It defines one **operation**, `systemTime`, which returns the system clock reading.

Now let's write some code that uses that operation to make a **request**.

``` unison
tomorrow = '(SystemTime.systemTime + 24 * 60 * 60)
```

We'll come back to this function later (including explaining the use of `'`), in [Using abilities](/docs/ability-tutorial/using-abilities).

If we add this function to the codebase we see that its requirement to have the `SystemTime` ability available is tracked in the type system.

``` unison
tomorrow : '{SystemTime} .base.Nat
```

We can combine requests to different abilities in the same function.  For example...

``` unison
use .base
use .base.io

-- We'll explain the usage of ' and ! in the 
-- section 'Using abilities'.
printTomorrow : '{IO, SystemTime} ()
printTomorrow = '(printLine (Nat.toText !tomorrow))
```

`IO` is a special ability, built in to Unison.  It's through `IO` that **effectful** Unison programs can actually interact with the outside world - writing to the console, reading from files and sockets, and any other behavior that goes beyond simply evaluating Unison expressions to a result.  When you run your program (for example using `ucm`'s `execute` command), requests in the `IO` ability are handled by the Unison runtime system.  

We'll learn more about `IO`, and other interesting abilities, in [Examples of abilities](/docs/ability-tutorial/examples-of-abilities).

Any abilities *other* than `IO` need to be handled by your code.  We can't ask `execute` to run our `printTomorrow : '{IO, SystemTime} ()` function - `execute` only accepts functions of type `'{IO}`

Here's how we can **eliminate** the `SystemTime` ability, in order to be able to run our code.

``` unison
-- This function is accepted by the 'execute' ucm command.
printTomorrow' : '{IO} ()
printTomorrow' = '(handle systemTimeToIO in !printTomorrow)
```

Here we've formed a **handle expression**, invoking a **handler** called `systemTimeToIO`, which converts our original `printTomorrow` function into one which doesn't require the `SystemTime` ability.  

We'll see more in the section [Invoking handlers](/docs/ability-tutorial/invoking-handlers).

Here's how that handler looks - it's converting the `SystemTime.systemTime` operation into a raw `IO` operation which is understood directly by the Unison runtime.  (Why not just use `IO` directly?  Because it's too low-level, and 'too powerful'.  Full reasoning is given in [Using abilities](/docs/ability-tutorial/using-abilities#IO).)

``` unison
systemTimeToIO : Request SystemTime a ->{IO} a
systemTimeToIO r =
  case r of
    { SystemTime.systemTime -> k } -> 
      handle systemTimeToIO in 
        k (epochTimeToNat !.base.io.systemTime) 
    { a } -> a
```

The handler is pattern matching on the request, handling each operation declared by the ability, plus the 'pure case' (the last line).  It's using a **continuation** (`k`) to control how the remainder of the code continues after the request.

We'll unpack all the details in the section [Writing handlers](/docs/ability-tutorial/writing-handlers).

Finally, note that there are suggestions for exercises to accompany this tutorial — see the [conclusion](/docs/ability-tutorial/conclusion).

Before we get stuck into the details of actually using abilities, we'll first take a detour to consider why they're part of the Unison language at all.

__Next:__ [Motivation](/docs/ability-tutorial/motivation)