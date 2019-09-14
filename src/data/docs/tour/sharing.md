---
title: Publishing code and installing Unison libraries
description: placeholder
---

# Publishing code and installing Unison libraries

Unison code is published just by virtue of it being pushed to github; there's no separate publication step.

## Publishing your code

You might choose to make a copy of your namespace, similar to how you might tag a release in Git. Let's go ahead and do this:

```
---
title: ucm
show-carets: true
---
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

Now let's publish our `mylibrary` to a fresh Unison repo. First, create an empty Git repository on GitHub or wherever you prefer to host your Git repositories.

After you've created this empty repo, you can then push to it, using `push <giturl>` (to push the current namespace) or `push <giturl> .mystuff` (to push the `.mystuff` namespace):

```
---
title: ucm
show-numbers: false
---
.mylibrary.releases.v1> cd .
.> push git@github.com:<yourgithubuser>/myunisonrepo.git
```

You'll see some git logging output. Your code is now live on the internet!

## Installing libraries written by others

This section is under construction.

From the root, do:

```
---
title: ucm
show-numbers: false
---
.> pull git@github.com:<github-username>/myunisonrepo.git .myfirstlibrary
```

The namespace you created is now available under `.myfirstlibrary`. Try `cd .myfirstlibrary` after the pull to look around.

## What next?

* [The core language reference](/docs/language-reference) describes Unison's core language and current syntax in more detail.
* TODO: writing a more interesting library
