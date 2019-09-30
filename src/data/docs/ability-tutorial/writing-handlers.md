---
title: Writing handlers
description: placeholder
---

We now know how to use and handle abilities.  The last piece of the puzzle is writing our own handlers.  

Here's an example.  We'll unpack this piece by piece.  

``` unison
use .base
use .base.io

systemTimeToIO : Request SystemTime a ->{IO} a
systemTimeToIO r =
  case r of
    { SystemTime.systemTime -> k } -> handle systemTimeToIO in k !systemTime
    { a } -> a

-- We've switched here to having SystemTime.systemTime return a 
-- .base.io.EpochTime, to match what .base.io.systemTime returns 
-- and so make things convenient.  
```

What's going on here?  Let's start with a recap of the type signature.  

* A `Request A T` is a value representing a computation that requires ability `A` and has return type `T`.  `.base.Request` is a built-in type constructor that ties in to Unison's `handle` mechanism: `handle h in k` is taking the computation `k` which has type `T` and uses ability `A`, building a `Request A T` for it, and passing that to `h`.

* A handler is a function `Request A T -> R` - it takes the computation and boils it down into some return value.  Common cases:

  * Typically the signature is `Request A t -> R`, where `t` is a type variable - i.e. `forall t. Request A t -> R`.  Usually the handler doesn't care what the computation's return type is, and we want to be able to apply it at any type.  

  * Sometimes the handler takes extra arguments - for example we saw `storeHandler : v -> Request (Store v) a -> a`, where the first argument is the initial value of the store.  The `Request` is always the last argument, so we can partially apply the handler to get a function whose type is of the above form, which a `handle` expression will accept.

  * Often, the result type `R` of the handled computation is the same as `T`, i.e. `Request A T -> T`.  We saw an exception with `logHandler : [Text] -> Request Log a -> (a, [Text])` - we wanted a way to get at the log that was written!

Let's pause and introduce the key idea behind handlers.  This is a bit subtle so take a deep breath!

👉 A handler handles _one step_ in a computation, and then specifies what to do with the rest of the steps.

We think of the computation as divided up into steps, punctuated by requests using the ability in question, and culminating in a final step which returns a result.  The handler specifies how to deal with each possible kind of step: each of the requests declared by the ability, plus the final step to get the return value.  

Once a handler has dealt with one step, it then specifies what to do with the **continuation** of the computation - that is, all the rest of the steps, treated as one unit.  Typically it does this by recursively calling itself, via `handle`.  So each invocation of the handler unwraps one step of the computation and deals with it.  

Make sense? 🤔  It should do once we've worked through some more examples.  

Let's start by unpacking the body of `systemTimeToIO`.  

* It's doing a pattern match on the `Request SystemTime a`, but the patterns are using a special syntax - here we're seeing `{ SystemTime.systemTime -> k }`.  This means, 'inspect the first step in the computation, and if it's a call out to `SystemTime.systemTime`, then match this branch, and take the remainder of the computation and call it `k`'.  `k` has type `EpochTime -> a`.  The argument of `k` is the return type of the ability request - i.e. the return type of `SystemTime.systemTime`.  This makes sense: if the ability is being used to retrieve some information, then probably the rest of the computation wants to use that information!  (If the request method had returned `()`, then `k` would have had type `() -> a` - there's no information being passed in, but still `k` is delayed.)

* It's handling this case first by evaluating `k !systemTime`.  This is the sharp end of the handler.  The point of the whole business was to consult the system clock by mapping down to the appropriate `IO` call.  That's what we do here.  Note the `!` to force that call, and how we pass the result straight into `k`, as input for the rest of the computation.  This part uses the `IO` ability, hence the `->{IO}` in the signature of the handler.  

* But we're not done yet!  We've only handled one step of the computation.  `k !systemTime` is all of the rest of the steps.  The handler _does_ specify how to handle all these: recursively, with the `handle systemTimeToIO in`.  That converts our effectful computation of return type `T` (in this case type `a`), into a computation of type `R` (in this case also type `a`), which does _not_ use the `SystemTime` ability.  

* The last case of the pattern match, ('the pure case'), `{ a } -> a` is easy.  It's saying 'and when we get to the last step of the computation, take the `a` it returns, and just pass that back directly as the result of the `handle` expression.'

Once we've covered all the cases, we've explained to Unison how to handle all the steps of a `SystemTime` computation, by translating it into an `IO` computation, in which the use of the `SystemTime` ability has been eliminated.  

And that's it!  So now let's take a look at some more examples.  

## Example handlers

### Feeding in information via a pure handler

Let's revisit the `systemTimeToPure` handler which we were using for testing back in [Trying out a test handler](/docs/ability-tutorial/invoking-handlers#trying-out-a-test-handler).  Here's the implementation:

``` unison
use .base
systemTimeToPure : [Nat] -> Request SystemTime a -> a
systemTimeToPure xs r = case r of
  { SystemTime.systemTime -> k } -> case xs of
    x +: rest -> handle (systemTimeToPure rest) in k x
  { a } -> a
```

The interesting thing here is that the handler is taking a `[Nat]` argument, to give it a list of values to feed out each time there's a call to `systemTime`.  Note how the handler is partially applied in the handle expression, `(systemTimeToPure rest)`.  

> Note how the case statement fails to handle receiving an empty list `xs`.  Perhaps a better choice would be for the handler to use `Abort` to cover this case - see the [exercises](/docs/ability-tutorial/conclusion#exercises).

### Handling `Log`

Now let's see a handler for our ability, `ability Log where log : Text -> ()`, which we met back [here](/docs/ability-tutorial/examples-of-abilities#log).  This one doesn't try to map it down to file I/O - it's just collecting the log lines and returning them in the handle expression's return value.

``` unison
use .base
logHandler : [Text] -> Request Log a -> (a, [Text])
logHandler ts r =
  case r of
    { Log.log t -> k } -> handle logHandler (t +: ts) in !k
    { a } -> (a, ts)
```

Again, `logHandler` is being partially applied in the `handle` expression, for the same reason as with `systemTimeToPure`.  The _new_ things we see in this handler are...
* the return type - it's not just `a`.  The only `case` branch where that's visible is the one for the pure case.
* the `Log.log` request takes an argument.  That works how you'd expect - you just match on it (the `t` in the pattern.)
* the `!k`: because `log` just returns `()`, we only need to pass `()` when we call the continuation.  `!k` is another way of writing `k ()`.  

### Handling `Store`

Remember the `Store` ability from [here](/docs/ability-tutorial/examples-of-abilities#store):

``` unison
ability Store v where
  get : v
  put : v -> ()
```

Here's the handler for it.

``` unison
use .base
storeHandler : v -> Request (Store v) a -> a
storeHandler storedValue s = case s of 
  { Store.get -> k } -> handle storeHandler storedValue in k storedValue
  { Store.put v -> k } -> handle storeHandler v in !k
  { a } -> a
```

This is all made up of pieces we've seen before.  Notice the trick in the `put` case: instead of passing through the old `storedValue` to the recursive call, we're passing the new value `v`.

It's good to dwell for a moment on where the stored state actually 'lives'.  It lives in the arguments passed on each call to the handler, and nowhere else.  The evolution of the state during the computation is captured by the changing successive values passed on each new recursive call.  

Now let's take a look at a couple of handlers for abilities that affect the program's control flow in ways that a regular function can't - the key here is whether and when they choose to call `k`.

### Handling `Abort`

Here's the handler for `ability Abort where abort : a`, which we met in [`Abort` and `Exception`](/docs/ability-tutorial/examples-of-abilities#abort-and-exception):

``` unison
use .base
abortToPure : Request Abort a -> Optional a
abortToPure r = case r of
  { Abort.abort -> k } -> None
  { a } -> Some a
```

The key point here is that the case for `abort` *does not use `k`*.  Whatever the remainder of the computation after the call to `abort`, it won't be evaluated, because the continuation `k` is discarded.  

### Handling `Choice`

So if that was a handler calling the continuation 0 times, what about 2 times?  Let's see a handler for `ability Choice where choose : Boolean`, which we met [here](/docs/ability-tutorial/examples-of-abilities#choice).  This handler runs through a whole tree of possible evolutions of the computation, with a fork at each `choose`, and collects the results in a list.

``` unison
use .base
choiceToPure : Request Choice a -> [a]
choiceToPure r = case r of 
  { Choice.choose -> k } -> (handle choiceToPure in k false) ++ (handle choiceToPure in k true)
  { a } -> [a]
```

> This is the first handler we've seen where the call to `handle` is not in tail position - i.e. where the return value of `handle` still needs some further processing (with `++`) before returning.  Recursive calls in tail position can be made any number of times in sequence, while still using constant space (because the function's stack frame can be reused from call to call).  `choiceToPure` does not have this property.  In this case that's probably fine - if you're handling a computation that makes a long sequence of calls to `choose`, you're likely to run into the exponential growth of the `[a]` list before the linear growth of the handler stack troubles you.  (See the [exercises](/docs/ability-tutorial/conclusion#exercises) to try writing a handler that does random sampling instead of accumulating all possible results.)

## The proxy handler pattern

Sometimes, you want to handle an ability without eliminating it - so, passing through the requests, perhaps with some modifications, and perhaps 'teeing off' some information as it goes through.

For example, suppose we want a handler that logs the values that a `Store` computation `put`s.

``` unison
use .base
storeProxyLog : (v -> Text) -> Request (Store v) a ->{Store v, Log} a
storeProxyLog print r = case r of
  { Store.get -> k } -> 
    v = Store.get
    handle storeProxyLog print in k v
  { Store.put v -> k } -> 
    Log.log ("Put: " ++ print v)
    Store.put v
    handle storeProxyLog print in !k
  { a } -> a
```

This `Store` handler is itself using `Store`!  And `Log` too.  

Take a look at the stack of handlers we end up with in `result` below.

``` unison
computation : '{Store} Nat
computation = 'let
                Store.put 42
                Store.get

result : (Nat, [Text])
result = handle logHandler [] in (handle storeHandler 0 in (handle storeProxyLog Nat.toText in !s))

> result

    9  | > result
           ⧩
           (42, ["Put: 42"])

```

So the abilities used by the computation are being transformed step-by-step as follows: `{Store Nat}`, then `{Store Nat, Log}`, then `{Log}`, then `{}`.  

> Note we can't just say `handle storeProxyLog print in k Store.get` in the `get` branch: then the `Store.get` would end up being handled by `storeProxyLog`, instead of passed out to the next `Store` handler.

Note how, if we wanted it to, `storeProxyLog` would be able to *change* the `v` value that `storeHandler` stores on a `put`, and the value that gets given to the computation on a `get`.  

> ⚙️ Interestingly, you can define your own handler for `IO`!  One application for this would be to write a proxy handler to record all the input a program receives from the outside world.  You could then write another handler to replay the information into the program later - which is a pure computation, and so easier for debugging.  (🍭 This would be a great pair of Unison library functions for someone to write! 😀)

__Next:__ [Conclusion and exercises](/docs/ability-tutorial/conclusion)