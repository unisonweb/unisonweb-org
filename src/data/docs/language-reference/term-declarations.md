---
title: Term declarations
description: placeholder
---

A Unison term declaration (or "term binding") consists of an optional [type signature](#type-signature), and a [term definition](#term-definition). For example:

```unison
timesTwo : Nat -> Nat
timesTwo x = x * 2
```

The first line in the above is a type signature. The type signature `timesTwo : Nat -> Nat` declares that the term named `timesTwo` is a function accepting an argument of type `Nat` and computes a value of type `Nat`. The type `Nat` is the type of 64-bit natural numbers starting from zero. See [Unison types](#unison-types) for details.

The second line is the term definition. The `=` sign splits the definition into a _left-hand side_, which is the term being defined, and the _right-hand side_, which is the definition of the term.

The general form of a term binding is:

```unison
name : Type
name p_1 p_2 … p_n = expression
```

## Type signatures

`name : Type` is a type signature, where `name` is the name of the term being defined and `Type` is a [type](#unison-types) for that term. The `name` given in the type signature and the `name` given in the definition must be the same.

Type signatures are optional. In the absence of a type signature, Unison will automatically infer the type of a term declaration. If a type signature is present, Unison will verify that the term has the type given in the signature.

## Term definition

A term definition has the form `f p_1 p_2 … p_n = e` where `f` is the name of the term being defined. The parameters `p_1` through `p_n` are the names of parameters, if any (if the term is a function), separated by spaces. The right-hand side of the `=` sign is any [Unison expression](#unison-expressions).

The names of the parameters as well as the name of the term are bound as local variables in the expression on the right-hand side (also known as the _body_ of the function). When the function is called, the parameter names are bound to any arguments passed in the call. See [function application](#function-application) for details on the call semantics of functions.

If the term takes no arguments, the term has the value of the fully evaluated expression on the right-hand side and is not a function.

The expression comprising the right-hand side can refer to the name given to the definition in the left-hand side. In that case, it’s a recursive definition. For example:

```unison
sumUpTo : Nat -> Nat
sumUpTo n =
  if n < 2 then n
  else n + sumUpto (drop n 1)
```

The above defines a function `sumUpTo` that recursively sums all the natural numbers less than some number `n`. As an example, `sumUpTo 3` is `1 + 2 + 3`, which is `6`.

Note: The expression `drop n 1` on line 4 above subtracts one from the natural number `n`. Since the natural numbers are not closed under subtraction (`n - 1` is an `Int`), we use the operation `drop` which has the convention that `drop 0 n = 0` for all natural numbers `n`. Unison's type system saves us from having to deal with negative numbers here.

## Operator definitions

[Operator identifiers](#identifiers) are valid names for Unison definitions, but the syntax for defining them is slightly different. For example, we could define a binary operator `|`:

``` unison
(|) x y = if x == 0 then y else x
```

Or we could define it using infix notation:

``` unison
x | y = if x == 0 then y else x
```

If we want to give the operator a qualified name, we put the qualifier inside the parentheses:

``` unison
(MyNamespace.|) x y = if x == 0 then y else x
```

Or if defining it infix:

``` unison
x MyNamespace.| y = if x == 0 then y else x
```

The operator can be applied using either notation, no matter which way it's defined. See [function application](#function-application) for details.

__Next:__ [Type declarations](/docs/language-reference/type-declarations)
