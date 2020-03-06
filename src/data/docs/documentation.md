---
title: Documenting Unison code
description: How to write Unison documentation and associate it with your code
---

# Documenting Unison Code

Unison documentation is written in Unison. Documentation consists of values of the type `builtin.Doc`, and there's a special syntax to create these values:

```unison
myDoc : Doc
myDoc = [: This is some documentation. :]
```

The syntax `[:` opens a documentation block, and `:]` closes it. Everything in between is documentation. The block can even span multiple lines:

```unison
myDoc = [: 
  This is documentation
  with line breaks and indentation.
:]
```

## Attaching docs to your code

Documentation can be "linked" to definitions in the Unison codebase. A function you want others to use should link to documentation describing how to use that function.

For example, let's say we have these Unison definitions already in our codebase:

```unison
myFunction.doc = 
  [: This function multiplies its argument by two. :]

myFunction x = x * 2
```

In the `ucm` command-line tool, we can then link the `myFunction.doc` value to the `myFunction` definition, using the `link` command:

```ucm
.> link myFunction.doc myFunction

  Updates:

    1. myFunction : Nat -> Nat
       + 2. myFunction.doc : Doc
```

The documentation value `myFunction.doc` is now linked to the `myFunction` definition in the codebase and we can check this using the `links` command:

```ucm
.> links myFunction

  1. myFunction.doc : Doc
```

This demonstrates the Unison codebase's system of *links*, which allows you to link documentation to code. This system also lets you link all kinds of metadata other than documentation, but for now let's concentrate on docs. The whole metadata linking system is described in detail later in this document.

## Viewing the docs for a definition

We can ask `ucm` to display the documentation for a given definition using the `docs` command:

```ucm
.> docs myFunction

  This function multiplies its argument by two.
```

## The documentation syntax in detail

The syntax `[:` opens a documentation block, and `:]` closes it. Everything in between is documentation, and the whole block is a Unison value of type `builtin.Doc`. Inside a documentation block, you can use the following special syntax elements.

### Hyperlinks to other definitions

You can create a hyperlink to a Unison definition named `myDef` in your codebase with `@myDef`. For example we could have the documentation for `myFunction` reference that function itself:

```unison
myFunction.doc = 
  [: @myFunction multiplies its argument by two. :]
```

### Insert the source code of another definition

You can include the full source code of any definition in your codebase using `@[source]` followed by the name of the definition. For example, to include the source code of `myFunction` in its own documentation:

```unison
[:  
  Multiplies its argument by two.
  Here is its source code:

  @[source] myFunction
:]
```

When Unison displays this `Doc`, it will be expanded to:

```
Multiplies its argument by two. Here is its source code:

myFunction x = x * 2
```

Note that the source code is not copied into the document, it's just linked to it. Only on display of the document do we see what the link expands to. So if the source code for `myFunction` ever changes, your documentation changes along with it. This kind of linking where the link is expanded on display is sometimes called *[transclusion](https://en.wikipedia.org/wiki/Transclusion).*

### Insert the type signature of a term in the codebase

You can include the type signature of any function or value in the codebase, with `@[signature]` followed by the name of the function or value. For example, to include the type of `myFunction` in its own documentation:

```unison
[:  
  Multiplies its argument by two. Here is its type:

    @[signature] myFunction
:]
```

When Unison displays this `Doc`, the type signature gets expanded:

```ucm
Multiplies its argument by two. Here is its type:

  myFunction : Nat -> Nat
```

This is also a [transclusion](https://en.wikipedia.org/wiki/Transclusion). If the type of `myFunction` ever changes (i.e. the name `myFunction` changes so that it refers to a function with a different type), your `Doc` changes automatically as well.

### Include the full contents of another Doc value

To nest a `Doc` value inside another `Doc` value, use `@[include]` followed by
a name given to that `Doc` value in your codebase. When Unison displays the `Doc`, the entire contents of the included `Doc` will be displayed in that spot.

The rule about [transclusion](https://en.wikipedia.org/wiki/Transclusion) applies here too; if the referenced `Doc` value changes, your `Doc` changes automatically as a result.

Note that Unison will not let you create a cycle where you include a `Doc` inside of itself.

### Include any Unison value from the codebase

Sometimes you want to include the result of evaluating some Unison expression. To do this, use `@[evaluate]` followed by the name of a value in your codebase. For example, given a definition like this:

```unison
exampleExpression = 2 + 2
```

We'll have to first add it to the codebase:

```ucm
.> add

  ⍟ I've added these definitions:

    exampleExpression : Nat
```

Once the definition in the codebase, we can insert the result of evaluating it
into any `Doc` value:

```unison
exampleDoc = 
  [: The value is @[evaluate] exampleExpression :]
```

When Unison displays `exampleDoc`, this will get expanded to:

```ucm
The value is 4
```

[Transclusion](https://en.wikipedia.org/wiki/Transclusion) applies here as well; even if the definition of `exampleExpression` changes, Unison will always display its current value when showing the `Doc`.

The Unison codebase caches evaluated results, so even if your expression is expensive, you don't have to worry about Unison evaluating it again every time it displays your documentation.

### Escape sequences

If you want your `Doc` to contain literally the `:]` character sequence or the `@` symbol, you can do so with `\\:]` and `\\@`, respectively. Example:

```unison
[:
  A documentation block looks like this:
  [: Contents go here \\:]

  Email simple\\@example.com for questions.
:]
```

This will be displayed as:

```
A documentation block looks like this:
[: Contents go here :]

Email simple@example.com for questions.
```

## The Doc datatype

Even though there is special syntax for `Doc` values, it's just an ordinary data type:

```unison
unique type Doc
  = Link Link
  | Source Link
  | Blob Text
  | Signature Term
  | Evaluate Term
  | Join [Doc]
```

You can use ordinary data construction syntax in Unison to construct documentation, instead of (or in addition to) using the special syntax, if you like.

Values of type `Link` are constructed with the `Link.Term : Term -> Link` and `Link.Type : Type -> Link`.

Values of type `Type` are constructed with the `typeLink` keyword and `Term` values are constructed with the `termLink` keyword. For example `Link.Term (termLink myFunction)` constructs a `Link` referencing the definition `myFunction` in the codebase. (Although these keywords look like functions, they are not.)

- `Link (Link.Term termLink myDef)` corresponds to the syntax `[: @myDef :]`, a `Doc` that just contains a hyperlink to the term definition `myDef`.
- `Link (Link.Type typeLink myType)` corresponds to the syntax `[: @myType :]`, a `Doc` that just contains a hyperlink to the type declaration `myType`.
- `Source (Link.Term termLink myDef)` corresponds to the syntax `[: @[source] myDef :]`, a `Doc` that contains the source code of the term definition `myDef`.
- `Source (Link.Type typeLink myType)` corresponds to the syntax `[: @[source] myType :]`, a `Doc` that contains the source code of the type declaration `myType`.
- `Blob "some text"` corresponds to the syntax `[: some text :]`.
- `Signature (termLink myDef)` corresponds to the syntax `[: @[signature] myDef :]`, a `Doc` that contains the type signature of the term definition `myDef`.
- `Evaluate (termLink myDef)` corresponds to the syntax `[: @[evaluate] myDef :]`, a `Doc` that shows the result of evaluating `myDef`.
- `Join [doc1, doc2]` corresponds to the syntax `[: @[include] doc1 @[include] doc2 :]`, and `Join [Blob "foo bar", Blob "baz qux"]` corresponds to `[: foo bar baz qux :]`

### Suggested conventions

Although documentation values don't require any particular structure, here's a more complete example that uses some helpful conventions:

```unison
List.take.doc = [:
  `@List.take n xs` returns a list of the first `n`
  elements of `xs`. Complexity is O(log n).
  
  Here's a typical example:

      @[source] List.take.examples.ex1
      ↳ @[evaluate] List.take.examples.ex1

  If we `@List.take` more than the size of the list, we 
  get back the original list:

      @[source] List.take.examples.ex2
      ↳ @[evaluate] List.take.examples.ex2

  And lastly, `@List.take 0 xs` is always equal to `[]`,
  the empty list. 

  __Also see:__
 
  * @List.drop (ignores the first `n` elements)
  * @List.doc has more about the @List data structure
  :]
```

That is:

- Start with a 1-2 sentence overview, then an (optional) longer description, then some examples, then link to related definitions and further reading.
- Use Markdown syntax for formatting. Indent examples by 4 spaces for readability when viewing the docs in plain text form, and this will also render nicely as Markdown.
- Use the following naming conventions for associated documentation and examples. For a definition `List.take`, for example:
    - Its primary documentation value can be called `List.take.doc` (secondary docs can be in the `[List.take.docs](http://list.take.docs)` subnamespace, perhaps `List.take.docs.advancedUsages`).
    - Examples can be in the `List.take.examples` namespace (for instance, above we just named the examples `List.take.examples.ex1` and `List.take.examples.ex2`.

