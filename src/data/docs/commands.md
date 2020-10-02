---
title: UCM command reference
description: This document lists all the current UCM commands, gives basic usage instructions and links to further reading.
---

# UCM command reference

This document lists all the current UCM commands, gives basic usage instructions and links to further reading. Commands are listed alphabetically in this document.

[metadata]: /docs/metadata

## `add`

This is how you add new definitions to the codebase. It tries to add all definitions from the most recent typechecked file.

```unison
x = 42
```

```ucm
.> add
```

Adds `x` to the root namespace. If we first `cd foo.bar`, then the `add` creates `foo.bar.x` in the codebase. That is, the names in the most recent typechecked file are added underneath the current namespace.

### FAQ about the `add` command

#### I got an error about "these definitions failed" on `add`

This message happens when some of the definitions couldn't be added to the codebase. UCM shows a table of definitions along with the reason why they didn't succeed, like this:

```
x These definitions failed:

    Reason
    needs alias   List.sum   : [Nat] -> Nat

    Tip: Use `help filestatus` to learn more.

```

Here's what these reasons mean:

* __needs update:__ The scratch file has a definition with the same name as an existing definition. Doing [`update`](#update) instead of `add` will turn this failure into a successful update.
* __conflicted:__ The file has a definition whose name is currently conflicted. Resolving the conflict (see [concurrent work and resolving conflicts](/docs/concurrent-work) to learn more) and then trying an `update` again will turn this into a successful update.
* __term/ctor collision:__ A definition with the same name as an existing constructor for some data type. Rename your definition or the data type before trying again to `add` or `update`.
* __ctor/term collision:__ A type defined in the file has a constructor that's named the same as an existing term. Rename that term or your constructor before trying again to `add` or `update`.
* __needs alias:__ A definition in the file already has another name. You can use the `alias.term` or `alias.type` commands to create new names for existing definitions.
* __blocked:__ This definition couldn't be added because it dependended on another definition in the file that had a failed status.
* __extra dependency:__ This definition was added because it was a dependency of a definition explicitly selected.

#### I want to `undo` a partially completed `add` where some of the definitions failed

Just do [`undo`](#undo)!

## `alias.many` (or `copy`)

Given a list of relative paths, make copies inside of a namespace

`alias.many foo.foo bar.bar .quux` creates aliases `.quux.foo.foo` and `.quux.bar.bar`

## `alias.term`

`alias.term foo bar` creates the name `bar` as an alias for the term `foo`. [Metadata linked to][metadata] `foo` is copied over to `bar` (use [`unlink`](#unlink) if this isn't what you want). `foo` and `bar` can be any [term names](/docs/language-reference#identifiers) including [operators](/docs/language-reference#identifiers) and hash qualified names. Here are a few examples:

```ucm
.> alias.term .base.List.map .utils.List.map
.> alias.term frobnicate#2jdk10 zonk.betterName
.base> alias.term Nat.drop .utils.Nat.-
```

Also see [`alias.type`](#alias.type).

## `alias.type`

`alias.type foo bar` creates the name `bar` as an alias for the type `foo`. [Metadata linked to][metadata] `foo` is copied over to `bar` (use [`unlink`](#unlink) if this isn't what you want). `foo` and `bar` can be any [type names](/docs/language-reference#identifiers). Here are a few examples:

```ucm
.> alias.type .base.Optional .utils.Maybe
.> alias.type Employoee#2jdk10 v1.Employee
.base> alias.type List.map .utils.List.map
```

Also see [`alias.term`](#alias.term).

## `builtins.merge`

Adds the builtin terms and types from your currrent version of Unison to a namespace `builtins` under the [current namespace](/docs/tour#unison-namespaces-and-use-clauses):

```ucm
.mystuff> builtins.merge
.mystuff> find .mystuff.builtins.Nat.+

  1. (Nat.+) : Nat -> Nat -> Nat
```

When new builtin terms and types are added to Unison, this is one way you can get access to them from within a Unison codebase (you might also [`pull`](#pull) from another codebase that includes the new builtins). Once the builtins are in your namespace tree, you can rename or alias them however you like.

## `copy.patch`

Use `copy.patch foo bar` to copy a [patch](#patch) from `foo` to `bar`

## `docs`

Use `docs foo` to print the documentation [associated with](#link) definition `foo` (see [documentation literals](/docs/language-reference#documentation-literals) to learn more).

<a id="find"></a>
## `find` (and relatives)

The [`find`](#find) command and its relatives ([`find.patch`](#findpatch) and [`find.verbose`](#findverbose)) can be used to explore the definitions in a Unison codebase.

### `find`

With no arguments, the `find` command will list all definitions in the current namespace (including definitions in descendants of the current namespace).

With one or more arguments (e.g., `find foo bar baz`), the command will list definitions in the current namespace with names similar to the arguments:

```unison
isEmpty : [a] -> Boolean
isEmpty l = case l of
  [] -> true
  _ -> false
```

```ucm
.> find emp

  1. isEmpty : [a] -> Boolean

```

The find command also supports type-driven search:

```ucm
.> find : [a] -> Boolean

  1. isEmpty : [a] -> Boolean

```

### `find.patch`

Use `find.patch` (or `list.patch` or `ls.patch`) to list all patches in the current namespace.

### `find.verbose`

The `find.verbose` command behaves identically to `find`, except that it includes hashes and aliases in its output:

```ucm
.> find.verbose emp

  1. -- #bs08eqa1ukvve64fh71sqp406jf73c8s6c3v8ltg1ucqre10lcq32qk45sf8pgrfrctstbldlm4m7mscnk9vkra2ohcpmqqhtprb9jo
     isEmpty : [a] -> Boolean

```

## `fork` (or `copy.namespace`)

Use `fork src dest` to create a copy of the namespace `src` to the location `dest`

## `help`

Issue this command (or `?`) to display UCM's built-in command reference.

## `link`

> 🚧  Unfortunately, this document is currently under construction. Check back later!

## `patch`

Rewrite any definitions that depend on definitions with type-preserving edits to use the updated versions of these dependencies

## `pull`

The `pull` command is used to pull definitions from another Unison codebase into the current codebase. When a codebase is initialized, the user is advised to pull a "base library" (usually the canonical base library at http://github.com/unisonweb/base):

```ucm
.> pull https://github.com/unisonweb/base .base

```

The first argument to `pull` is any [Git URL](#git-url) that identifies the namespace to pull from and the second argument (if given) identifies a namespace that the remote codebase will be merged into. If a second argument is not supplied, then the remote codebase will be merged into the current namespace.

## `quit`

Use `quit` (or `exit` or `:q`) to terminate UCM.

## `run`

The `run` command is used to evaluate terms that require the `IO` ability within `ucm`.  A program that performs `IO` cannot be evaluated in a watch expression but _can_ be executed with `run`.

Formally, `run myProgram` will force a [delayed computation](/docs/language-reference#delayed-computations) `myProgram` of type `'{IO} ()`, evaluating `!myProgram` in a context where the `IO` ability is provided by the Unison runtime. The argument (e.g., `myProgram`) must be defined in the codebase or in the most recently typechecked scratch file.

Here's an example:

```unison
greet : Text ->{IO} ()
greet name = printLine ("Hello, " ++ name ++ "!")

helloWorld : '{IO} ()
helloWorld = '(greet "World")
```

```ucm
.> run helloWorld
```

## `undo`

Use `undo` to revert the most recent change to the codebase. Some commands result in multiple steps in the history. You can use the [`reflog`](#reflog) and [`reset-root`](#reset-root) commands to move around history more reliably.

### FAQ about `undo`

#### How do I redo a change after an `undo`?

Use [the `reflog` command](#reflog) to jump to the point in history just before the `undo`.

> 😕 We'd like this to be a nicer experience. A `redo` command sounds nice, but it's not implemented yet!

## `update`

> 🚧  Unfortunately, this document is currently under construction. Check back later!

## Other commands (coming soon!)

> 🚧  Unfortunately, this document is currently under construction. Check back later!

## Glossary

<a id="git-url"></a>

### Git urls

Commands like [`push`](#push) and [`pull`](#pull) use git urls, which have one of the following forms:

* `https://github.com/org/repo` (refers to the root of a git repository)
* `https://github.com/org/repo:.some.remote.path` (refers to the `.some.remote.path` namespace of the git repository)
* `git@github.com:unisonweb/base.git:.some.path` (refers to `.some.path` of the provided git repository)

The UCM tab completion provides some handy shortcuts:

* `gh` to `https://github.com`
* `ghs` to `git@github.com:` (which you can complete with `org/reponame.git`)
* `gl` to `https://gitlab.com`
* `gls` to `git@gitlab.com:`(which you can finish with `org/reponame.git`)
