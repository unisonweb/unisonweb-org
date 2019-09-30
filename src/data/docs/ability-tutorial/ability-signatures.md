---
title: More on abilities in type signatures
description: placeholder
---

# More on abilities in type signatures

## Pure functions vs inferred abilities

You can use an empty ability list to declare a pure function - that is, one that doesn't require any abilities.  For example:

``` unison
inverse : Matrix ->{} Matrix
```

The typechecker then enforces that `inverse` does not require any abilities.  

👉 Telling Unison a signature `A ->{} B` is different from telling it `A -> B`.

The former is how you input the type of a pure function.  When you write the latter, you're asking for the ability list to be inferred by the Unison type-checker.  

👉 On code that you write, the signature `A -> B` doesn't mean 'no abilities', but rather that Unison will determine the ability list itself.  

This is an important distinction, and easy to forget, because the signature `A -> B` doesn't contain any visual cues to think about abilities.  

We'll learn more about the ability inference mechanism shortly, in [ability inference and generalization](#ability-inference-and-generalization).

## Ability lists can appear before each function argument

So far we've seen functions whose types include one ability list, like so:

``` unison
orderServer : ServerConfig ->{IO} ()
```
But the following is also possible:

``` unison
orderServer' : ServerConfig ->{Log} '{IO} ()
```

> 🐘 This type signature is equivalent to `ServerConfig ->{Log} () ->{IO} ()`.

`orderserver'` is a function which, when partially applied to its first (`ServerConfig`) argument, can produce log messages, before finally yielding a function of type `'{IO} ()`.  That second function can then be forced, i.e. applied to `()`, to actually carry out some `IO`.  

The first application requires (only) the `Log` ability, and the second requires (only) the `IO` ability.  This is a useful distinction.  In this case, it tells us we can set up an order server, involving inspecting some configuration, in a computation that does some logging but is otherwise pure.  Only the second stage might do unrestricted `IO`.  

See [Defining functions with different ability lists on different arguments](#Defining-functions-with-different-ability-lists-on-different-arguments) for how to _define_ a function like `orderServer'`.

It's useful to keep the following in mind when reading type signatures.  

👉 Every `->` and `'` has an ability list `{…}` logically attached to it, describing the abilities required for applying the function to the preceding argument.  

'Logically', because as we've seen, the `{…}` can be left unspecified when writing code, to ask Unison to infer what it should say.  This process is described in the next section.  

## Ability inference and generalization

Unison can do two levels of type inference for you.  The first is to infer the complete signature of your definition.

``` unison
retries = 3
-- inferred type: .base.Nat
```

The second is to infer ability lists, wherever you have left them unspecified.  

``` unison
use .base

incrementP : Nat -> Nat
incrementP x = io.printLine "incrementP"
               x + 1
-- inferred type: Nat ->{io.IO} Nat               
```

Unison can see, from the use of `io.printLine`, that `incrementP` requires the `IO` ability.  

🚧 It's arguably surprising that Unison may infer a concrete ability for a function for which you provided a `Nat -> Nat` signature.  In future Unison will emit a message to say that it's done this.  ([#717](https://github.com/unisonweb/unison/issues/717))

When you do `add incrementP`, Unison will report the actual inferred type, `Nat ->{io.IO} Nat`.

So what does a plain `->` or `'` mean, when you see it after doing an `add`?  In this context it *does* mean a pure function - it's equivalent to `->{}` or `'{}`.

👉 When you *give* Unison a plain `->` or `'` (with no `{…}`) you're asking it to infer some abilities.  When Unison gives *you* a plain `->` or `'`, it means `->{}` or `'{}`.

So in particular, this means that 
- if you type `->{}`, Unison can render it back to you as just `->`
- if you want Unison to enforce that the function you are writing is pure, then specify a signature for it that uses a `->{}` or a `'{}`.

🚧 This dual meaning of a plan `->` arrow ('infer' or 'pure' depending on context) is a bit confusing.  The pure case may get its own style of arrow notation in future, to address this - Unison issue [#738](https://github.com/unisonweb/unison/issues/738).

> 🐞 Note, Unison can currently sometimes fail to output its inferred abilities when you do `view` or `edit` (although it does correctly output them at the `ucm` command line when you typecheck your code or do `add`/`update`.)  This is due to Unison issue [#703](https://github.com/unisonweb/unison/issues/703).  However, it will re-run its inference again when you next add the code.

### Higher-order functions and ability polymorphism

Here's how Unison infers the type of `.base.List.map`, a higher-order function:

``` unison
base.List.map : (a -> b) -> [a] -> [b]
-- inferred type: (a ->{𝕖} b) -> [a] ->{𝕖} [b]
```

It's added ability lists including a type variable, `𝕖`, in a process called **ability generalization**.  This is saying that, whatever the required abilities of the input function, the overall invocation of `map` will have the same requirements.

So for example, `'(base.List.map base.io.printLine ["Hello", "world!"])` has type `'{IO} [()]` - it requires `IO`, because it calls `printLine` which requires `IO`.  

We say that `base.List.map` is **ability polymorphic**: even though the function itself is in a sense pure, it can be used in a side-effecting way, depending on the ability requirements of its argument.  

The generalization process can work in tandem with inferring concrete abilities - for example:

``` unison
applyP f x = .base.io.printLine "applyP"
             f x
-- inferred type: (i ->{𝕖, .base.io.IO} o) -> i ->{𝕖, .base.io.IO} o
```

This is saying that `applyP` requires `IO`, combined with whatever other abilities (`𝕖`) are required by its first argument.  (The combination process is a set union, so if `𝕖` also includes `IO`, then `IO` still only appears once in the resulting type.)

## Abilities are only relevant in computation signatures

Not all type signatures are sensitive to abilities.  For example:

``` unison
use .base

nowIfPast : Nat ->{SystemTime} Nat
nowIfPast t = now : Nat
              now = SystemTime.systemTime
              if t < now then now else t
```

The outer signature, on the top-level binding for `nowIfPast`, is what we'd expect.  But the signature on the inner binding for `now` is surprising.  Why doesn't it have to be something like `'{SystemTime} Nat`?  After all, the definition of `now` uses the `SystemTime` ability.  

The answer is that functions and lambdas define _computations_, and it is computations that can involve abilities.  The body of `now` involves a computation, but that computation is happening in the context of the outer function binding (which is where the `SystemTime` ability is mentioned).  The type signature on `now` is just talking about the _value_ that results from the computation - a plain `Nat`.

So, the signatures where abilities are relevant are just those for functions and lambdas.  Let's see what that looks like.

``` unison
-- doesn't compile
nowIfPast' : [Nat] ->{SystemTime} [Nat]
nowIfPast' ts = f : Nat ->{} Nat
                f = t -> if t < SystemTime.systemTime then SystemTime.systemTime else t
                List.map f ts
-- also note that we're checking the system clock up to (2 * List.size ts) times in this example!
```  

In `nowIfPast'`, we've defined an inner lambda, `f`.  But we've made a mistake: the computation inside `f` involves the `SystemTime` ability, but `f`'s signature claims that `f` is pure (the empty braces `{}`).  Unison only accepts this function once we've removed the `{}` (to get ability inference) or replaced it with `{SystemTime}`.  

👉 Note that it's the _innermost enclosing lambda_ that specifies the available abilities.

So just because the signature on the top-level binding for `nowIfPast'`mentions `SystemTime`, that's not enough for Unison to accept `f`.

## Ability subtyping

There's one last gotcha to be aware of when interpreting abilities in signatures.  Let's take a look at a better (if still slightly verbose) version of `nowIfPast'`.

``` unison
nowIfPast'' : [Nat] ->{SystemTime} [Nat]
nowIfPast'' ts = now : Nat
                 now = SystemTime.systemTime
                 f : Nat ->{} Nat
                 f = t -> if t < now then now else t
                 List.map f ts
-- this time we check the system clock exactly once - much better! (unless `ts` was empty...)
```

`f` is now pure, which is nice - even though it's captured the value `now` which was produced in an effectful computation.  

The gotcha is that Unison will accept other signatures for `now` and `f` than those given above.
- For `f`, for example, it will accept `f : Nat ->{SystemTime} Nat`, saying that `f` is _allowed_ to use `SystemTime` even though it doesn't.  
- For `now`, it will accept `now : {SystemTime} Nat`, since (in the underlying type theory) `{SystemTime} Nat` is a subtype of `Nat`.  (🐞 This unhelpful permissiveness is Unison issue [#665](https://github.com/unisonweb/unison/issues/665).)

## Defining functions with different ability lists on different arguments

In an [earlier section][#Ability-lists-can-appear-before-each-function-argument], we saw the following function signature:

``` unison
orderServer' : ServerConfig ->{Log} '{.base.IO} ()
```
This sort of signature can be useful, to control exactly _when_ different effects take place.  

But we didn't see how to define such a function!  Here's a first, unsuccessful attempt.

``` unison
use .base.IO

-- doesn't compile
orderServer' : ServerConfig ->{Log} '{IO} ()
-- remember this signature is equivalent to ServerConfig ->{Log} () -> {IO} ()
orderServer' sc unit = 
  log (ServerConfig.toText sc)
  startServer sc
  -- so this supposes we have a function startServer : ServerConfig ->{IO} ()
```

The problem with this is that by the time we've given `orderServer'` that `unit` argument, we've got on to the second arrow - the one that only allows us the `IO` ability.  So we can't use `log` in the function definition.  (If Unison allowed this, then partially applying `orderServer'` would yield a function of type `'{IO} ()` that uses the `Log` ability.)

🐞 Umm, actually at the moment the above does compile, wrongly ☹️  This is due to Unison issue [#745](https://github.com/unisonweb/unison/issues/745).

To define this function, we need to process one argument at a time, and at each stage only use the abilities that argument's arrow (the one on its right) gives us.  Here's a correct definition:

``` unison
orderServer'' : ServerConfig ->{Log} '{IO} ()
orderServer'' sc = 
  log (ServerConfig.toText sc)
  '(startServer sc)
```

Note how we're just consuming the first argument, doing some logging, and then returning a lambda of type `'{IO} ()`.  

__Next:__ [Invoking handlers](/docs/ability-tutorial/invoking-handlers)