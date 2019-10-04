---
title: Invoking handlers
description: placeholder
---

Now it's time to take a look at _handle expressions_.  These are the things that actually let us run code that uses abilities.  

They do this by allowing us to _eliminate_ an ability from a type signature, including by converting it to another ability, which might be `IO`.  

## Our first `handle` expression

First let's see what the type signature of a handler looks like.  We'll see some implementations in [Writing handlers](/docs/ability-tutorial/writing-handlers).  

``` unison
systemTimeToIO : 
  .builtin.Request SystemTime a ->{.builtin.io.IO} a
```

First observation: we can treat a handler just like a regular function.  The only magic in its signature is the fact that `.builtin.Request` is a special built-in type.  We'll unpack the signature more later, but for now we can just read it as a function that takes `SystemTime` requests, and handles them using `IO`.  

Now let's remember our simple function from earlier, which uses `SystemTime`.

``` unison
tomorrow : '{SystemTime} .builtin.Nat
tomorrow = '(SystemTime.systemTime + 24 * 60 * 60)
```

And now suppose we want to print the result to the console.  How can we do that?  Here's a good start:

``` unison
use .builtin
use .builtin.io

printTomorrow : '{IO, SystemTime} ()
printTomorrow = '(printLine (Nat.toText !tomorrow))
```

Notice we've already introduced some `IO`, before even eliminating `SystemTime`, to print the result to the console.  

We can't run `printTomorrow` yet.

```
.> execute !printTomorrow

  The expression in red needs these abilities: {.builtin.io.IO,
  SystemTime}, but this location only has access to the 
  {.builtin.io.IO} ability,
  
      1 | main_ = !printTomorrow
```

`execute` can only help us eliminate `IO` — any other ability we need to `handle` ourselves.  Here's how...

``` unison
printTomorrow' : '{IO} ()
printTomorrow' = '(handle systemTimeToIO in !printTomorrow)
```

That works! 👍

```
.> execute !printTomorrow'
5638144744800
```

Notice in the function definition, we needed to force `printTomorrow`, turning it into `{IO, SystemTime} ()`, then delay the result again to get a `'{IO} ()`.  The intuition here is that you need to make `printTomorrow` actually _do_ its stuff, in order to handle the `SystemTime` requests it throws out — but that you need to delay the result because you can't have `printTomorrow'` doing `IO` requests except under a delay.  

❔ Would it be better for `handle` to take a delayed function, so you could just write `printTomorrow' = handle systemTimeToIO in printTomorrow`?  Feedback welcome... 📨

So now we can use a handler to execute code that uses abilities!  

There's something slightly unsatisfying about our definition of `printTomorrow` — its signature `'{IO, SystemTime} ()` tells us it needs _both_ abilities, but we wanted to _swap_ out `SystemTime` and replace it with `IO`.  We can smarten it up a bit by splicing the definition of `printTomorrow` into `printTomorrow'`.

``` unison
printTomorrow'' : '{IO} ()
printTomorrow'' = '(handle systemTimeToIO in 
	                printLine (Nat.toText !tomorrow))

-- or, we can also do:

printTomorrow'' : '{IO} ()
printTomorrow'' = '(printLine (Nat.toText 
  (handle systemTimeToIO in !tomorrow)))
```

## Trying out a test handler

We started this tutorial by singing the praises of handlers, and how the decouple the ability interface from a specific implementation.  Let's see that in action, and use a test handler to test our `tomorrow` function.  

Suppose we have a handler like this:

``` unison
use .builtin
systemTimeToPure : [Nat] -> Request SystemTime a -> a
```

We can feed this handler a list of values we'd like it to return to each successive `systemTime` request.  And the resultant handled expression is pure — it doesn't need to map through to `.builtin.io.systemTime`.  

Let's test `tomorrow`:

``` unison
use test.v1

test> tests.square.ex1 = run (expect ((handle 
	    (systemTimeToPure [0]) in !tomorrow) == 86400))
```

Awesome! 💥 

## Stacking handlers

Suppose our `labelTree` function from earlier reported its progress to a log.

``` unison
use .builtin
labelTree : Tree a ->{Store Nat, Log} Tree (a, Nat)
```

And suppose we have the following.

``` unison
-- Handlers for each ability.
logHandler : [Text] -> Request Log a -> (a, [Text])
storeHandler : v -> Request (Store v) a -> a
-- The first arguments to each of these are the initial  
-- values of the log and the store, respectively.  

-- Some data to work on.
tree : Tree Text
tree = Branch Leaf "Hi!" Leaf

-- A helper function.
fst : (a, b) -> a
```

Then here's how we run `labelTree`, eliminating both abilities.  We just need two nested handle expressions.

``` unison
labelledTree : Tree (Text, Nat)
labelledTree = fst (handle logHandler [] in 
  (handle storeHandler 0 in (labelTree tree)))
-- The call to fst just discards the log output.
```

Note that we could equally well have swapped the order we handle the two abilities.  

__Next:__ [Writing handlers](/docs/ability-tutorial/writing-handlers)