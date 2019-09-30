---
title: Conclusion and exercises
description: placeholder
---

You now know all about Unison abilities!  You can...
* write effectful code that calls out to abilities like `Log`, `Abort`, and `Store`
* run effectful computations using `handle` expressions
* write handlers (functions of type `Request r a -> o`) to translate one ability into another (possibly `IO`), including handlers that
  * send information *in* to the computation, or receive information coming *out*, or both
  * influence program control flow in ways regular functions can't (like `Abort` and `Choice`)
* understand ability lists in subtle type signatures like `ServerConfig ->{Log} '{IO} ()`
* understand Unison's ability generalization and inference, and when it lets you
  * omit ability lists in type signatures, letting Unison infer them
  * pass effectful functions into higher-order functions like `map`
* structure a program into a core part which uses fine-grained abilities, and then transform that using outer layers of handlers to yield a program of type `'{IO} ()`.

Great work! 👍 😎 

## What next?
* Try working through some of the exercises below!
* We'd love you to get in touch with us to let us know what you found difficult, or if you have any ideas for improving Unison's ability support, or even if you just think it's cool 😁

# Exercises

Here are some ideas for exercises to get you fluent in working with abilities.  In each case, be sure to actually try running your code!

1. Write an ability `ConsoleIO`, and a handler for it of type `Request ConsoleIO a ->{IO} a` that uses `getLine` and `putLine` from `.base.io`.  Write a program of type `'{ConsoleIO} Text`.  

2. Write a handler for `Log` that writes to file.  Write a program of type `'{Log} ()` and try running it first with your handler, and then with the `logHandler` from [Handling `Log`](/docs/ability-tutorial/writing-handlers#handling-log).

3. Write a handler for the `Exception` ability shown in [`Abort` and `Exception`](/docs/ability-tutorial/examples-of-abilities#abort-and-exception).

4. Change the `systemTimeToPure` handler from [Feeding in information via a pure handler](/docs/ability-tutorial/writing-handlers#feeding-in-information-via-a-pure-handler) so that it uses `Abort` to handle the case where it runs out of data to pass to the computation.  

5. Change the `choiceToPure` handler from [Handling `Choice`](/docs/ability-tutorial/writing-handlers#handling-choice) to return a value of `type Choices a = Choice (Choices a) (Choices a) | Result a`, so you can see what choices led to each result.  Try using it in a program that counts 'tails' in a sequence of coin tosses.  

6. Write an ability `Random` that lets a program ask for a random `Nat`.  Write a handler that acts as a pseudo-random number generator.  (You get a simple PRNG by iterating the function `seed -> (6364136223846793005 * seed + 1442695040888963407)`) [[reference](https://en.wikipedia.org/wiki/Linear_congruential_generator)]

7. Write a handler for `Choice` which instead of enumerating *all* possible variants of the computation instead takes a random sample of them.  

8. Start with `ability Send a where send : a -> ()` and `ability Receive a where receive : a`.  Write a 'multihandler', `pipe : Request (Send m) () -> Request (Receive m) a ->{Abort} a`, to feed the messages `m` sent by one argument in as inputs to be received by the other.  You may find it useful to write a function `step : '{e} a -> Request e a` first.  Then use your handler to define a function of type `('{Send m} ()) -> ('{Receive m} a) ->{Abort} a`.  

9. Write a proxy handler for `IO` that records the input received by the program, at least for some `IO` requests.  Write another `IO` handler to play it back into the program later.  Write a function `recordReplay : ('{IO} ()) ->{IO} ()` that runs its argument twice - once 'for real' with recording, and once as a replay.  (Don't bother saving off the record to disk - that will get easier when Unison gets support for typed data persistence.)
