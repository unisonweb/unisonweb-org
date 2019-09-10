---
title: Blocks and statements
description: placeholder
---

# Blocks and statements

A block is an expression that has the general form:

``` unison
statement_1
statement_2
...
statement_n
expression
```

A block can have zero or more statements, and the value of the whole block is the value of the final `expression`. A statement is either:

1. A [term definition](#term-definition) which defines a term within the scope of the block. The definition is not visible outside this scope, and is bound to a local name. Unlike top-level definitions, a block-level definition does not result in a hash, and cannot be referenced with a [hash literal](#hashes).
2. A [Unison expression](#unison-expressions). In particular, blocks often contain _action expressions_, which are expressions evaluated solely for their effects. An action expression has type `{A} T` for some ability `A` (see [Abilities and Ability Handlers](#abilities-and-ability-handlers)) and some type `T`.
3. A [`use` clause](#use-clauses).

An example of a block (this evaluates to `16`):

``` unison
x = 4
y = x + 2
f a = a + y
f 10
```

A number of language constructs introduce blocks. These are detailed in the relevant sections of this reference. Wherever Unison expects an expression, a block can be introduced with the  `let` keyword:

``` unison
let <block>
```

Where `<block>` denotes a block as described above.

## The lexical syntax of blocks

The standard syntax expects statements to appear in a line-oriented layout, where whitespace is significant.

The opening keyword (`let`, `if`, `then`, or `else`, for example) introduces the block, and the position of the first character of the first statement in the block determines the top-left corner of the block. The beginning of each statement in the block must be lined up exactly with the left edge of the block. The first non-whitespace character that appears to the left of that edge (i.e. outdented) ends the block. Certain keywords also end blocks. For example, `then` ends the block introduced by `if`.

A statement or expression in a block can continue for more than one line as long as each line of the statement is indented further than the first character of the statement or expression.

For example, these are valid indentations for a block:

``` unison
let
  x = 1
  y = 2
  x + y


let x = 1
    y = 2
    x + y
```

Whereas these are incorrect:

``` unison
let x = 1
  y = 2
  x + y

let x = 1
     y = 2
       x + y
```

### Syntactic precedence

Keywords that introduce blocks bind more tightly than [function application](#function-application). So `f let x` is the same as `f (let x)` and `f if b then p else q` is the same as `f (if b then p else q)`.

Block keywords bind more tightly than [delayed computations](#delayed-computation) syntax. So `'let x` is the same as `_ -> let x` and `!if b then p else q` is the same as `(if b then p else q) ()`.

Blocks eagerly consume expressions, so `if b then p else q + r` is the same as `if b then p else (q + r)`.
