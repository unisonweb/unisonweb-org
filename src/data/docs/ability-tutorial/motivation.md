---
title: Motivation
description: placeholder
---

# Motivation

Why does Unison have abilities, when so many languages get by without them?

## 1. Making effectful behaviors visible in type signatures

One important reason is that when our functions have effectful behaviors like storing state or doing disk I/O, we want to make that visible in their type signatures.  Here's an example of why this is useful.  

Suppose we're faced with this code:
``` unison
f x = 2 * (g x)
```
Then later we come back and we find that a well-intentioned friend has changed our code to the following.

``` unison
f x = writeLog (g x)
      2 * (g x)
```
Now, aside from the logging, is the new code equivalent to the old code?  Well, only if `g` didn't have any effectful behaviours.  If it made a request to a network server, or opened a file on disk, then the code is not equivalent — it produces different network or filesystem traffic, and depending on external factors (like what the server returns), might yield a different return value.  

So, in this example, it's important to know whether `g` is effectful.  In Unison, we can tell by its type: we might end up with a type something like `Nat ->{Network} Nat` (we'll look harder at that syntax soon).  That's super useful!  We, and our well-intentioned friend, can see at a glance what effects a function might have, without having to read its code (and all the code it calls.)  That makes it much easier to be sure that we're only allowing effects to take place in contexts where they are appropriate.  

## 2. Decoupling interface from implementation

An ability declaration presents an abstract interface representing the effectful operations we'd like access to.  For example, the declaration of a `Network` ability might include `sendPacket` or `addPortListener`.  These operations are *not* bound directly to a specific implementation — they don't just directly call into the OS's sockets API.  Instead, we do that binding later, when we specify a handler for the ability.  Any specialization to OS sockets happens within the handler.  That gives us the flexibility to instead use a testing-specific handler, say one that records the packets sent and allows us to verify their contents.  Or we could take our 'live' handler, and stack it together with another handler that intercepts the packet contents and writes them to a log.  

Most languages have facilities to allow separation of interface from implementation.  But applying this principle to effectful APIs turns out to be a powerful way of structuring programs for modularity and testability.   

## 3. Customizable control flow

An ability's operations have control over how the continuation of the calling function is invoked.  For example, the continuation might not be invoked at all, which means that the operation aborts the computation.  This lets us write abilities like `Exception`, which provides the same kind of exception-handling facility as is found in other languages.  An example of other possible variations is an ability that helps with back-tracking solution search.  Putting control flow in the hands of programmers opens up plenty of possibilities for powerful library design, for example around concurrency and parallelism, without depending on case-by-case language features.  

## 4. Recent research

The design of Unison's ability system comes out of recent research in the theory of programming languages — beginning in the 2000s.  It's only recently that we've learned how to build programming languages that combine the advantages listed above, in a user-friendly fashion.  See the links in the [language reference](/docs/language-reference/abilities) if you're interested in further reading about the theory.  

__Next:__ [Using abilities](/docs/ability-tutorial/using-abilities)