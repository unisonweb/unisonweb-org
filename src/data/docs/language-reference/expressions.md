---
title: Expressions
description: placeholder
---

# Unison expressions
This section describes the syntax and informal semantics of Unison expressions.

Unison's evaluation strategy for expressions is [Applicative Order Call-by-Value](https://en.wikipedia.org/wiki/Evaluation_strategy#Applicative_order). See [Function application](/docs/language-reference/expressions/#function-application) for details.

## Basic lexical forms

See the sections on:

* [Identifiers](/docs/language-reference/identifiers), for example `foo`, `foo.bar`, and `+`.
* [Blocks and statements](/docs/language-reference/blocks), for example: `x = 42`.
* [Literals](/docs/language-reference/literals), for example: `1`, `"hello"`, `[1,2,3]`.

## Comments

A line comment starts with `--` and is followed by any sequence of characters. A line that contains a comment can’t contain anything other than a comment and whitespace. Line comments are currently ignored by Unison.

A line starting with `---` and containing no other characters is a _fold_. Any text below the fold is ignored by Unison.

Unison does not currently support block comments. A comment can span multiple lines by adding `--` to the front of each line of the comment.

## Type annotations

A type annotation has the form `e:T` where `e` is an expression and `T` is a type. This tells Unison that `e` should be of type `T` (or a subtype of type `T`), and Unison will check whether this is true. It's a type error for the actual type of `e` to be anything other than a type that conforms to `T`.

## Parenthesized expressions

Any expression can appear in parentheses, and an expression `(e)` is the same as the expression `e`. Parentheses can be used to delimit where an expression begins and ends. For example `(f : P -> Q) y` is an application of the function `f` of type `P -> Q` to the argument `y`. The parentheses are needed to tell Unison that `y` is an argument to `f`, not a part of the type annotation expression.

## Function application

A function application `f a1 a2 an` applies the function `f` to the arguments `a1` through `an`.

The above syntax is valid where `f` is a [regular identifier](/docs/language-reference/identifiers). If the function name is an operator such as `*`, then the syntax for application is infix :  `a1 * a2`. Any operator can be used in prefix position by surrounding it in parentheses: `(*) a1 a2`. Any [regular identifier](/docs/language-reference/identifiers) can be used infix by surrounding it in backticks: ``a1 `f` a2``.

All Unison functions are of arity 1. That is, they take exactly one argument. An n-ary function is modeled either as a unary function that returns a further function (a partially applied function) which accepts the rest of the arguments, or as a unary function that accepts a tuple.

Function application associates to the left, so the expression `f a b` is the same as `(f a) b`. If `f` has type `T1 -> T2 -> Tn` then `f a` is well typed only if `a` has type `T1`. The type of `f a` is then `T2 -> Tn`. The type constructor of function types, `->`, associates to the right. So `T1 -> T2 -> Tn` parenthesizes as `T1 -> (T2 -> TN)`.

The evaluation semantics of function application is applicative order [Call-by-Value](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value). In the expression `f x y`, `x` and `y` are fully evaluated in left-to-right order, then `f` is fully evaluated, then `x` and `y` are substituted into the body of `f`, and lastly the body is evaluated.

An exception to the evaluation semantics is [Boolean expressions](/docs/language-reference/expressions/#boolean-expressions), which have non-strict semantics.

Unison supports [proper tail calls](https://en.wikipedia.org/wiki/Tail_call) so function calls in tail position do not grow the call stack.

### Syntactic precedence

Prefix function application:

* Binds more tightly than infix operators. So `f x + g y` is the same as `(f x) + (g y)`.
* Binds less tightly than keywords that introduce [blocks](/docs/language-reference/blocks). So `f let x` is the same as `f (let x)` and `f if b then p else q` is the same as `f (if b then p else q)`
* Binds less tightly than `'` and `!` (see [delayed computations](docs/language-reference/expressions/#delayed-computations)), so `'f x y` is the same as `(_ -> f) x y` and `!f x y` is the same as `f () x y`.

## Boolean expressions
A Boolean expression has type `Boolean` which has two values, `true` and `false`.

## Conditional expressions
A _conditional expression_ has the form `if c then t else f`, where `c` is an expression of type `Boolean`, and `t` and `f` are expressions of any type, but `t` and `f` must have the same type.

Evaluation of conditional expressions is non-strict. The evaluation semantics of `if c then t else f` are:
* The condition `c` is always evaluated.
* If `c` evaluates to `true`, the expression `t`  is evaluated and `f` remains unevaluated. The whole expression reduces to the value of `t`.
* If `c` evaluates to `false`, the expression `f` is evaluated and `t` remains unevaluated. The whole expression reduces to the value of `f`.

The keywords `if`, `then`, and `else` each introduce a [Block](docs/language-reference/expressions/blocks)  as follows:

``` unison
if
  <block>
then
  <block>
else
  <block>
```

### Boolean conjunction and disjunction
A _Boolean conjunction expression_ is a `Boolean` expression of the form `and a b` where `a` and `b` are `Boolean` expressions. Note that `and` is not a function, but built-in syntax.

The evaluation semantics of `and a b` are equivalent to `if a then b else false`.

A _Boolean disjunction expression_ is a `Boolean` expression of the form `or a b` where `a` and `b` are `Boolean` expressions. Note that `or` is not a function, but built-in syntax.

The evaluation semantics of `or a b` are equivalent to `if a then true else b`.

## Delayed computations

An expression can appear _delayed_ as `'e`, which is the same as `_ -> e`. If `e` has type `T`, then `'e` has type `forall a. a -> T`.

If `c` is a delayed computation, it can be _forced_ with `!c`, which is the same as `c ()`. The expression `c` must conform to a type `() -> t` for some type `t`, in which case `!c` has type `t`.

Delayed computations are important for writing expressions that require [abilities](/docs/language-reference/abilities). For example:

``` unison
use io

program : '{IO} ()
program = 'let
  printLine "What is your name?"
  name = !readLine
  printLine ("Hello, " ++ name)
```

This example defines a small I/O program. The type `{IO} ()` by itself is not allowed as the type of a top-level definition, since the `IO` ability must be provided by a handler, see [abilities and ability handlers](/docs/language-reference/abilities)). Instead, `program` has the type `'{IO} ()` (note the `'` indicating a delayed computation). Inside a handler for `IO`, this computation can be forced with `!program`.

Inside the program, `!readLine` has to be forced, as the type of `io.readLine` is `'{IO} Text`, a delayed computation which, when forced, reads a line from standard input.

### Syntactic precedence

The reserved symbols `'` and `!` bind more tightly than function application, So `'f x` is the same as `(_ -> f) x` and `!x + y` is the same as `(x ()) + y`.

These symbols bind less tightly than keywords that introduce blocks, so `'let x` is the same as `_ -> let x` and `!if b then p else q` is the same as `(if b then p else q) ()`.

Additional `'` and `!` combine in the obvious way:
  * `''x` is the same as `(_ -> (_ -> x))` or `(_ _ -> x)`.
  * `!!x` is the same as `x () ()`.
  * `!'x` and `'!x` are both the same as `x`.

You can of course use parentheses to precisely control how `'` and `!` get applied.

__Next:__ [Types](/docs/language-reference/types)
