---
title: Documenting Unison code
description: How to write Unison documentation and associate it with your code
---

# Documenting Unison Code

Unison comes with a powerful documentation format which makes it easy to write rich, correct documentation. In addition to basic Markdown-like syntax and formatting, Unison documentation also supports inline evaluation, typechecked and linked code snippets, and embedding docs within other docs. We'll walk through these features below.

## The basics 
Documentation blocks start with `{{` and end with a matching `}}`. This syntax creates an expression of type `Doc` and it can be used anywhere in your code where an expression can be written.

Anonymous documentation blocks are blocks that are created immediately before the definitions in your code. This means we don't need to assign our documentation block to a value, as in `x = {{my docs}}`. We'll use a simple example here: 

```unison
{{Maya Angelou is an acclaimed poet, director, essayist, and novelist.}}
poet = "Maya Angelou" 
```

In the UCM we should see: 

```ucm
⍟ These new definitions are ok to `add`:
    
    poet.doc       : Doc
    poet           : Text
```

Here our anonymous doc is automatically linked to `poet` as the term `poet.doc`. 

To read a term's documentation, use the `docs` command in the UCM like this: 

```ucm
.> docs poet

  Maya Angelou is an acclaimed poet, director, essayist, and novelist.
```

A UCM command taking the form `docs myTermName` will look for a term called `myTermName.doc` in the file or codebase, so we do not need to explicitly link our docs to our code if we respect that naming convention. 

## Evaluating and including code 

Let's write some documentation which showcases how Unison can evaluate code in documentation.  

```unison
{{  
  ``repeat`` is a function which will repeat the provided text a specified number of times. 
}}
repeat : Nat -> Text -> Text
repeat n text = 
  go i acc = 
    if i >= n then acc else go (i+1) (text ++ acc) 
  go 0 ""
```

We're using the anonymous docs syntax again, but we've introduced a new Unison documentation feature - the double backtick syntax. Double backticks are how we include inlined snippets of Unison code. These snippets are typechecked, so you know the code in your documentation is going to accurately represent your codebase. If we were to rename `repeat` to `echo` the docs would reflect that automatically.   

Unison docs also support evaluating entire blocks of code. This can be useful for specifying longer examples and use cases. Let's add one to our `repeat` documentation block:  

```unison
{{  
    ``repeat`` is a function which will repeat the provided text a specified number of times. 

    Examples: 
  
    ```
    (repeat 2 "rose is a ") ++ "rose"
    ```
}}
```

The documentation will render both the source code and the result of evaluating the code for anything between triple backticks.

```ucm
.> docs repeat

  `repeat` is a function which will repeat the provided text a specified number of times.
  
  Examples:
  
      repeat 2 "rose is a " Text.++ "rose"
      ⧨
      "rose is a rose is a rose"
```

Let's imagine our docs would really benefit from displaying the full source code of the function they're describing. We can do that with the `@source{myTerm}` syntax.

```unison
{{  
    ``repeat`` is a function which will repeat the provided text a specified number of times. 

    Source: 

    @source{repeat}

    Examples: 

    ```
    (repeat 2 "rose is a ") ++ "rose"
    ```
}}
```

The full implementation of `repeat` is now on display: 

```ucm
.> docs repeat

  `repeat` is a function which will repeat the provided text a specified number of times.
  
  Source:
  
      repeat n text =
        go i acc =
          if i >= n then acc
          else
            use Nat +
            use Text ++
            go (i + 1) (text ++ acc)
        go 0 ""
  
  Examples:
  
      repeat 2 "rose is a " Text.++ "rose"
      ⧨
      "rose is a rose is a rose"
```      

Maybe our documentation is better served by just including the signature of a function. Let's try that with `@signature{myTerm}`: 

```unison
{{  
    @signature{repeat}

    ``repeat`` is a function which will repeat the provided text a specified number of times. 

    Examples: 

    ```
    (repeat 2 "rose is a ") ++ "rose"
    ```
}}
```

```ucm 
.> docs repeat

  `repeat : Nat -> Text -> Text`
  
  `repeat` is a function which will repeat the provided text a specified number of times.
  
  Examples:
  
      repeat 2 "rose is a " Text.++ "rose"
      ⧨
      "rose is a rose is a rose"
```

It's common for Unison docs to be composed of smaller components. We can combine `Doc` values using the ``{{ subdoc }}`` syntax. In our `repeat.doc` code we might extract the "Examples" portion of our documentation into a separate term if it grows too long. 

```unison
{{  
    @signature{repeat}

    ``repeat`` is a function which will repeat the provided text a specified number of times. 

    {{ repeat.doc.examples }}
}}

repeat.doc.examples : Doc
repeat.doc.examples = {{ 
    Examples: 

    ```
    (repeat 2 "rose is a ") ++ "rose"
    ```

    ```
    repeat 0 "zero"
    ```
}}
```

When we want to read the docs for `repeat`, the entire docs block will be rendered to the user. 

```ucm
.> docs repeat 

  `repeat : Nat -> Text -> Text`
  
  `repeat` is a function which will repeat the provided text a specified number of times.
  
  Examples:
  
      repeat 2 "rose is a " Text.++ "rose"
      ⧨
      "rose is a rose is a rose"
  
      repeat 0 "zero"
      ⧨
      ""
```

To summarize, Unison docs can execute and embed code in the following ways: 
* ````double backticks```` are used to inline Unison code
* `````triple backticks````` wrap executable code blocks
* `@source{myTerm}` can be used for displaying the source code
* `@signature{myTerm}` includes the signature in the docs
* `{{ subdoc }}` includes a `Doc` element in the docs

## Basic text formatting cheat sheet 

Unison supports the following text formatting features:

| Text Formatting | Docs Syntax |
| ----------- | ----------- |
| italicized | \*asterisks\* |
| bold | \_\_double underscore\_\_ |
| strikethrough | \~~double tilde\~~ | 
| monospace | \`single backticks\` |
| bullet list | *, -, or + | 
| numbered list | 1. My List | 

## Link syntax cheat sheet 

Linking to both external URLs and definitions in your codebase can be done in several ways: 

| Link type | Docs Syntax | Purpose |
| ----------- | ----------- | ---- |
| external url | \[An external url](https://unisonweb.org) | Links to an external URL, used for including relevant resources |
| term/type link | {Some} is a term link and {type Optional} is a type link | Links to a term or type in the codebase, future documentation UI's may enable click-through linking | 
| named term/type link | \[a named term link]({Some}) and \[A named type link]({type Optional}) | Links to a term or type in the codebase but gives the link the name in square brackets for readability |

# Suggested conventions

Although documentation values don't require any particular structure you might try writing your docs according to a few guidelines: 

- Start with a brief one sentence or short paragraph overview, then optionally include a longer description, include some examples which illustrate common cases and edge cases, and finally link to related definitions and further reading.
- Follow sensible naming conventions for documentation and examples. For a definition `Jabberwock.whiffle`, for example:
    - Its primary documentation should be called `Jabberwock.whiffle.doc`, and secondary docs could be in the `Jabberwock.whiffle.doc` namespace. I.e. a document called `Jabberwock.whiffle.doc.advancedUsages` could show advanced usages of the term.
    - Non-inlined documentation examples could be in the `Jabberwock.whiffle.doc.examples` namespace. For instance: `Jabberwock.whiffle.doc.examples.ex1` and `Jabberwock.whiffle.doc.examples.ex2`.

We hope you enjoy writing documentation in Unison! More details on Unison documentation can be found in a [transcript describing the full feature set.](https://github.com/unisonweb/unison/blob/ca951f36dbdc8a32e267acb9f8051ef64b90ec97/unison-src/transcripts-using-base/doc.output.md) 😃 
