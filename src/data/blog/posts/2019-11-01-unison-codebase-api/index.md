---
title: A Unison Codebase API
description: A proposed combinator library for managing your Unison codebase from within Unison itself.
date: 2019-01-09
authors: ["runar-bjarnason"]
categories: ["research"]
featuredImage: /media/thing10.svg
---

The [Unison Codebase Manager, `ucm`](https://www.unisonweb.org/docs/tour/hello-ucm/) is a command-line tool for exploring, manipulating, and organizing a Unison codebase. But it would be so much nicer if we could do all of those things _in Unison_.

We already have the `Link.Term` and `Link.Type` types from [#901](https://github.com/unisonweb/unison/pull/901) to support documentation. These are first-class references (i.e. hashes) to Unison terms and types in the codebase, respectively. 

## Motivating example: refactor a type
Say we have an ability type with a lot of constructors:

```haskell
ability MyAPI where
  one : One
  two : Two
  three : Three
  …
```

Let’s say it has 50 constructors — an API with a large surface. And we want to change one of the constructors, let’s say `three` to produce `Nat` instead of `Three`.

The `ucm` workflow would be to `edit` the `MyAPI` type and make the small change, then `update` to construct a patch, and then adding to the patch a mapping from the constructors of the old `MyAPI` to the constructors of the new `MyAPI`. We’d have to issue a `resolve.term` command for every constructor. Doing this 50 times is repetitive and boring.

But we have a programming language! So why not just write code to do the repetitive and boring task for us?

What we’d like to do is write a Unison program that does something like the following:

* Iterate over the constructors of the old type, starting with an empty patch.
* For each constructor, find the correspondingly _named_ constructor of the new type.
* Add to the patch a mapping from the old constructor to the new one.

## A Codebase ability
To support this kind of thing, we need some operations on the codebase.

For example, we want to get a list of constructors of a type:

```haskell
Codebase.constructorsOf 
  : Link.Type -> {Codebase} [Link.Term]
```

And get the names of a term or type:
```haskell
Codebase.termNamesAt 
  : Namespace -> Link.Term ->{Codebase} [Name]
Codebase.typeNamesAt 
  : Namespace -> Link.Type ->{Codebase} [Name]
```

The `Namespace` argument is necessary here since names are different depending on the namespace. You could supply the root namespace `.` to get all the names globally for a term or type.

It might be useful to ask the codebase for the contents of a namespace:

```haskell
Codebase.list : Path ->{Codebase} [Link]
```

Where `Link` refers to a term, a type, a patch, or another namespace:

```haskell
type Link = Term Link.Term
          | Type Link.Type
          | Patch Patch
          | Namespace Namespace
```

We also want to be able to retrieve and store patches:
```haskell
Codebase.getPatch : Name ->{Codebase} Patch
Codebase.putPatch : Name -> Patch ->{Codebase} ()
```

### What’s a patch?
We’ll need `Patch` to support basic operations that allow us to replace or deprecate terms and types:
```haskell
Patch.replaceTerm 
  : Link.Term -> Link.Term -> Patch -> Patch
Patch.replaceType 
  : Link.Type -> Link.Type -> Patch -> Patch
Patch.deprecateTerm : Link.Term -> Patch -> Patch
Patch.deprecateType : Link.Type -> Patch -> Patch
```

We also want to be able to combine patches, and we’ll need the empty patch:
```haskell
Patch.empty : Patch
Patch.union : Patch -> Patch -> Patch
```

It would be useful to be able to ask a patch for its contents:
```haskell
Patch.termReplacements : Patch -> Map Link.Term Link.Term
Patch.typeReplacements : Patch -> Map Link.Type Link.Type
```

And of course the whole point of a patch is to apply it to the codebase at a particular namespace:
```haskell
Codebase.applyPatch : Namespace -> Patch ->{Codebase} ()
```

## Putting it all together

Using just these operations, we can perform the refactoring on our `MyAPI` type.

```haskell
constructorMap 
  : Namespace -> Link.Type -> Map Name Link.Term
constructorMap p typ = 
  go ctor map = 
    termNames = Codebase.termNamesAt p ctor
    foldr (go' ctor) map termNames
  go' ctor termName map = 
    Map.insert termName ctor map
  foldr go Map.empty (Codebase.constructorsOf typ)

nameBasedUpgrade 
  : Namespace -> Link.Type -> Link.Type ->{Codebase} Patch 
  newCtors = 
    constructorMap Codebase.constructorsOf newType
  oldCtors = 
    constructorMap Codebase.constructorsOf (typeLink 
  foldr go Patch.empty (Map.toList newCtors)

upgradeMyAPI = 
  nameBasedUpgrade (typeLink MyAPI#oldHash)
                   (typeLink MyAPI)
```

Here the syntax `typeLink T` is built-in Unison syntax for getting a `Link.Type`. The type  `MyAPI#oldHash` is not valid syntax but is supposed to represent whatever the actual hash-qualified name of the old version of `MyAPI` would be.

One thing to note is that `constructorMap` and `nameBasedUpgrade` are totally reusable general-purpose functions that can be used to perform this kind of migration on any type. There are probably lots of other useful general-purpose refactorings we could write using this kind of API.

## Future expansion
The `Codebase` API could be expanded later to allow more operations on the codebase:

* Rename a term or type, or add and remove aliases
* Add or edit documentation on a term or type
* Forking, merging, populating, and deleting namespaces.
* Navigate the history of the codebase.

Note that this API doesn’t include any internal representation of Unison terms and types.  We can ask the codebase for links, but not for the actual terms or types.  If we had such metaprogramming facilities, this API could be expanded to allow editing the actual code rather than just the codebase structure.

