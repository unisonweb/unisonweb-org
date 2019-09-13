---
title: Literals
description: placeholder
---

# Literals

A literal expression is a basic form of Unison expression. Unison has the following types of literals:

* A _64-bit unsigned integer_ of type `.base.Nat` (which stands for _natural number_) consists of digits from 0 to 9. The smallest `Nat` is `0` and the largest is `18446744073709551615`.
* A _64-bit signed integer_ of type `.base.Int` consists of a natural number immediately preceded by either `+` or `-`. For example, `4` is a `Nat`, whereas `+4` is an `Int`. The smallest `Int` is `-9223372036854775808` and the largest is `+9223372036854775807`.
* A _64-bit floating point number_ of type `.base.Float` consists of an optional sign (`+`/`-`), followed by two natural numbers separated by `.`. Floating point literals in Unison are [IEEE 754-1985](https://en.wikipedia.org/wiki/IEEE_754-1985) double-precision numbers. For example `1.6777216` is a valid floating point literal.
* A _text literal_ of type `.base.Text` is any sequence of Unicode characters between pairs of `"`. The escape character is `\`, so a `"` can be included in a text literal with the escape sequence `\"`. The full list of escape sequences is given in the [Escape Sequences](#escape-sequences) section below. For example, `"Hello, World!"` is a text literal. A text literal can span multiple lines. Newlines do not terminate text literals, but become part of the literal text.
* There are two _Boolean literals_: `true` and `false`, and they have type `Boolean`.
* A _hash literal_ begins with the character `#`. See the section **Hashes** for details on the lexical form of hash literals. A hash literal is a reference to a term or type. The type or term that it references must have a definition whose hash digest matches the hash in the literal. The type of a hash literal is the same as the type of its referent. `#a0v829` is an example of a hash literal.
* A _literal list_ has the general form `[v1, v2, ... vn]` where `v1` through `vn` are expressions. A literal list may be empty. For example, `[]`, `[x]`, and `[1,2,3]` are list literals. The expressions that form the elements of the list all must have the same type. If that type is `T`, then the type of the list literal is `.base.List T` or `[T]`.
* A _function literal_ or _lambda_ has the form `p1 p2 ... pn -> e`, where `p1` through `pn` are [regular identifiers](/docs/language-reference/identifiers) and `e` is a Unison expression (the _body_ of the lambda). The variables `p1` through `pn` are local variables in `e`, and they are bound to any values passed as arguments to the function when it’s called (see the section [Function Application](/docs/language-reference/expressions/#function-application) for details on call semantics). For example `x -> x + 2` is a function literal.
* A _tuple literal_ has the form `(v1,v2, ..., vn)` where `v1` through `vn` are expressions. A value `(a,b)` has type `(A,B)` if `a` has type `A` and `b` has type `B`. The expression `(a)` is the same as the expression `a`. The nullary tuple `()` (pronounced “unit”) is of the trivial type `()`. See [tuple types](/docs/language-reference/types/#tuple-types) for details on these types and more ways of constructing tuples.

## Escape sequences

Text literals can include the following escape sequences:

* `\0` = null character
* `\a` = alert (bell)
* `\b` = backspace
* `\f` = form feed
* `\n` = new line
* `\r` = carriage return
* `\t` = horizontal tab
* `\v` = vertical tab
* `\\` = literal `\` character
* `\'` = literal `'` character
* `\"` = literal `"` character
