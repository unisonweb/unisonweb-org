---
title: Name resolution and the environment
description: placeholder
---

# Name resolution and the environment

During typechecking, Unison substitutes free variables in an expression by looking them up in an environment populated from a _codebase_ of available definitions. A Unison codebase is a database of term and type definitions, indexed by [hashes](/docs/language-reference/hashes) and names.

A name in the environment can refer to either terms or types, or both (a type name can never be confused with a term name). If a name is unambiguous (refers to only one term and/or type in the environment), Unison substitutes that name in the expression with a reference to the definition.

[Hash literals](/docs/language-reference/hashes) in the program are substituted with references to the definitions in the environment whose hashes they match.

If a free term variable in the program cannot be found in the environment and is not the name of another term in scope in the program itself, or if an free variable matches more than one name (it’s ambiguous), Unison tries _type-directed name resolution_.

## Type-directed name resolution

During typechecking, if Unison encounters a free term variable that is not a term name in the environment, Unison attempts _type-directed name resolution_, which:

1. Finds term definitions in the environment whose _unqualified_ name is the same as the free variable.
2. If exactly one of those terms has a type that conforms to the expected type of the variable (the type system has always inferred this type already at this point), perform that substitution and resume typechecking.

If name resolution is unable to find the definition of a name, or is unable to disambiguate an ambiguous name, Unison reports an error.
