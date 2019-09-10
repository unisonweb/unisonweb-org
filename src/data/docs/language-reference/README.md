---
title: Introduction
description: placeholder
---

# Introduction

This document is an informal reference for the Unison language meant as an aid for Unison programmers as well as authors of implementations of the language. This isn't meant to be a tutorial or introductory guide to the language; it's more like a dry and unexciting tome you consult when you have questions about some aspect of the language. 🧐

This language reference, like the language it describes, is a work in progress and will be improved over time ([GitHub link](https://github.com/unisonweb/unison/blob/master/docs/LanguageReference.md)). Contributions and corrections are welcome!

## A note on syntax
Unison is a language in which _programs are not text_. That is, the source of truth for a program is not its textual representation as source code, but its structured representation as an abstract syntax tree.

This document describes Unison in terms of its default (and currently, only) textual rendering into source code.

## Top-level declarations

A top-level declaration can appear at the _top level_ or outermost scope of a Unison file. It can be one of the following forms:

* A [term declaration][term], like `x = 42`. See [this page][term] for more.
* A [type declaration][type], like `type Optional a = None | Some a`. See [this page][type] for more.
* A [use clause][use], like `use .base` or `use math sqrt`. See [this page][use] for more.

[term]: /docs/language-reference/term-declarations
[type]: /docs/language-reference/type-declarations
[use]:  /docs/language-reference/use
