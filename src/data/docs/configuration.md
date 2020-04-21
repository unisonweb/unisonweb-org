---
title: Configuring the Unison Codebase Manager
description: This document details how to create a .unisonConfig file to store Unison Codebase Manager (UCM) configuration, as well as what UCM looks for in that file.
---

# Configuring the Unison Codebase Manager

This document details how to create a `.unisonConfig` file to store Unison Codebase Manager (UCM) configuration, as well as what UCM looks for in that file.

## Where does Unison look for configuration?

When starting up, the Codebase Manager looks for a file named `.unisonConfig` in the same directory as your codebase. For example, if your codebase lives at `~/.unison` (which is the default codebase location), UCM will expect the configuration file to be `~/.unisonConfig`.

UCM loads the configuration on startup, but also watches the file for changes. If you edit the file and save it, UCM will reload the `.unisonConfig` file and continue with the new configuration.

## What is the configuration file format?

The `.unisonConfig` file uses the [`Data.Configurator` file format](http://hackage.haskell.org/package/configurator-0.3.0.0/docs/Data-Configurator.html). This is a temporary solution, and it's highly likely that the format will change in a future version of Unison.

What follows is an example configuration file. Note that this is just an example and the values shown here will not actually work. Substitute your own values.

    GitUrl {
      base = "git@github.com:unisonweb/base.git"
      org {
        example { 
          mylibrary = "git@github.com:me/mylibrary.git"
        }
      }
    }
    
    DefaultMetadata = [".base.metadata.authors.unisoncomputing"]
    
    DefaultMetadata {
      org { 
        example {
          mylibrary = [".base.metadata.licenses.unisoncomputing2020"]
        }
      }
    }

## Configuring a default push/pull URL for a namespace

When working on a project in Unison, you'll often want to `push` your work to a shared Git repository and `pull` code from the repository into your codebase. To do so, you can use UCM's `[push` and `pull` commands](https://www.unisonweb.org/docs/commands#pull). These commands take a [Git URL](https://www.unisonweb.org/docs/commands#git-urls) and will push to and pull from Git, respectively. Since the URL you'll want to push to or pull from generally remains constant for a given Unison namespace, the `.unisonConfig` file allows you to set a `GitUrl` per namespace.

For example, if you have Unison's base libraries at the `.base` namespace, you could pull the latest updates to those libraries from the UCM prompt:

```ucm
.> cd base

.base> pull git@github.com:unisonweb/base.git
```

To avoid having to type or paste the URL every time, you could instead add the following to your `.unisonConfig`:

    GitUrl {
      base = "git@github.com:unisonweb/base.git"
    }

Then you can simply issue a `pull` from UCM while sitting in the `base` namespace:

```ucm
.base> pull
```    

Note that if your namespace has more than one segment, you will need to nest configuration groups. For example, if your namespace is `foo.bar`, you'll need something like this:

    GitUrl {
      foo {
        bar = "git@github.com:foo/bar.git"
      }
    }

## Setting default metadata like License and Author

UCM allows you to [link](https://www.unisonweb.org/docs/commands#link) metadata to Unison definitions. These metadata are things like [documentation](https://www.unisonweb.org/docs/documentation), authors, as well as license and copyright information.

Usually you'll want to link yourself as the author of any code you write, and if you intend to publish that code for others to use, you'll want to specify a license laying out the conditions under which others may use your code.

Here's an example of how to do that:

First, issue `create.author` in UCM to create an Author object representing yourself:

```ucm
.> create.author aliceCoder "Alice Coder"
```

This adds the following values to your codebase:

    1. metadata.authors.aliceCoder          : base.Author
    2. metadata.authors.aliceCoder.guid     : GUID
    3. metadata.copyrightHolders.aliceCoder : CopyrightHolder

Then, create a license under which to publish your code. The license is an ordinary Unison value of type `.base.License`:

```unison
metadata.licenses.aliceCoder2020 =
  License [Year 2020] .base.metadata.licenseTypes.bsd3 
```

Add that to your codebase:

```ucm
.> add
```

Now add the following to your `.unisonConfig` file to make those values the default for any code you write:

    DefaultMetadata = [".metadata.authors.aliceCoder", ".metadata.licenses.aliceCoder2020"]

With this configuration, UCM will link these two values in to any Unison definitions you add to your codebase.

You might want to license different projects differently. In that case you should create a configuration value for your namespace under the `DefaultMetadata` configuration group, and not have a global license:

    DefaultMetadata = [".metadata.authors.aliceCoder"]
    
    DefaultMetadata {
      org { 
        example {
          mylibrary = [".metadata.licenses.aliceCoder2020"]
        }
      }
    }

With this configuration, UCM will link the `aliceCoder2020` license to any definitions you add to the `org.example.mylibrary` namespace and any subnamespaces.
