---
title: Testing your code
description: How to write tests in Unison
---

# Testing your Unison code

Writing unit tests is easy in Unison. You add your tests as [special watch expressions in your scratch file](/docs/tour#unisons-interactive-scratch-files), then add them to the codebase using the [`add` or `update`](/docs/commands#add) commands, then use the [`test` command](/docs/commands#test) to run the tests.

Note that unit tests can't access any [abilities](/docs/abilities) that would cause the test to give different results each time it's run. This means Unison can cache test results, which is completely safe to do. When you issue the [`test` command](/docs/commands#test) any tests that have been run before will simply report the cached results.

## Basic unit tests

Okay, let's get started! Here's a simple test:

```unison
square : Nat -> Nat
square x = x * x

test> square.tests.ex1 = check (square 4 == 16)
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      square           : Nat -> Nat
      square.tests.ex1 : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    4 | test> square.tests.ex1 = check (square 4 == 16)

    ✅ Passed : Proved.

```
The `test>` line is called a "test watch expression". Like other watch expressions in your [scratch file](/doocs/tour#unisons-interactive-scratch-files), it will get evaluated (or looked up in the evaluation cache) on every file save. By convention, tests for a definition called `square` are placed in the `square.tests` namespace.

> 🤓 The `check` function has type `Boolean -> [Test.Result]`. Any test watch expression must have the type `[Test.Result]`. Though we won't use this capability much, it's possible to have a single test produce multiple results, hence the `[Test.Result]` rather than `Test.Result`. If you decide to write a different testing library, you just have to be able to produce a `[Test.Result]` in the end.

By the way, you can write test watch expressions that span multiple lines. For instance, here's a test for `List.reverse`:

```unison
test> List.reverse.tests.ex1 = check let
  actual = reverse [1,2,3,4]
  expected = [4,3,2,1]
  expected == actual
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      List.reverse.tests.ex1 : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | test> List.reverse.tests.ex1 = check let

    ✅ Passed : Proved.

```
> 📕 As [discussed in the language reference](/docs/language-reference#syntactic-precedence), keyword-based constructs like `let` bind tighter than function application, so you don't need any parentheses around the `let` block which is used as the argument to `check`.

## Adding diagnostics for a failing test

When you have a test that's failing, like this one below, you often want to print out some information before it fails:

```unison
brokenReverse : [a] -> [a]
brokenReverse as = []

test> brokenReverse.tests.ex1 = check let
  actual = brokenReverse [1,2,3,4]
  expected = [4,3,2,1]
  expected == actual
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      brokenReverse           : [a] -> [a]
      brokenReverse.tests.ex1 : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    4 | test> brokenReverse.tests.ex1 = check let

    🚫 FAILED

```
Notice we don't get any information about why it failed. Let's go ahead and fix that, by temporarily inserting a call to the function `bug : a -> x`, which halts your program with an exception and prints out its argument, nicely formatted onto multiple lines if needed:

```unison
brokenReverse : [a] -> [a]
brokenReverse as = []

test> brokenReverse.tests.ex1 = check let
  actual = brokenReverse [1,2,3,4]
  expected = [4,3,2,1]
  if not (expected == actual) then
    bug ("Not equal!", expected, actual)
  else
    true
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      brokenReverse           : [a] -> [a]
      brokenReverse.tests.ex1 : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

  💔💥

  I've encountered a call to builtin.bug with the following
  value:

    ("Not equal!", [4, 3, 2, 1], [])

  I'm sorry this message doesn't have more detail about the
  location of the failure. My makers plan to fix this in a
  future release. 😢

```
Here we're passing a tuple to the `bug` function, but we could pass it any value at all.

### Adding tests to the codebase

Once you're happy with your tests, you can add them to the codebase and use the `test` command to see the test results in the current namespace (you can see test results for larger or smaller scopes just by moving around with [the `cd` command](/docs/commands#cd):

```unison
square : Nat -> Nat
square x = x * x

test> square.tests.ex1 = check (square 4 == 16)

test> List.reverse.tests.ex1 = check let
  actual = reverse [1,2,3,4]
  expected = [4,3,2,1]
  expected == actual
```

```ucm
  ☝️  The namespace .mystuff is empty.

.mystuff> add

  ⍟ I've added these definitions:

    List.reverse.tests.ex1 : [Result]
    square                 : Nat -> Nat
    square.tests.ex1       : [Result]

.mystuff> test

  Cached test results (`help testcache` to learn more)

  ◉ List.reverse.tests.ex1    : Proved.
  ◉ square.tests.ex1          : Proved.

  ✅ 2 test(s) passing

  Tip: Use view List.reverse.tests.ex1 to view the source of a
       test.

```
But actually, it didn't need to run anything! All the tests had been run previously and cached according to their Unison hash. In a purely functional language like Unison, tests like these are deterministic and can be cached and never run again. No more running the same tests over and over again!

## Generating test cases with code

Unison's [base library](https://github.com/unisonweb/base) contains powerful utility functions for generating test cases with Unison code, which lets your tests cover a lot more cases than if you are writing test cases manually like we've done so far. (This style of testing is often called _property-based testing_.)

The property-based testing support in Unison relies on [an ability](/docs/abilities) called `Gen` (short for "generator"). If you haven't read about [abilities](/docs/abilities) yet, we suggest taking a detour to do so before continuing.

For instance, a `'{Gen} Nat` is a computation that, when run, produces `Nat` values. You can sample from a `'{Gen} a` multiple times to produce different values. Importantly, these are _not random_ values. The sequence of values generated is entirely deterministic:

```unison
> sample 100 (natIn 0 10)

test> myTest = runs 100 '(expect (!(natIn 0 10) < 10))
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      myTest : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | > sample 100 (natIn 0 10)
          ⧩
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    3 | test> myTest = runs 100 '(expect (!(natIn 0 10) < 10))

    ✅ Passed : Passed 10 tests.

```
When developing generators to use for testing, you'll often put those generators in a watch expression like this to make sure you understand what they are generating. Generators denote a set of values, and as the above shows, it is possible to exhaustively enumerate that set, at which point `sample` will stop short. Above we asked it to generate 100 natural numbers in the range 0 to 10, but there's only 10 unique values, so it stops after that.

### Combining generators

Where things get interesting is when _combining_ generators. There are a few ways of doing that. For a `'{Gen} a`, you can use the `!` operator to sample from it, and you can sample from multiple generators to build up a more complex generator. Let's have a look at an interesting example, which highlights something important about these generators:

```unison
> sample 10 'let
  n = !(natIn 0 10) + 100
  m = !(natIn 0 100)
  (n, m)
```

```ucm

  ✅

  scratch.u changed.

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | > sample 10 'let
          ⧩
          [ (100, 0),
            (100, 1),
            (101, 0),
            (100, 2),
            (101, 1),
            (102, 0),
            (100, 3),
            (101, 2),
            (102, 1),
            (103, 0) ]

```
> 🤓 __Syntax note:__ The `'let` is a common idiom to introduce a delayed computation which is a block. The precedence is such that `sample 10 'let ...` is parsed like `sample 10 ('let ...)`.

As we can see, `Gen` does _fair_ or _breadth first_ sampling from both of the generators involved, rather than exhausting one before moving on to the next. (In this sense, it differs from the usual [`Choose` ability](/docs/abilities/#choose-for-expressing-nondeterminism) for nondeterminism which does depth-first enumeration.)

Doing a breadth-first enumeration is the right move because as we build up more complex generators, where the space of possibilities is often so huge that it's only possible to sample a tiny fraction of it.

There are two other ways of combining generators. One is `pick`, which fairly samples from multiple generators in a breadth first manner:

```unison
pick : ['{Gen} a] -> '{Gen} a

```

Here's an example:

```unison
> sample 10 <| pick [natIn 0 10, natIn 100 200]
```

```ucm

  ✅

  scratch.u changed.

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | > sample 10 <| pick [natIn 0 10, natIn 100 200]
          ⧩
          [0, 100, 1, 101, 2, 102, 3, 103, 4, 104]

```
The other is `cost : Nat -> '{Gen} a -> '{Gen} a`, which assigns a "cost" to a generator. What does that mean? When a branch of `pick` has a cost of `5` for instance, the sampling process will take 5 samples from all _other_ branches before switching to fairly sampling from both branches:

```unison
> sample 10 <| pick [cost 5 (natIn 0 10), natIn 100 200]
```

```ucm

  ✅

  scratch.u changed.

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | > sample 10 <| pick [cost 5 (natIn 0 10), natIn 100 200]
          ⧩
          [100, 101, 102, 103, 104, 0, 105, 1, 106, 2]

```
You may want to do some experimentation to get a feel for how `Gen` behaves. You can use the `cost` to control which branches of the space of possibilities get explored first--a common use case will be to assign higher costs to "large" test cases that you wish to test less frequently.

### Using generators to write property based tests

Once you've got your generators in good shape, you can combine these into property-based tests that verify some property for _all_ generated test cases. For example, let's check that reversing a list twice gives back the original list:

```unison
test> List.reverse.tests.prop1 = runs 100 'let
  original = !(listOf (natIn 0 100))
  original' = List.reverse (List.reverse original)
  expect (original == original')

> sample 10 (listOf (natIn 0 100))
```

```ucm

  I found and typechecked these definitions in scratch.u. If you
  do an `add` or `update`, here's how your codebase would
  change:

    ⍟ These new definitions are ok to `add`:

      List.reverse.tests.prop1 : [Result]

  Now evaluating any watch expressions (lines starting with
  `>`)... Ctrl+C cancels.

    1 | test> List.reverse.tests.prop1 = runs 100 'let

    ✅ Passed : Passed 100 tests.

    6 | > sample 10 (listOf (natIn 0 100))
          ⧩
          [ [],
            [0],
            [1],
            [0, 0],
            [2],
            [0, 1],
            [1, 0],
            [0, 0, 0],
            [3],
            [0, 2] ]

```
Don't forget, if you encounter failures, you can use `bug` to view intermediate generated values that trigger the failure.

Because the test results are always deterministic and cached, you may want to crank up the number of samples taken before choosing to `add` your tests to the codebase.

```ucm
.mystuff> add

  ⍟ I've added these definitions:

    List.reverse.tests.prop1 : [Result]

.mystuff> test

  Cached test results (`help testcache` to learn more)

  ◉ List.reverse.tests.prop1    : Passed 100 tests.
  ◉ List.reverse.tests.ex1      : Proved.
  ◉ square.tests.ex1            : Proved.

  ✅ 3 test(s) passing

  Tip: Use view List.reverse.tests.prop1 to view the source of a
       test.

```
Notice that all the test results are cached. If you later `update` the definitions being tested (like `List.reverse` in this example), the tests won't be found in the cache and will get re-run when you type the `test` command.

### Other useful functions when writing property-based tests

The function `runs` that we've been using has type `Nat -> '{Gen} Test -> [Test.Result]`. To form a value of type `Test`, you can use the functions `expect` (which we've seen) as well as `ok`, `fail`, and others which we can locate using [type-based search](/docs/tour#-to-the-unison-codebase-manager):

```ucm
.base> find : Test

  1.  test.internals.Test.passed : Test
  2.  test.ok : Test
  3.  test.internals.Test.passedUnexpectedly : Test
  4.  test.unexpected.ok : Test
  5.  test.internals.Test.provedUnexpectedly : Test
  6.  test.unexpected.proven : Test
  7.  test.internals.Test.failed : Test
  8.  test.fail : Test
  9.  test.internals.Test.proved : Test
  10. test.prove : Test


```
These functions are used to give different messages on success or failure. Feel free to try them out in your tests, and you may want to explore other functions in the testing package.

Lastly, the [base library is open for contributions](https://github.com/unisonweb/base/blob/master/CONTRIBUTING.md) if you come up with some handy testing utility functions, or want to contribute better documentation (or tests) for existing definitions.

Thanks for reading!
