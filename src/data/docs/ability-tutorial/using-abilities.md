---
title: Using abilities
description: placeholder
---

OK, let's get started.  We're going to return to the example from the [Introduction](/docs/ability-tutorial), but step through it more thoroughly.  

Here's the declaration of the `SystemTime` ability, which lets us write code that can read the system clock.

``` unison
ability SystemTime where
  -- Number of seconds since the start of 1970.
  systemTime : .builtin.Nat
```

It defines one operation, `systemTime`, which returns the clock reading.  An operation is a function that can be used from code which has this ability _available_ (as described in the next section).  Let's use this operation to write some code.

``` unison
tomorrow = '(SystemTime.systemTime + 24 * 60 * 60)
```

This code is making a request using the `SystemTime.systemTime` operation.  Notice also the delay, that is, the use of the `'`.  

> 🐘 Remember that when an expression `e` has type `t`, `'e` has type `() -> e` — that is, a function which takes an argument of the unit type, and returns an `e`.  See [delayed computations](/docs/language-reference/expressions#delayed-computations) for more detail.

We're using the `'` to turn `tomorrow` into a function rather than just a regular value.  That's because it's only in the process of a function doing some computation that it makes sense to make a request using an ability.  A value can't do it — it's just sitting there, with no more computation to do.  

So the following wouldn't make sense:

``` unison
-- wrong
tomorrow = SystemTime.systemTime + 24 * 60 * 60
```

On the one hand, this code would be saying we just want `tomorrow` to be a computed value, just a `Nat` we've got in the bag.  But on the other it's saying we want to compute it with the help of the system clock.  When do we want that computation to happen — when we first add it to the codebase?  That wouldn't make sense.  

So we need add the `'` delay, to turn `tomorrow` into function, so we can force the computation at the right moment (and with the help of a handler, which we'll come to later). 

Here's the key point to remember: 

👉 Only functions can make requests.

> Unison is a 'purely functional' language.  That means that evaluation of terms *cannot* in itself be effectful.  Having to add the `'` delay to effectfully-computed values is a consequence of that.  Any effectful code needs to pull its punches — it's not causing effects to happen during evaluation, but rather it's evaluating to a function which can then explain to a handler what effects it would *like* to be performed.  We'll see how that handler in turn can only either (a) turn the requested effects into pure computations, ready for evaluation, or (b) pass the buck, by translating them to requests in another ability, yielding another function.  If there are abilities like network or disk I/O, then the buck gets passed all the way to the very outside of the program, and into the Unison runtime system, using the `IO` ability.  At no point does a Unison term's evaluation ever *directly* generate an effect.    

## Type signatures of functions using abilities

If we add `tomorrow` to the codebase, Unison tells us it's inferred the following signature:

``` unison
tomorrow : '{SystemTime} .builtin.Nat
```
> 🐘 Again, that `'` is syntactic sugar for delayed function types — this signature is equivalent to `() ->{SystemTime} .builtin.Nat`. 

> 🐞 You may see a `∀` in the signature, due to Unison issue [#689](https://github.com/unisonweb/unison/issues/689).

The `{SystemTime}` is an **ability list** — in this case a list of just one ability.  It's saying that `tomorrow` _requires_ the `SystemTime` ability — that ability needs to be _available_ in functions that call `tomorrow`.  And it's also saying that the `SystemTime` ability is available for use within the definition of `tomorrow` itself.  If a function of type `'.builtin.Nat` tried to make a `SystemTime.systemTime` request, Unison would reject it with an 'ability check failure': the ability required for that request is not in the set of *ambient abilities* (which is empty in this case).  

Suppose you're writing a function `foo` which should call `tomorrow`.  There are two ways of making the `SystemTime` ability available:
1. Put an ability list containing `SystemTime` in the signature of `foo`, the same as with the signature of `tomorrow`.  Indeed, if you leave the signature of `foo` unspecified, this ability list will be inferred again.  In this way the `SystemTime` requirement propagates up the function call graph.  
2. Use a handler.  This is how we stop that propagation.  We'll get on to handlers later.  

So now we've seen another key point about abilities:

👉 The requirement for an ability propagates from one function's signature to all its callers' signatures (until terminated by a handler).

This propagation is supported through the ability type inference mechanism as we've seen.  It's also _enforced_ by the type-checker — you can't get away with omitting one of these abilities if it's in fact required in your function (or a function it calls).  The typechecker makes sure that our ability lists faithfully reflect what's going on.  

### Type signatures in ability declarations

Let's revisit the ability declaration we started with.

``` unison
ability SystemTime where
  systemTime : .builtin.Nat
```

There's a significant piece of information that's been elided here for brevity.  The full and unabridged version of this declaration would be the following.

``` unison
ability SystemTime where
  systemTime : {SystemTime} .builtin.Nat
```

Note the ability list that's appeared in the operation signature.  Just as `tomorrow` has this ability in its signature, which therefore propagates to up to `foo` (in the example from the previous section), so `systemTime` did even beforehand, and it was this which propagated to `tomorrow` in the first place.  

The reason we can omit the name of the ability being defined from its operations' signatures is that, logically, it always needs to be there — using an ability's operation requires that ability.  So as far as Unison is concerned, this bit of an ability's type signature 'goes without saying'.  You can write it either way.  

> 🤔 An ability declaration is the only place you'll see an ability list in a signature that doesn't follow the rule that 'only functions can make requests' — i.e. the only place you can have a `{SystemTime}` not following a `->` or a `'`.

__Next:__ [Examples of abilities](/docs/ability-tutorial/examples-of-abilities)