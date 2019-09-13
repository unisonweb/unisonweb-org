---
title: Use clauses
description: placeholder
---

# Use clauses

A _use clause_ tells Unison to allow [identifiers](/docs/language-reference/identifiers) from a given [namespace](/docs/language-reference/identifiers/#namespace-qualified-identifiers) to be used [unqualified](/docs/language-reference/identifiers/#identifiers) in the lexical scope where the use clause appears.

In this example, the `use .base.List` clause allows the definition that follows it to refer to `.base.List.take` as simply `take`:

``` unison
use .base.List

oneTwo = take 2 [1,2,3]
```

The general form of `use` clauses is as follows:

``` unison
use namespace name_1 name_2 .. name_n
```

Where `namespace` is the namespace from which we want to use names unqualified, and `name_1` through `name_n` are the names we want to use. If no names are given in the `use` clause, Unison allows all the names from the namespace to be used unqualified. There's no performance penalty for this, as `use` clauses are purely a syntactic convenience. When rendering code as text, Unison will insert precise `use` clauses that mention exactly the names it uses, even if the programmer omitted the list of names.

See the section on [identifiers](/docs/language-reference/identifiers) for more on namespaces as well as qualified and unqualified names.

__Next:__ [Expressions](/docs/language-reference/expressions)
