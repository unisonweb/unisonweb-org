---
title: Documenting Unison code
description: How to write Unison documentation and associate it with your code
---

# Documenting Unison Code

Unison ships with a powerful documentation format. Capable of expressing far more than markdown or static text, the documentation format empowers developers to write rich, clear, and correct docs. Documentation is a first class feature of the Unison language and is captured by the Unison type: `builtin.Doc2`. Unison docs offer native support for features like executing typechecked code samples, embedding docs within other docs, and annotating your writing with tooltips, asides, and callouts. We'll walk through some of these features next. 

## The basics 
Documentation blocks start with `{{` and end with a matching `}}`. Anonymous documentation blocks can be defined immediately before a top-level term or type but you can also create them anywhere you'd write an expression. 

```unison
author = {{Noam Chomsky}}
{{@eval{nonsense} - *{{author}}*, is a grammatically well formed, but non-sensical sentence}}
nonsense = "Colorless green ideas sleep furiously."
```

Note that we're actually executing `nonsense` with the `@eval` block in our documentation and that the documentation value for `author` is embedded within another documentation block.

In the UCM you should see that our documentation block is automatically linked to `nonsense` as `nonsense.doc`. 

```ucm
⍟ These new definitions are ok to `add`:
    
    author       : Doc2
    nonsense     : Text
    nonsense.doc : Doc2
```

## Viewing Docs 
To read the documentation associated with any term or type declaration, use the `docs` or `display` command in the UCM. A command taking the form `docs myTermName` will look for a term called `myTermName.doc` in the file or codebase, so we do not need to explicitly link our docs to our code if we respect that naming convention. 

```ucm
.> docs nonsense

  `"Colorless green ideas sleep furiously."` - Noam Chomsky, is a grammatically well formed, but non-sensical
  sentence
```

To view the implementation of our documentation, we can use the `view` command. 

```ucm
.> view nonsense.doc

  nonsense.doc : Doc2
  nonsense.doc =
    {{
    @eval{ nonsense } - {{ author }}, is a grammatically well formed, but non-sensical sentence
    }}
```

So - we know how to define a simple doc, link it to a definition, and render it in the console. Let's explore some of the richer formatting cabilities of Unison docs. 

# Text Formatting and Linking

Let's look at the following docs example to see more of the documentation type's powers: 
```unison
{{
  PartOfSpeech describes the nine ways a word can function in a phrase. Defined as: 

  @source{type PartOfSpeech}

  {{furtherExposition}}

  {{examples}}
}}
unique type PartOfSpeech Text = 
  Noun Text | 
  Verb Text | 
  Adjective Text | 
  Adverb Text | 
  Pronoun Text | 
  Preposition Text | 
  Conjunction Text | 
  Determiner Text | 
  Interjection Text 

examples = {{
  Examples:
    * @eval{Interjection "Zoinks!"} 
    * This is going @eval{Adverb "swimmingly"} 
    * These are @eval{Adjective "lovely"}
      - Japanese has [two forms of Adjectives,]({type JapaneseAdjective}) 
}}
 
furtherExposition = {{
  There are *many* different interpretations of the possible parts of speech. 
}}

{{Japanese Adjectives are "i" or "na" form, respectively. 
[Learn more](https://en.wikipedia.org/wiki/Japanese_equivalents_of_adjectives)}}
unique type JapaneseAdjective = い | な

```
We'll break this down further. 

### Modular Docs
Notice how documentation can be composed of much smaller blocks which are assembled together in the final `PartOfSpeech.doc` term. It's common to build longer documents by including subdocuments via the `{{ subdoc }}` syntax. 

### Style 
The Unison doc format supports basic text formatting and styling.  Text can be \__bold__, \*italicized*, \~~strikethrough~~, or \`monospaced` and paragraphs are separated by one or more blank lines.

### Lists 
Bullet pointed lists and numbered lists are also supported in the documentation format. `*`, `+`, and `-` are all valid bullet points, though the variation will be normalized away by an eventual pretty-printer.  Numbered lists take the form: 

```unison
{{
1. Buffalo
2. buffalo
    * buffalo
3. buffalo.
}}
```
As you can see, you can intermix your numbered and bullet pointed lists as you please and nest lists arbitrarily.

### Links
Hyperlinking is supported to external urls, but you can also link to other relevant parts of your codebase via term or type linking. When we wrote `some text which looks [like this.]({type MyType})` we created a named type link. Similarly, we might have created a named *term* link with the same format: `I am a [term link]({myTermHere})`. Alternatively, if naming our link isn't important to our doc's flow, we can simply embed a type or term link `by writing a term link like so: {someTerm} or a type link like this: {type SomeType}`. Using term and type links within a doc is a handy way to link to other documents. In our example above, a user might use the click-through capabilities in an interactive renderer of the docs to understand the relationship between code components or learn more through relevant urls. 

# Suggested conventions

Although documentation values don't require any particular structure you might try structuring your docs in accordance with the following guidelines: 

- Start with a brief overview, then maybe a longer description, then some examples, then link to related definitions and further reading.
- Use Markdown syntax for formatting. Indent examples by 4 spaces for readability when viewing the docs in plain text form, and this will also render nicely as Markdown.
- Follow sensible naming conventions for associated documentation and examples. For a definition `Jabberwock.whiffle`, for example:
    - Its primary documentation should be called `Jabberwock.whiffle.doc`, and secondary docs could be in the `Jabberwock.whiffle.docs` namespace. Perhaps a document called `Jabberwock.whiffle.docs.advancedUsages` could show advanced usages of the function.
    - Examples could be in the `Jabberwock.whiffle.examples` namespace. For instance: `Jabberwock.whiffle.examples.ex1` and `Jabberwock.whiffle.examples.ex2`.

# Evaluating Code 
We'll reinforce and expand upon the myriad ways Unison source code can be included documentation next. We've observed that Unison source code can be included in docs using the `@source` block. Gone are the days when your docs describe a function which has changed its name or content. Unison docs do not drift from their code definitions!  We've also seen `@eval` for evaluating expressions, and term linking `[namedLink]({myTerm})` but the Unison doc format has additional capabilities. 

```unison 
  evaluation : Doc2
  evaluation =
    use Nat +
    use Text ++ 
    {{
    # Evaluation
    
      Expressions can be evaluated inline, for instance
      @eval{"hello" ++ " unison"}.
      
      Blocks of code can be evaluated as well:
      
      ```
      id x = x
      id (isPalindrome [?w,?o,?w])
      ```
      
      To include a typechecked snippet of code without
      evaluating it, you can write:
      
      @typecheck ```
        isPalindrome : [Char] -> Boolean
        isPalindrome cs = cs == reverse cs
      ```

      Maybe you'd just like the signatures of your functions in your docs. You can do that too: 
      
      @signatures{isPalindrome, ++}

    }}
```

Let's see what this looks like in the UCM with the `display` command. 

```ucm
  # Evaluation
  
    Expressions can be evaluated inline, for instance `"hello unison"`.
  
    Blocks of code can be evaluated as well:
  
        id x = x
        id (isPalindrome [?w,?o,?w])
        ⧨
        true
  
    To include a typechecked snippet of code without evaluating it, you can write:
  
        isPalindrome cs = cs == reverse cs
  
    Maybe you'd just like the signatures of your functions in your docs. You can do that too:
  
        isPalindrome : [Char] -> Boolean
    
        Text.++ : Text -> Text -> Text
```

# Embellishments 
Documentation can be futher embellished with helpful visual and semantic annotations. Unison supports documentation features like asides, callouts, tables, and tooltips. A rich rendering interface can style and format these appropriately. These don't currently have special syntax; just use the `{{ }}` syntax to call these functions directly. 
  
```unison
asides : Doc2
asides =
  {{
    This is an aside: 
    {{ docAside {{ Time flies like an arrow. }} }}
    
    A callout: 
    {{ docCallout
      None {{ Fruit flies like a banana. }} 
    }}
    
    A callout with icon: 
    {{ docCallout
      (Some {{ 🌹 }})
      {{
      Rose is a rose is a rose is a rose.
      }} 
    }}
  }} 
```

Asides are for extra details that don't belong in the main text, whereas callouts should be used where you'd like to emphasize a particular point. Callouts are parameterized by an `Optional` icon so you can further customise your messages. 

Block quotes, tables and hoverable tool-tips are also supported. 
```unison
moreDocFeatures = {{
  {{ docBlockquote
    {{
      "And what is the use of a book," thought Alice, "without
      pictures or conversation?"
      
      *Lewis Carroll, Alice's Adventures in Wonderland*
    }} 
  }}
    
  {{ docTooltip {{ Knock Knock! }} {{ Who's there? }} }}
    
  {{ docTable [
    [ {{ Twas brillig, }}, {{ and the slithy toves }}, {{
      Did gyre and gimble in the wabe: All mimsy were the borogoves,
    }} ],
    [ {{ And the }}, {{ mome raths }}, {{ outgrabe. }} ] 
  ] }}
}}
```

We hope you'll agree that writing documentation in Unison is an easy and delightful process that will help developers better communicate the intent and value of their work. More details on documentation can be found [here.](https://github.com/unisonweb/unison/blob/ca951f36dbdc8a32e267acb9f8051ef64b90ec97/unison-src/transcripts-using-base/doc.output.md) We look forward to reading more Unison docs in the libraries and code of your own making. 😃 
