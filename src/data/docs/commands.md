# UCM command reference

This document lists all the current UCM commands, gives basic usage instructions and links to further reading. Commands are listed alphabetically in this document.

## I want to `undo` a partially completed `add` where some of the definitions fail

This is how you add new definitions to the codebase. It tries to add all definitions from the most recent typechecked file.

```unison
x = 42
```

```ucm
.> add
```

Adds `x` to the root namespace. If we first `cd foo.bar`, then the `add` creates `foo.bar.x` in the codebase. That is, the names in the most recent typechecked file are added underneath the current namespace.

### FAQ about the `add` command

> I got an error about "these definitions failed" on `add`

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

> I want to `undo` a partially completed `add` where some of the definitions failed

Just do [`undo`](#undo)!
