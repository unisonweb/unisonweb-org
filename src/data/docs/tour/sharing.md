---
title: Publishing code and installing Unison libraries
description: placeholder
---

Unison code is published just by virtue of it being pushed to github; there's no separate publication step. You might choose to make a copy of your namespace. Let's go ahead and do this:

```
.mylibrary> cd .
.> copy.namespace mylibrary mylibrary.releases.v1

  Done.

.> cd mylibrary.releases.v1
.mylibrary.releases.v1> find

  1.  tests.square.ex1 : [.base.Test.Result]
  2.  tests.square.prop1 : [.base.Test.Result]
  3.  square : .base.Nat -> .base.Nat
```

But this is just a naming convention, there's nothing magic happening here.

Now let's publish our `mylibrary` to a fresh Unison repo. First, fork the Unison base library, using the button below (you'll need a GitHub account to do this). This creates a valid minimal Unison codebase repo that you can push to:

<iframe src="https://ghbtns.com/github-btn.html?user=unisonweb&repo=unisonbase&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="158px" height="30px"></iframe>
<br/>

> ☝️ There's nothing special about using GitHub here; you can also host your Unison git repos elsewhere. Just use whatever git URL you'd use on your git hosting provider for a `git push`.

After you've forked the base repo, feel free to rename it to anything you like, or keep the name `unisonbase`. You can then push to it:

**Unison**
```
.mylibrary.releases.v1> cd .
.> push git@github.com:<yourgithubuser>/unisonbase.git
```

You'll see some git logging output. Your code is now live on the internet!

### Installing libraries written by others

This section is under construction.

From the root, do:

```unison
---
title:output
---
.> pull git@github.com:<github-username>/unisonbase.git temp
.> move.namespace temp.myfirstlibrary.releases.v1 myfirstlibrary
.> delete.namespace temp
```

The namespace you created is now available under `.myfirstlibrary`, so `.myfirstlibrary.square` will resolve to the function you wrote.

## What next?

* [The core language reference](/docs/language-reference) describes Unison's core language and current syntax in more detail.
* TODO: writing a more interesting library
