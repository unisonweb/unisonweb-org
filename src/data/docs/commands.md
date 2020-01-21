# UCM command reference

This document lists all the current UCM commands, gives basic usage instructions and links to further reading. Commands are listed alphabetically in this document.

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

## `docs`

Use `docs foo` to print the documentation [associated with](#link) definition `foo` (see [documentation literals](/docs/language-reference#documentation-literals) to learn more).

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

## `help`

Issue this command (or `?`) to display UCM's built-in command reference.

## `link`

> 🚧  Unfortunately, this document is currently under construction. Check back later!

## `pull`

The `pull` command is used to pull definitions from another Unison codebase into the current codebase. When a codebase is initialized, the user is advised to pull a "base library" (usually the canonical base library at http://github.com/unisonweb/base):

```ucm
.> pull https://github.com/unisonweb/base .base

```

The first argument to `pull` identifies the codebase to pull from, and the second argument (if given) identifies a namespace that the remote codebase will be merged into. If a second argument is not supplied, then the remote codebase will be merged into the current namespace.

## `quit`

Use `quit` (or `exit` or `:q`) to terminate UCM.

## `undo`

Use `undo` to revert the most recent change to the codebase.

## `update

> 🚧  Unfortunately, this document is currently under construction. Check back later!

## Other commands (coming soon!)

> 🚧  Unfortunately, this document is currently under construction. Check back later!
