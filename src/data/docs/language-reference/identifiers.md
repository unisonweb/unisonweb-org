---
title: Identifiers and reserved words
description: placeholder
---

# Identifiers
Unison identifiers come in two flavors:

1. _Regular identifiers_ start with an alphabetic unicode character, emoji (which is any unicode character between 1F400 and 1FAFF inclusive), or underscore (`_`), followed by any number of alphanumeric characters, emoji, or the characters `_`, `!`, or `'`. For example, `foo`, `_bar4`, `qux'`, and `set!` are valid regular identifiers.
2. _Operators_ consist entirely of the characters `!$%^&*-=+<>.~\\/|:`. For example, `+`, `*`, `<>`, and `>>=` are valid operators.

## Namespace-qualified identifiers
The above describes _unqualified_ identifiers. An identifier can also be _qualified_. A qualified identifier consists of a _qualifier_ or _namespace_, followed by a `.`, followed by either a regular identifier or an operator. The qualifier is one or more regular identifiers separated by `.`. For example `Foo.Bar.baz` is a qualified identifier where `Foo.Bar` is the qualifier.

## Absolutely qualified identifiers
Namespace-qualified identifiers described above are relative to a “current” namespace, which the programmer can set (and defaults to the root of the global namespace). To ignore the current namespace, an identifier can have an _absolute qualifier_. An absolutely qualified name begins with a `.`. For example, the name `.base.List` always refers to the name `.base.List`, regardless of the current namespace, whereas the name `base.List` will refer to `foo.base.List` if the current namespace is `foo`.

Note that [operator identifiers](#identifiers) may contain the character `.`. In order for this to not create ambiguity, the rule is as follows:

1. `.` by itself is always an operator.
2. Any other identifier beginning with `.` is an absolutely qualified identifier.
3. A `.` immediately following a namespace is always a namespace separator.
4. Otherwise a `.` is treated as part of an operator identifier.

if `.` is followed by whitespace or another operator character, the `.` is treated like an operator character. If it's followed by a [regular identifier](#identifiers) character, it's treated as a namespace separator.

## Hash-qualified identifiers
Any identifier, including a namespace-qualified one, can appear _hash-qualified_. A hash-qualified identifier has the form `x#h` where `x` is an identifier and `#h` is a [hash literal](#hashes). The hash disambiguates names that may refer to more than one thing.

## Reserved words
The following names are reserved by Unison and cannot be used as identifiers: `=`, `:`, `->`, `if`, `then`, `else`, `forall`, `handle`, `in`, `unique`, `where`, `use`, `and`, `or`, `true`, `false`, `type`, `ability`, `alias`, `let`, `namespace`, `case`, `of`, `with`.

