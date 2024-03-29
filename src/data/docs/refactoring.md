---
title: Refactoring and modifying code in Unison
description: This document walks through how refactoring and updates to existing definitions works in Unison.
---

# Refactoring and modifying code in Unison

This document walks through how refactoring and updates to existing definitions works in Unison. It shows the UCM commands you'll use when refactoring. As a running example, we'll use a small library for computing the answers to important questions like: "What's our ingredient list and quantities if we are making enough pecan pie to serve 12 people?"

Unison takes a different approach to refactoring and updating code: rather than modifying definitions in place, which generates lots of (often misleading) compile errors and prevents you from running or writing other code, Unison refactoring is a structured process whereby a new, compiling version of the code is built up incrementally off to the side. We like this process much better and it has significant benefits:

* A Unison codebase is always runnable and never broken, even when in the middle of a refactoring.
* There's no need to "upgrade your whole codebase" just to be able to test out or play with a code change within some smaller context.

For more about the theory, [this talk on Unison may be of interest](https://www.youtube.com/watch?v=IvENPX0MAZ4).

> 📒 This document is a Unison "transcript," an executable Markdown document with embedded Unison code and UCM commands. These are often used to create tutorials and other documentation that show interaction with UCM. The source of this transcript is [here](https://github.com/unisonweb/unisonweb-org/tree/master/src/data/transcripts/refactoring.md). Suggestions for improvements and PRs are welcome!

## Setting up the example

If you'd like to follow along, you can fetch the code via these commmands (the first command which fetches the base library can be omitted if you already have a copy in your codebase):

```ucm
.> pull https://github.com/unisonweb/refactoring-example.git:.base .base
```
```ucm
.> pull https://github.com/unisonweb/refactoring-example.git:.cooking .cooking
```
The basic data type used in the `cooking` library is just a wrapper around a `Map Ingredient Float`, where the `Float` (a 64-bit floating point value) represents the quantity of the ingredient and `Ingredient` is just a wrapper around `Text`:

```ucm
.cooking> view Ingredient Ingredients

  unique type Ingredient = { name : Text }

  unique type Ingredients = { elements : Map Ingredient Float }

```
Let's browse through the rest of the library and take a look at a few of the ingredient lists:

```ucm
.cooking> ls

  1.  Ingredient          (type)
  2.  Ingredient/         (4 definitions)
  3.  Ingredients         (type)
  4.  Ingredients/        (9 definitions)
  5.  butter              (Ingredients)
  6.  check               (Boolean -> [Result])
  7.  cinnamon            (Ingredients)
  8.  cornSyrup           (Ingredients)
  9.  docs/               (1 definition)
  10. egg                 (Ingredients)
  11. examples/           (4 definitions)
  12. flour               (Ingredients)
  13. ginger              (Ingredients)
  14. nutmeg              (Ingredients)
  15. pecanPie            (Ingredients)
  16. pecans              (Ingredients)
  17. pieCrust            (Ingredients)
  18. pumpkin             (Ingredients)
  19. pumpkinPie          (Ingredients)
  20. pumpkinSpices       (Ingredients)
  21. salt                (Ingredients)
  22. shortening          (Ingredients)
  23. sugar               (Ingredients)
  24. thanksgivingDessert (Float -> Ingredients)
  25. thanksgivingDinner  (Float -> Ingredients)
  26. turkey              (Ingredients)
  27. units/              (4 definitions)
  28. vanillaExtract      (Ingredients)
  29. water               (Ingredients)

```
Notice below that `pieCrust` is used in `pumpkinPie`, which is used in `thanksgivingDessert`, which is used in `thanksgivingDinner`:

```ucm
.cooking> view pieCrust pumpkinPie thanksgivingDessert

  pieCrust : Ingredients
  pieCrust =
    sum
      [ amount (cups 1.25) flour,
        amount (tsp 1.0) sugar,
        amount (tsp 0.5) salt,
        amount (cups 0.25) butter,
        amount (cups 0.25) shortening,
        amount (cups 0.25) water ]

  pumpkinPie : Ingredients
  pumpkinPie =
    sum
      [ amount 1.0 pieCrust,
        amount 1.0 pumpkinSpices,
        amount (cans 1.0) pumpkin,
        amount 2.0 egg ]

  thanksgivingDessert : Float -> Ingredients
  thanksgivingDessert guestCount =
    use Float /
    piesPerPerson = 1.0 / 6.0
    totalPies =
      use Float *
      guestCount * piesPerPerson
    sum
      [ amount (totalPies / 2.0) pumpkinPie,
        amount (totalPies / 2.0) pecanPie ]

```
## The easy case: a type preserving change

First we'll make a minor change by changing the implementation of a definition `pumpkinPie` without changing its type. This will create a new definition with a new hash and will automatically create updated versions of its dependents (such as  `thanksgivingDessert`).

We first note the hashes of `pumpkinPie` and `thanksgivingDessert`:

```ucm
.cooking> names pumpkinPie

  Term
  Hash:   #kg14jk5qbo
  Names:  pumpkinPie

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

  ⍟ I've updated to these definitions:

    pumpkinPie : Ingredients

  ✅

  No conflicts or edits in progress.

.cooking> view pumpkinPie

  pumpkinPie : Ingredients
  pumpkinPie =
    sum
      [ amount 1.0 pieCrust,
        amount 11.0 pumpkinSpices,
        amount (cans 1.0) pumpkin,
        amount 2.0 egg ]

```
The definition's contents appear to have "changed", but actually, what we've done is just introduce a new definition, with a new hash, and recorded this mapping from the old hash to the new hash in what's called a *patch*:

```ucm
.cooking> view.patch

  Edited Terms: pumpkinPie#kg14jk5qbo -> pumpkinPie

```
The patch only mentions the one edit we made. But notice that `thanksgivingDessert` also has a new hash:

```ucm
.cooking> names thanksgivingDessert

  Term
  Hash:   #d9ve2qb77k
  Names:  thanksgivingDessert

```
### Well-typed patch propagation

What's going on here? After commands like `update`, Unison does what is called "well-typed patch propagation": it visits the definitions in the namespace in dependency order (visiting `thanksgivingDessert` before visiting definitions like `thanksgivingDinner` that depend on it), applies the patch to each definition, and then typechecks the result. If the definition typechecks, the name is assigned to that new definition and Unison visits its dependents, and so on. Once this propagation completes, we are left with a codebase that still typechecks!

A Unison codebase _always typechecks and is never broken_. This raises a question: what happens if you make breaking changes to a definition? We will look at that next!

## Adding new parameters (the easy way)

Another common refactoring is adding a parameter to a definition. Right now, `pumpkinPie` has a hardcoded `pieCrust`. I feel like there a lot of different pie crust recipes (I fully anticipate adding `extraFlakyPieCrust` and `grahamCrackerPieCrust`), so let's rename that `regularPieCrust` (and notice that `pumpkinPie` picks up the new name):

```ucm
.cooking> move.term pieCrust regularPieCrust

  Done.

.cooking> view pumpkinPie

  pumpkinPie : Ingredients
  pumpkinPie =
    sum
      [ amount 1.0 regularPieCrust,
        amount 11.0 pumpkinSpices,
        amount (cans 1.0) pumpkin,
        amount 2.0 egg ]

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

We'll make this update in a fork of our namespace. Forks are super cheap to make and don't require copying any code, so create them as often as you like:

```ucm
.> fork .cooking .cooking2

  Done.

.> cd .cooking2

.cooking2> update

  ⍟ I've added these definitions:

    pumpkinPie' : Ingredients -> Ingredients

  ⍟ I've updated to these definitions:

    pumpkinPie : Ingredients

  ✅

  No conflicts or edits in progress.

.cooking2> todo

  ✅

  No conflicts or edits in progress.

```
Notice there's nothing `todo`. The refactoring is complete. We could `merge .cooking2 .cooking` (this merges `.cooking2` into `.cooking`) if we were happy with this change.

## Changing type signatures

But maybe we really want to be forced to review all the places that used the old `pumpkinPie` and decide there what kind of pie crust to use.

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

```ucm
.cooking> update

  ⍟ I've updated to these definitions:

    pumpkinPie : Ingredients -> Ingredients

  🚧

  The namespace has 2 transitive dependent(s) left to upgrade.
  Your edit frontier is the dependents of these definitions:

    pumpkinPie#jlrq4t6llb : Ingredients

  I recommend working on them in the following order:

  1. thanksgivingDessert : Float -> Ingredients



```
We've created a new definition, but Unison's well-typed propagation can't automatically update `thanksgivingDessert`, since it doesn't know what pie crust to supply to `pumpkinPie`. We call this state a partially completed refactoring. The remaining work on a refactoring shows up after each `update` and also in the `todo` command:

```ucm
.cooking> todo

  🚧

  The namespace has 2 transitive dependent(s) left to upgrade.
  Your edit frontier is the dependents of these definitions:

    pumpkinPie#jlrq4t6llb : Ingredients

  I recommend working on them in the following order:

  1. thanksgivingDessert : Float -> Ingredients



```
### A partially completed refactoring isn't a broken codebase

When you have a partially completed refactoring, it's no big deal. Your codebase isn't broken, and you can still run all your code, add new code, etc.:

```unison
someOtherDefinition = -92

> Map.keys (elements pecanPie)
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      someOtherDefinition : Int

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    3 | > Map.keys (elements pecanPie)
          ⧩
          [ Ingredient "butter",
            Ingredient "corn syrup",
            Ingredient "egg",
            Ingredient "flour",
            Ingredient "pecans",
            Ingredient "salt",
            Ingredient "shortening",
            Ingredient "sugar",
            Ingredient "water" ]

```
### Using the `todo` command

Rather than having a list of (possibly misleading) compile errors and a broken codebase that won't let you write new code or run anything, you get a nice tidy todo list, and a remaining work metric that only goes down. (Is there anything more demoralizing than when you are slogging through a long list of compile errors, you get it down to a reasonable number, then it starts going _up_ again?):

```ucm
.cooking> todo

  🚧

  The namespace has 2 transitive dependent(s) left to upgrade.
  Your edit frontier is the dependents of these definitions:

    pumpkinPie#jlrq4t6llb : Ingredients

  I recommend working on them in the following order:

  1. thanksgivingDessert : Float -> Ingredients
```

The `todo` command is telling you the total number of transitive dependents still left to update, and prompting you to visit them in dependency order. So it tells us to look at `thanksgivingDessert` first, and not `thanksgivingDinner`, which depends on `thanksgivingDessert`.

Here, we'll apply a simple fix here, which is to bind the new parameter at the use site:

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

  ⍟ I've updated to these definitions:

    thanksgivingDessert : .base.Float -> Ingredients

  ✅

  No conflicts or edits in progress.

```
Notice there's nothing `todo` after the update. The well-typed propagation finished the rest for us, since we were able to preserve the type of `thanksgivingDessert` and `pumpkinPie` had no other direct dependents. If instead we also changed the type of `thanksgivingDessert` we'd then have to update _its dependents_.

Summary: When you reach a "type-preserving frontier" of changes, Unison handles propagating that out the rest of the way.

Next we are going to look briefly at some more interesting refactorings that Unison supports well.

## Adding new ability requirements to a definition

A common refactoring is to have a definition that starts out pure but which you later decide you'd like to use some additional abilities.

> 😬 For those who have used Scala or Haskell, you might have bad memories of tedious refactoring converting pure code to monadic, which involves switching from pure to monadic syntax and updating a bunch of type signatures, often all along an entire dependency chain. It's not very fun.

Let's do that for our `thanksgivingDessert` function:

```ucm
.cooking> view thanksgivingDessert

  thanksgivingDessert : Float -> Ingredients
  thanksgivingDessert guestCount =
    use Float /
    piesPerPerson = 1.0 / 6.0
    totalPies =
      use Float *
      guestCount * piesPerPerson
    sum
      [ amount (totalPies / 2.0) (pumpkinPie regularPieCrust),
        amount (totalPies / 2.0) pecanPie ]

```
As a silly example, we'll use a simple `Logging` ability to indicate we'd like to print out a message in the middle of this function:

```unison
unique ability Logging where
  log : Text -> ()

thanksgivingDessert guestCount =
  piesPerPerson = 1.0 / 6.0
  totalPies = guestCount * piesPerPerson
  Logging.log ("Total number of pies is: " ++ toText totalPies)
  sum [ amount (totalPies / 2.0) (pumpkinPie regularPieCrust)
      , amount (totalPies / 2.0) pecanPie ]
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      ability Logging

    ⍟ These new definitions will replace existing ones of the
      same name and are ok to `update`:

      thanksgivingDessert : Float ->{Logging} Ingredients

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

```
Notice the type of `thanksgivingDessert` has been inferred to require the `Logging` ability. We didn't need to make any other structural changes to our function though. And we can `update` and get automatic propagation of this change:

```ucm
.cooking> update

  ⍟ I've added these definitions:

    ability Logging

  ⍟ I've updated to these definitions:

    thanksgivingDessert : .base.Float ->{Logging} Ingredients

  ✅

  No conflicts or edits in progress.

.cooking> find thanksgivingDinner

  1. thanksgivingDinner : Float ->{Logging} Ingredients


```
The type of `thanksgivingDinner` picks up that same `Logging` ability requirement, but we didn't need to make any structural changes to it by hand and we certainly didn't need to spend time on a tedious process of text munging just to add this ability requirement.

### Using `reflog` command to go back in time

That was a bit of a silly refactoring, so let's go back in time to before we made it.

```ucm
.cooking> reflog

  Here is a log of the root namespace hashes, starting with the
  most recent, along with the command that got us there. Try:

    `fork 2 .old`
    `fork #3qil3271ru .old`   to make an old namespace
                              accessible again,

    `reset-root #3qil3271ru`  to reset the root namespace and
                              its history to that of the
                              specified namespace.

  1.  #4psbjk94ri : update .cooking.patch (patch propagation)
  2.  #3qil3271ru : update .cooking.patch
  3.  #56ks8ib5jj : update .cooking.patch (patch propagation)
  4.  #fmirv6tm5f : update .cooking.patch
  5.  #sab2moe403 : update .cooking.patch (patch propagation)
  6.  #c5l89hnh0h : update .cooking.patch
  7.  #e9n9eqa5jl : delete.namespace .cooking2
  8.  #io73koh46m : update .cooking2.patch (patch propagation)
  9.  #91i5uq5eak : update .cooking2.patch
  10. #3tkujp4vfl : fork .cooking .cooking2
  11. #sis7rkvb9a : move.term .cooking.pieCrust
      .cooking.regularPieCrust
  12. #glu4d42enk : update .cooking.patch (patch propagation)
  13. #sc7f79b14m : update .cooking.patch
  14. #7dk17ndlor : pull
      git@github.com:unisonweb/refactoring-example.git:.cooking
      .cooking
  15. #ku7ffe1fq8 : pull
      git@github.com:unisonweb/refactoring-example.git:.base
      .base
  16. #ms0tsudte1 : (initial reflogged namespace)

.cooking> reset-root 3

  Done.

.cooking> find thanksgivingDessert

  1. thanksgivingDessert : Float -> Ingredients


```
Notice `thanksgivingDessert` is back to having no ability requirements.

Lastly, we're going to look at an example of refactoring a _type_.

## Refactoring type declarations

> 🚧 Unfortunately, this section is still UNDER CONSTRUCTION. It will soon contain info on how to refactor existing types. In the meantime, we would [love to hear in #alphatesting](/slack) what you thought about these docs so far.

