---
title: Annotated bibliography
description: Learn more about the research backing Unison, related work, and influences
---

# An annotated bibliography

> 🚧  This page is still very much under construction. [Source is here](https://github.com/unisonweb/unisonweb-org/new/master/src/data/docs) if you'd like to help fill it out.

This page is for those curious about Unison's background. It covers some of the research backing Unison and lists related work and influences. __You don't need to know about any of this to use Unison__ but we like to acknowledge that Unison is part of a big world where lots of interesting work happens. We are standing on the shoulders of giants!

## Influences

The core Unison language was influenced primarily by [Haskell](https://haskell.org) (for its ideas on purely functional programming), [Erlang](https://www.erlang.org/) (for its ideas on distributed execution and handling of failures), and [a research language by Lindley, McBride et. al called Frank](https://arxiv.org/abs/1611.09259) (for its approach to working with effects / abilities).

We also have looked at and taken inspiration from lots of other languages, like Smalltalk, Scala, Elm, and many more.

## Programming language theory

Formally, Unison's type system is an implementation of the system described by Joshua Dunfield and Neelakantan R. Krishnaswami in their 2013 paper [Complete and Easy Bidirectional Typechecking for Higher-Rank Polymorphism](https://arxiv.org/abs/1306.6032).

Unison's system of abilities is based on [the Frank language by Sam Lindley, Conor McBride, and Craig McLaughlin](https://arxiv.org/pdf/1611.09259.pdf). Unison diverges slightly from the scheme detailed in this paper. In particular, Unison's ability polymorphism is provided by ordinary polymorphic types, and a Unison type with an empty ability set explicitly disallows any abilities. In Frank, the empty ability set implies an ability-polymorphic type.

The [effects bibliography](https://github.com/yallop/effects-bibliography) is a good resource for additional background on algebraic effects. Related languages with this feature are [Eff](https://www.eff-lang.org/learn/) and [Koka](https://www.microsoft.com/en-us/research/publication/algebraic-effects-for-functional-programming/).

Other references:

* [Sound and Complete Bidirectional Typechecking for Higher-Rank Polymorphism with Existentials and Indexed Types](https://arxiv.org/abs/1601.05106) extends the earlier paper to include GADTs and existential types. This will likely be implemented by a future version of Unison

## Functional programming

> 🚧 Almost too many things to cite here, would focus on references that provide good background on FP and then specific work that is notable 

## Distributed systems

> 🚧 A few categories of work to cite here ...

* "classics" establishing the nature of distributed systems, "Time, Clocks, and the ordering of events"
* consensus protocols like Paxos, Raft
* work on things like vector clocks, causal consistency
* CRDTs work
* Distributed hash tables, overlay networks
* Modern systems work
