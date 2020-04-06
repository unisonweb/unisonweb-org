---
title: Set up your text editor for Unison development
description: Set up your text editor for Unison development
---

# Set up your editor for Unison

This document is a collection of user-submitted instructions for setting up a text editor for Unison development. This document is [on github][githublink] and contributions are welcome!

[githublink]: https://github.com/unisonweb/unisonweb-org/blob/master/src/data/docs/editor-setup.md
[vimplug]: https://github.com/junegunn/vim-plug

## Vim

Using [vim-plug][vimplug]:

1. Install [vim-plug][vimplug] if you haven't already.
2. Add the following to your .vimrc:

        Plug 'unisonweb/unison', { 'rtp': 'editor-support/vim' }

3. Issue the vim command `:PlugInstall`.

## Atom

From the console, run:

``` bash
apm install unisonweb/atom-unison
```

## VS Code

1. Bring up the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of VS Code, or with ⇧⌘X.
2. Search for "unison"
3. Select "Unison Syntax Highlighting" and click "Install".
