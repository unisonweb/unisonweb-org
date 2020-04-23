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

What follows is an example configuration file. We'll explain the details of what this means below. Note that this is just an example and the values shown here will not actually work. (Though your file's basic structure will look similar to this if you are following the [recommendations on how to organize your Unison namespace](/docs/codebase-organization).)

```ini
# I version my full namespace tree here, it's a snapshot
# of all my current workstreams. If I need to switch 
# computers, I might just push here, then pull on the
# other computer. 
# `.> push` will go here.
GitUrl = "git@github.com:myuser/allmycode"

GitUrl = {
  
  # Some projects I occasionally make PRs against.
  # Example: from UCM, `._base> pull` will get latest trunk

  _base = "git@github.com:unisonweb/base:.trunk"
  _distributed = ns2 = "git@github.com:unisonweb/distributed:.trunk"

  # I help maintain these projects, so I track the full tree.
  # This makes it easy to create, review and merge pull requests.
  # Example: from UCM, `._json> pull` will get latest full dev tree
  
  _json = "git@github.com:myuser/json.git"  # '.git' is optional!
  _httpclient = "git@github.com:myorg/unison-httpclient"
  _project1 = "git@github.com:myorg/coolproject"

  # This is just a "pastebin" project I sometimes use for
  # quickly sharing code. I don't keep it organized at all!
  # Example: from UCM, `.scratch> push` will push here

  scratch = "git@github.com:myuser/unison-gists"

  # Bogus example showing default GitUrl for a nested namespace

  ns3 {
    example { 
      foo = "git@github.com:someorganization/thing"
    }
  }
}

# Attach myself as author and use BSD license.
DefaultMetadata = [ "._project1._trunk.metadata.authors.myself"
                  , "._project1._trunk.metadata.licenses.myself_bsd3_2020" ]

# If I needed to pick a different license for a sub-namespace
# I'd remove license from the root and add a license here instead
# DefaultMetadata {
#  _project1 = ["._project1._trunk.metadata.licenses.myself_bsd3_2020"]
#  org { 
#    example {
#      foo = ["._project1._trunk.metadata.licenses.myself_apache2_2020"]
#    }
#  }
}
```

Your file will look similar to this if you are following the [recommendations on how to organize your Unison namespace](/docs/codebase-organization).

## Configuring a default push/pull URL for a namespace

When working on a project in Unison, you'll often want to `push` your work to a shared Git repository and `pull` code from the repository into your codebase. To do so, you can use UCM's [`push` and `pull` commands](https://www.unisonweb.org/docs/commands#pull). These commands take a [Git URL](https://www.unisonweb.org/docs/commands#git-urls) and will push to and pull from Git, respectively. Since the URL you'll want to push to or pull from generally remains constant for a given Unison namespace, the `.unisonConfig` file allows you to set a `GitUrl` per namespace.

For example, while you can always supply an explicit argument to `pull`, like so:

```ucm
._project1> pull git@github.com:myorg/coolproject
```

... to avoid having to type or paste the URL every time, you could instead add the following to your `.unisonConfig`:

    GitUrl {
      _project1 = "git@github.com:myorg/coolproject"
    }

Then you can simply issue a `pull` from UCM while sitting in the `_project1` namespace:

```ucm
._project1> pull
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

To do this, first issue `create.author` in UCM to create an Author object representing yourself:

```ucm
._project1> create.author aliceCoder "Alice Coder"
```

This adds the following values to your codebase:

    1. metadata.authors.aliceCoder          : base.Author
    2. metadata.authors.aliceCoder.guid     : GUID
    3. metadata.copyrightHolders.aliceCoder : CopyrightHolder

Then, create a license under which to publish your code. The license is an ordinary Unison value of type `.base.License`:

```unison
metadata.licenses.aliceCoder2020 =
  License [Year 2020] licenseTypes.bsd3 
```

Add that to your codebase:

```ucm
._project1> add
```

(Though not strictly necessary, you can also alias these values to other projects where you are contributing, just using the `alias.term` or `copy` command.)

Now add the following to your `.unisonConfig` file to make those values the default for any code you write:

    DefaultMetadata = [ "._project1.metadata.authors.aliceCoder", 
                      , "._project1.metadata.licenses.aliceCoder2020" ]

With this configuration, UCM will link these two values in to any Unison definitions you add to your codebase. 

You might want to license different projects differently. In that case you should create a configuration value for your author under the `DefaultMetadata` configuration group, but rather than having a global license, just have a license per project:

    DefaultMetadata = ["._project1.metadata.authors.aliceCoder"]
    
    DefaultMetadata {
      _project1 = ["._project1._trunk.metadata.licenses.aliceCoder_bsd3_2020"]
      _httpclient = ["._project1._trunk.metadata.licenses.aliceCoder_bsd3_2020"]
      org {
        example {
         foo = ["._project1._trunk.metadata.licenses.aliceCoder_apache2_2020"]
        }
      }
    }

With this configuration, UCM will link the `aliceCoder_apache2_2020` license to any definitions you add to the `org.example.mylibrary` namespace and any subnamespaces and will use `aliceCoder_bsd3_2020` when in `_project1` or `_httpclient` namespaces.