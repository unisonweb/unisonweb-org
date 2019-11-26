# Refactoring and modifying code in Unison

This document walks through how refactoring and updates to existing definitions works in Unison. It shows the UCM commands you'll use when refactoring. As a running example, we'll use a small library for computing the answers to important questions like: "What's our ingredient list and quantities if we are making enough pecan pie to serve 12 people?"

Unison takes a different approach to refactoring and updating code: rather than modifying definitions in place, which generates lots of (often misleading) compile errors and prevents you from running or writing other code, Unison refactoring is a structured process whereby a new, compiling version of the code is built up incrementally off to the side. We like this process much better and it has significant benefits:

* A Unison codebase is always runnable and never broken, even when in the middle of a refactoring.
* There's no need to "upgrade your whole codebase" just to be able to test out or play with a code change within some smaller context.

For more about the theory, [this talk on Unison may be of interest](https://www.youtube.com/watch?v=IvENPX0MAZ4).

> 📒 This document is a [Unison transcript](/docs/transcripts) which are executable Markdown documents with embedded Unison code and UCM commands. These are often used to create tutorials and other documentation that show interaction with UCM. The source of this transcript is [here](https://github.com/unisonweb/unisonweb-org/tree/master/src/data/transcripts/refactoring.md). Suggestions for improvements and PRs are welcome!

## Setting up the example

If you'd like to follow along, you can fetch the code via these commmands (the first command which fetches the base library can be omitted if you already have a copy in your codebase):

```ucm:hide
.> pull git@github.com:unisonweb/refactoring-example.git:.base .base
.> pull git@github.com:unisonweb/refactoring-example.git:.cooking .cooking
```

The basic data type used in the `cooking` library is just a wrapper around a `Map Ingredient Float`, where the `Float` (a 64-bit floating point value) represents the quantity of the ingredient and `Ingredient` is just a wrapper around `Text`:

```ucm
.cooking> view Ingredient Ingredients
```

Let's browse through the rest of the library and take a look at a few of the ingredient lists:

```ucm
.cooking> ls
```

Notice that `pieCrust` is used in `pumpkinPie`, which is used in `thanksgivingDessert`, which is used in `thanksgivingDinner`:

```ucm
.cooking> view pieCrust pumpkinPie thanksgivingDessert
```

## The easy case: a type preserving change

First we'll do the easy case and change the implementation of a definition `pumpkinPie` without changing its type. This will create a new definition with a new hash and will automatically create a new definition for its dependents (such as  `thanksgivingDessert`).

We first note the hashes of `pumpkinPie` and `thanksgivingDessert`:

```ucm
.cooking> names pumpkinPie
.cooking> names thanksgivingDessert
```

Okay, now let's add extra pumpkin spices to the `pumpkinPie`:

```unison
pumpkinPie =
  sum [ amount 1.0 pieCrust
      -- "This one goes to 11"
      , amount 11.0 pumpkinSpices
      , amount (cans 1.0) pumpkin
      , amount 2.0 egg
      ]
```

Then let's `update`:

```ucm
.cooking> update
.cooking> view pumpkinPie
```

The definitions has "changed", but actually, what we've done is just introduce a new definition, with a new hash, and recorded this mapping from the old hash to the new hash in what's called a patch:

```ucm
.cooking> view.patch
```

The patch only mentions the one edit we made. But notice that `thanksgivingDessert` also has a new hash:

```ucm
.cooking> names thanksgivingDessert
```

### Well-typed patch propagation

What's going on here? After commands like `update`, Unison does what is called "well-typed patch propagation": it visits the definitions in the namespace in "dependency order" (visiting `thanksgivingDessert` before visiting definitions like `thanksgivingDinner` that depend on it), applies the patch to each definition, and then typechecks the result. If the definition typechecks, that becomes the new definition and Unison visits the dependents of that definition, and so on. Once this propagation completes, we are left with a codebase that still typechecks!

A Unison codebase _always typechecks and is never broken_. This raises a question: what happens if you  make breaking changes to a definition? We will look at that next!

## Adding new parameters to definitions (the easy way)

Another common refactoring is adding a parameter to a definition. Right now, `pumpkinPie` has a hardcoded `pieCrust`. I feel like there a lot of different pie crust recipes (I fully anticipate adding `extraFlakyPieCrust` and `grahamCrackerPieCrust`), so let's rename that `regularPieCrust` (and notice that `pumpkinPie` picks up the new name):

```ucm
.cooking> move.term pieCrust regularPieCrust
.cooking> view pumpkinPie
```

And why don't we make our `pumpkinPie` configurable! Here's one way to do that with minimal impact. We introduce a new function (`pumpkinPie'`) which takes `pieCrust` as a parameter, then define the original function in terms of this new generic function:

```unison
pumpkinPie' pieCrust =
  sum [ amount 1.0 pieCrust
      , amount 1.0 pumpkinSpices
      , amount (cans 1.0) pumpkin
      , amount 2.0 egg
      ]

pumpkinPie = pumpkinPie' regularPieCrust
```

We'll make this update in a fork of our namespace. Forks are super cheap to make and don't require copying a bunch of code, so create them as often as you like:

```ucm
.> fork .cooking .cooking2
.> cd .cooking2
.cooking2> update
.cooking2> todo
```

Notice there's nothing `todo`. The refactoring is complete. We could `merge .cooking2 .cooking` (this merges `.cooking2` into `.cooking) if we were happy with this change.

This strategy of adding new parameters to functions is what might be called _locally type preserving_.

## Changing type signatures

But maybe that's not what we want... maybe we really want to be forced to review all the places that used the old `pumpkinPie` and decide there what kind of pie crust to use.

Let's delete that experiment (note: it's still in the history that Unison keeps and can be resurrected at any time):

```ucm
.cooking> delete.namespace .cooking2
```

And let's instead directly add another parameter  to `pumpkinPie`:

```unison
pumpkinPie pieCrust =
  sum [ amount 1.0 pieCrust
      , amount 1.0 pumpkinSpices
      , amount (cans 1.0) pumpkin
      , amount 2.0 egg
      ]
```

Now when we `update`, we are told that we have some work still `todo`:

```ucm:error
.cooking> update
```

We've created a new definition, but Unison's well-typed propagation can't automatically update `thanksgivingDesert`, since it doesn't know what pie crust to supply to `pumpkinPie`. We call this state a partially completed refactoring. The remaining work on a refactoring shows up after each `update` and also in the `todo` command:

```ucm:error
.cooking> todo
```

### A partially completed refactoring isn't a broken codebase

When you have a partially completed refactoring, it's no big deal. Your codebase isn't broken, and you can still run all your code, introduce new definitions, whatever:

```unison
someOtherDefinition = -92

> Map.keys (elements pecanPie)
```

### Using the `todo` command

Rather than having a list of (possibly misleading) compile errors and a broken codebase that won't let you write new code or run anything, you get a nice tidy todo list, and a remaining work metric that only goes down (is there anything more demoralizing than when you are slogging through a long list of compile errors, you get it down to a reasonable number, then it starts going _up_ again?):

```ucm:error
.cooking> todo
```

The `todo` command is telling you the total number of transitive dependents still left to update, and prompting you to visit them in dependency order. So it tells us to look at `thangsgivingDesert` first, and not `thanksgivingDinner`, which depends on `thanksgivingDesert`.

Here, we'll do something simple, which is that we'll bind this new parameter at the use site:

```unison
thanksgivingDessert guestCount =
  piesPerPerson = 1.0 / 6.0
  totalPies = guestCount * piesPerPerson
  sum [ amount (totalPies / 2.0) (pumpkinPie regularPieCrust)
      , amount (totalPies / 2.0) pecanPie ]
```

Let's now `update`:

```ucm
.cooking> update
```

Notice there's nothing `todo` after the update. The well-typed propagation finished the rest for us, since we were able to preserve the type of `thanksgivingDessert` and `pumpkinPie` had no other direct dependents. If instead we also changed the type of `thanksgivingDesert` we'd then have to update _its dependents_.

Summary: When you reach a "type-preserving frontier" of changes, Unison handles propagating that out the rest of the way.

Next we are going to look briefly at some more interesting refactorings that Unison supports well.

## Adding new ability requirements to a definition

A common refactoring is to have a definition that starts out pure but which you later decide you'd like to use some additional abilities.

> 😬 For those who have used Scala or Haskell, you might have bad memories of tedious refactoring converting pure code to monadic, which involves switching from pure to monadic syntax and updating a bunch of type signatures, often all along an entire dependency chain. It's not very fun.

Let's do that for our `thanksgivingDessert` function:

```ucm
.cooking> view thanksgivingDessert
```

As a silly example, we'll use a simple `Logging` ability to indicate we'd like to print out a message in the middle of this function:

```unison
ability Logging where
  log : Text -> ()

thanksgivingDessert guestCount =
  piesPerPerson = 1.0 / 6.0
  totalPies = guestCount * piesPerPerson
  Logging.log ("Total number of pies is: " ++ toText totalPies)
  sum [ amount (totalPies / 2.0) (pumpkinPie regularPieCrust)
      , amount (totalPies / 2.0) pecanPie ]
```

Notice the type of `thanksgivingDessert` has been inferred to require the `Logging` ability. We didn't need to make any other structural changes to our function though. And we can `update` and get automatic propagation of this change:

```ucm
.cooking> update
.cooking> find thanksgivingDinner
```

The type of `thanksgivingDinner` picks up that same `Logging` ability requirement, but we didn't need to make any structural changes to it by hand and we certainly didn't need to spend time on a tedious process of text munging just to add this ability requirement.

### Using `reflog` command to go back in time

That was a bit of a silly refactoring, so let's go back in time to before we made it.

```ucm
.cooking> reflog
.cooking> reset-root 3
.cooking> find thanksgivingDessert
```

Notice `thanksgivingDessert` is back to having no ability requirements.

Lastly, we're going to look at an example of refactoring a _type_.

## Refactoring type declarations

> 🚧 Unfortunately, this section is still UNDER CONSTRUCTION. It will soon contain info on how to refactor existing types. In the meantime, we would [love to hear in #alphatesting](/slack) what you thought about these docs so far.

