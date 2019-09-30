---
title: Motivation
description: placeholder
---

# Motivation

Why does Unison have abilities, when so many languages get by without them?

## Making effectful behaviors visible in type signatures

One important reason is that when our functions have behaviors like storing state or doing disk I/O, we want to make that visible in their type signatures.  Here's an example of why this is useful.  

Suppose we're faced with this code:
``` unison
f x = writeLog (g x)
      2 * (g x)
```
`g` is some numerical function which we want to record in our log file, and then double.  What if we find that `g` takes a lot of time to compute?  We'd want to refactor our code to compute it only once:
``` unison
f x = v = g x
      writeLog v
      2 * v   
```
Now, aside from the fact that it runs faster, is the new code equivalent to the old code?  Sure!  As long as `g` didn't have any **effectful** behaviours.  If it made a request to a network server, or opened a file on disk, then the code is not equivalent - it produces different network or filesystem traffic, and depending on external factors (like what the server returns), might yield a different return value.  

So, in this example, it's important to know whether `g` is effectful.  In Unison, we can tell by its type: we might end up with a type something like `Nat ->{Network} Nat` (we'll look harder at that syntax soon).  That's super useful!  We can see at a glance what effects the function might have, without having to read its code (and all the code it calls.)

## Decoupling interface from implementation

An 'ability declaration' presents an abstract interface representing the effectful primitives we'd like access to.  For example, the declaration of a `Network` ability might include `sendPacket` or `addPortListener`.  These **requests** are *not* bound directly to a specific implementation - they don't just directly call into the OS's sockets API.  Instead, we do that binding later, when we specify a **handler** for the ability.  Any specialization to OS sockets happens within the handler.  That gives us the flexibility to instead use a testing-specific handler, say one that records the packets sent and allows us to verify their contents.  Or we could take our 'live' handler, and stack it together with another handler that intercepts the packet contents and writes them to a log.  

Most languages have facilities to allow separation of interface from implementation.  But applying this principle to effectful APIs turns out to be a powerful way of structuring programs for modularity and testability.   

## Customizable control flow

Ability requests can be handled in such a way that they abort the computation.  This lets us write abilities like `Exception`, which provides the same kind of exception-handling facility as is found in other languages.  An example of other possible variations is an ability that helps with back-tracking solution search.  Putting control flow in the hands of programmers opens up plenty of possibilities for powerful library design, for example around concurrency and parallelism, without depending on case-by-case language features.  

## Recent research

The design of Unison's ability system comes out of recent research in the theory of programming languages - beginning in the 2000s.  In programming language terms this counts as cutting edge stuff!  It's only recently that we've learned how to build programming languages that combine the advantages listed above, in a user-friendly fashion.  See the links in the [language reference](/docs/language-reference/abilities) if you're interested in further reading about the theory.  

__Next:__ [Using abilities](/docs/ability-tutorial/using-abilities)