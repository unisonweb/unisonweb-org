---
title: Hello to the Unison codebase manager
description: placeholder
---

### 👋 to the Unison codebase manager

When first launching Unison in a new directory, we get a message like:

> No codebase exists here so I'm initializing one in: .unison/v1

What's happening here? This is the Unison Codebase Manager starting up and initializing a fresh codebase. We're used to thinking about our codebase as a bag of text files that's mutated as we make changes to our code, but in Unison the codebase is represented as a collection of serialized syntax trees, identified by a hash of their content and stored in a collection of files inside of that `.unison/v1` directory.

The Unison codebase format has a few key properties:

* It is _append-only_: once a file in the `.unison` directory is created, it is never modified or deleted, and files are always named uniquely and deterministically based on their content.
* As a result, a Unison codebase can be versioned and synchronized with Git or any similar tool and will never generate a conflict in those tools.

> 🐘 Remember that `pull git@github.com:unisonweb/unisonbase.git` we used in the [quickstart guide][quickstart]. This command uses git behind the scenes to sync new definitions from the remote Unison codebase to the local codebase.

Because of the append-only nature of the codebase format, we can cache all sorts of interesting information about definitions in the codebase and _never have to worry about cache invalidation_. For instance, Unison is a statically-typed language and we know the type of all definitions in the codebase--the codebase is always in a well-typed state. So one thing that's useful and easy to maintain is an index that lets us search for definitions in the codebase by their type. Try out the following commands (new syntax is explained below):

```
---
title: ucm
carets: true
---
.> find : [a] -> [a]

  1. base.Heap.sort : [a] -> [a]
  2. base.List.distinct : [a] -> [a]
  3. base.List.reverse : [a] -> [a]
  4. base.Heap.sortDescending : [a] -> [a]

.> view 3

  base.List.reverse : [a] -> [a]
  base.List.reverse as =
    use base.List +:
    base.List.foldl (acc a -> a +: acc) [] as
```

Here, we did a type-based search for functions of type `[a] -> [a]`, got a list of results, and then used the `view` command to look at the nicely formatted source code of one of these results. Let's introduce some Unison syntax:

* `base.List.reverse : [a] -> [a]` is the syntax for giving a [type signature](languagereference.html#type-signature) to a definition. We pronounce the `:` symbol as "has type", as in "reverse has the type `[a] -> [a]`".
* `[Nat]` is the syntax for the type consisting of lists of natural numbers (terms like `[0,1,2]` and `[3,4,5]`, and `[]` will have this type), and more generally `[Foo]` is the type of lists whose elements have some type `Foo`.
* Any lowercase variable in a type signature is assumed to be [universally quantified](languagereference.html#polymorphic-types), so `[a] -> [a]` really means and could be written `forall a . [a] -> [a]`, which is the type of functions that take a list whose elements are some (but any) type, and return a list of elements of that same type.
* `base.List.reverse` takes one parameter, called `as`. The stuff after the `=` is called the _body_ of the function, and here it's a [block](languagereference.html#blocks-and-statements), which is demarcated by whitespace.
* `acc a -> ..` is the syntax for an anonymous function.
* Function arguments are separated by spaces and function application binds tighter than any operator, so `f x y + g p q` parses as `(f x y) + (g p q)`. You can always use parentheses to control grouping more explicitly.
* The declaration `use base.List +:` lets us reference the function `base.List.+:` using just `+:`. (This function prepends an element to the front of a list.) [Use clauses](languagereference.html#use-clauses) like this can be placed in any Unison block; they don't need to go at the top of your file.

> Try doing `view base.List.foldl` if you're curious to see how it's defined.

### Names are stored separately from definitions so renaming is fast and 100% accurate

The Unison codebase, in its definition for `reverse`, doesn't store names for the definitions it depends on (like the `foldl` function); it references these definitions via their hash. As a result, changing the name(s) associated with a definition is easy.

Let's try this out. `reverse` is defined using `List.foldl`, where `l` is a needless abbreviation for `left`. Let's rename that to `List.foldLeft` to make things clearer. Try out the following command (you can use tab completion here if you like):

```
---
title: ucm
carets: true
---
.> move.term base.List.foldl base.List.foldLeft

  Done.

.> view base.List.reverse

  base.List.reverse : [a] -> [a]
  base.List.reverse as =
    use base.List +:
    base.List.foldLeft (acc a -> a +: acc) [] as
```

Notice that `view` shows the `foldLeft` name now, so the rename has taken effect. Nice!

To make this happen, Unison just changed the name associated with the hash of `foldl` _in one place_. The `view` command just looks up the names for the hashes on the fly, right when it's printing out the code.

This is important: Unison __isn't__ doing a bunch of text mutation on your behalf, updating possibly thousands of files, generating a huge textual diff, and also breaking a bunch of downstream library users who are still expecting that definition to be called by the old name. That would be crazy, right?

So rename and move things around as much as you want. Don't worry about picking a perfect name the first time. Give the same definition multiple names if you want. It's all good!

> ☝️ Using `alias.term` instead of `move.term` introduces a new name for a definition without removing the old name(s).

> 🤓 If you're curious to learn about the guts of the Unison codebase format, you can check out the [v1 codebase format specification][repoformat].

OK, go drink some water, and then let's learn more about Unison's interactive way of writing and editing code.

__Next:__ [Unison's interactive scratch files](/docs/tour/scratch-files)
