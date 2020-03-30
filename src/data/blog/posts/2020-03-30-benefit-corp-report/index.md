---
title: Why Unison Computing is a public benefit corporation and our first annual report
description: Unison Computing is a public benefit corp (PBC), cofounded by Paul Chiusano, Rúnar Bjarnason, and Arya Irani. We work alongside other amazing open source contributors on the Unison language. 💜 This post talks about why Unison Computing is a PBC and also includes our first annual report.
date: 2020-03-30
categories: ["announcements"]
slug: benefit-corp-report
featuredImage: /media/thing11.svg
---

Unison Computing is a [public benefit corp](https://en.wikipedia.org/wiki/Public-benefit_corporation) (PBC), cofounded by Paul Chiusano, Rúnar Bjarnason, and Arya Irani. We work alongside other [amazing open source contributors](https://github.com/unisonweb/unison/blob/master/CONTRIBUTORS.markdown) on the Unison language. 💜 This post talks about why Unison Computing is a PBC and also includes our first annual report.

> 📕 If you're new to the Unison language and would like an overview of the project and its core ideas, we recommend this [40 minute Strange Loop talk](https://www.youtube.com/watch?v=gCWtkvDQ2ZI).

Our company's overall mission: advance what's possible with software and work to make software creation simpler and more accessible to all. Underlying this pursuit is a belief that the medium of computation is an important and powerful means of human expression, one capable of both beauty and utility, and that advancing software technology and making it more accessible will be a force for good. We pursue our mission through applied research and development of new, free, open source software technologies like Unison, and by building useful products (like [the Unison Cloud Platform](http://unison.cloud/)) that make money atop these technologies. As a public benefit corp, we view the business side of our work as a means of capitalizing our larger mission.

This post talks about why Unison Computing is a PBC and also includes our first annual report.

## How did we get here?

Way back in 2013, I (Paul Chiusano) quit a cushy full-time job to start research on what would eventually become Unison. Like many other developers, I was unhappy with the tools we had available for building software and thought it was possible to do much better. It felt the software industry was perpetually trying to get to the moon by piling up chairs, and I knew if I didn’t at least try doing something about it I’d become embittered or detached from a field I still really love. To support myself and my family, I did consulting work and used the time between gigs to do research on Unison.

The foundational ideas of Unison—combining functional programming with an append-only codebase—had [many fantastic and surprising implications](https://www.youtube.com/watch?v=gCWtkvDQ2ZI): no builds, easy persistence, robust distributed execution with on-the-fly code deployment, and more. I felt like I was discovering an alternate reality of programming where new things were possible and hard things were easy. I found I wasn't the only person who thought these ideas were exciting: the more I collaborated on Unison with other people, including my friends Arya and Rúnar who later cofounded Unison Computing with me, the more it felt like Unison was tapping into big ideas whose time had come. It also became clear that Unison wasn't going to get far just on unpaid part-time labor. This was a massive project with lots of potential that needed dedicated professionals working on it full-time.

Unison was a mix of engineering, novel applied research, and drawing on existing academic research to assemble a cohesive, practical system. It wasn't clear how to fund it, and I explored a few different options:

- For a while, I ran a Patreon. While I truly appreciated the support, this only ever managed to bring in a few hundred dollars per month.
- I applied for an [SBIR grant](https://www.sbir.gov/), which is a program that certainly talks a lot about bridging the gap between academia and industry. The proposal I spent weeks putting together was unceremoniously rejected. One of the reviewers noted: "This proposed project is totally unrealistic and lacks any sound technology foundation." 😬

I also considered growing a consulting group that worked on Unison part time, or entering academia, but neither of these options seemed like a good fit either. While I worked on Unison I would read regular reports of tech startups building on much worse ideas, but somehow raising millions of dollars. That got me wondering what a business around Unison would look like.

## Funding innovative OSS like Unison by crafting a business around it from the beginning

Companies like Unison Computing that are based around open source software usually form and raise money *after* the core technology has already been incubated elsewhere and reached a critical mass of users. In fact, most investors, even those comfortable with open source businesses, won't even take you seriously until *somehow, miraculously*, there's a wildly popular open source technology for you to commercialize. But this typical approach of waiting for innovative OSS to be *incubated by someone else* has serious limitations:

- Technology that's incubated within a big company tends to be pretty conservative and related only to the immediate needs of the business. So Google funds open-source work on Go and Kubernetes, tech that lets them more efficiently do the things Google is already doing. More generally, big companies that can afford to fund this work often have different ideas about what's pressing and worth solving than the rest of us. Who will build the technology that empowers tiny teams to build "the next Google"?
- If the tech is incubated within academia, it is often is more innovative but undercapitalized. And incentives in academia prevent the necessary level of engineering polish, since the emphasis is more on proving concepts in peer-reviewed publications, rather than releasing a practical piece of technology.
- And if the tech is incubated by individuals working nights and weekends, it's _way_ undercapitalized. This is roughly the position Unison was in before we raised money.

Rather than forming a commercial entity after the technology exists, it's possible to fund the _creation_ of OSS by identifying a business model that fits the technology, raising initial funding from investors on this basis, and eventually supporting continued OSS development with the proceeds of the successful business. This is the idea behind Unison Computing: use the business side of the company to capitalize truly innovative work on better programming technology. 

We adopted the structure of a public benefit corp to make it clear to everyone involved that we have a mission we care about and that we're not just building a soulless profit-maximizing machine. Though we had some concerns that investors might be frightened off by the benefit corp structure, so far it's turned out not to be an issue, and we are now a well-funded startup. One of our investors told us that anyone frightened off by the benefit corp structure is probably not an investor we'd want to have anyway. 😀

There are lots of ways for companies to be financially successful, but we think the best companies (benefit corp or not) are not solely or even primarily about the pursuit of profit—they start with a group of people who commit to pursuing something they think is worthwhile. And when that thing is something the world needs, profit emerges as a byproduct. Apple doesn't make beautiful, delightful and humane technology because that's the best path to profit (though they certainly are profitable). They do it because they think those products ought to exist and that that is how technology should be designed. SpaceX was founded on dreams of humans becoming a spacefaring species, but they've designed a business structure that makes money as they work towards this longer-term goal. This is the sort of thing we designed Unison Computing to be: a carefully designed business that helps capitalize a mission we care about.

Unlike a lot of open source software, where there's a struggle to figure out what the product even is, there's an obvious one for Unison: a cloud computing platform. Since Unison programs can describe whole distributed elastic computations, a managed service that lets you run your Unison programs on "the cloud computer" sounds pretty great. It's hard to build, but it will make cloud computing simple and accessible—something even kids who just learned programming could do, but also something experts can appreciate. It's the product we all wish existed and would have gladly used for systems we've built before.

Moreover, since the cloud market is absolutely enormous and continues to grow, the honest pitch to our investors was simply that we are building radical new technology that will provide "a better way to cloud" and that can turn into a big business as Unison matures and becomes more widely adopted.

Our initial funding was led by Amplify Partners, Project 11 Ventures, Good Growth Capital, and Hyperplane Venture Capital. All of our investors are good people who are supportive of what we're trying to do and we're happy to be working with them. Being a well-funded company means we get to develop Unison and [Unison.Cloud](http://unison.cloud/) full-time, and it also means we can [hire talented people](/jobs).

## How are we doing?

We said our overall mission is to advance what's possible with software, and to make software creation simpler and more accessible to all. The foundational work needed to pursue this mission is to build the open source Unison language, ensuring it is useful enough to become widely adopted.

Over 10,000 hours have been put into open source Unison development since we became a benefit corp, amounting to about 80% of our total developer hours. This is highly unusual: most software businesses (including those built on open source technology!), actually devote a small fraction of their development resources to OSS. We do expect that over time we'll start to shift more of our resources to building out products like [Unison.Cloud](http://unison.cloud/) on top of Unison, but developing and supporting Unison and its open source ecosystem will remain a large portion of what the company devotes resources to.

The outcome of all this effort is that Unison has evolved from a research protoype to a real language that will leave alpha testing and enter general availability this year. Some identifiable technical results:

* We worked out in detail the implications of Unison's _append-only codebase_, where definitions are never modified in-place. This concept, familiar from the world of [purely functional data structures](https://en.wikipedia.org/wiki/Purely_functional_data_structure), yields surprising benefits: no builds, perfect test caching, instant non-breaking renames, elimination of dependency conflicts, trivial persistence, and a simple approach to distributed execution with runtime code deployment. These results are covered in [the Strange Loop talk](https://www.youtube.com/watch?v=gCWtkvDQ2ZI).
* We identified a novel approach to refactoring append-only codebases, where the codebase is never in a broken state, even midway through the refactoring. These results are covered in our [Scale By The Bay talk](https://www.youtube.com/watch?v=IvENPX0MAZ4) and also [this page on the documentation site](/docs/refactoring/).
* We incorporated recent excellent research in programming language theory and type systems (see [our bibliography](https://www.unisonweb.org/docs/bibliography/#programming-language-theory)) into the core Unison language. See for instance our [documentation on abilities](/docs/abilities), a simple-to-use but powerful language feature that subsumes many other more specific language features: exceptions, asynchronous I/O, generators, coroutines, logic programming, and more.

We think the ideas behind Unison are exciting and fascinating, but besides just developing the ideas, we have assembled these ideas into real, usable software.

As we make Unison generally available, we can start to quantify our success in terms of the number of users and the size of the Unison ecosystem, as measured by metrics like the total number of public Unison repositories and the total number of Unison definitions. This is how we'll measure the impact of the technology we build—we want to create technology that actually gets *used*. We will start reporting on these metrics for our next annual report.

Overall, we are happy with the work we've done so far. This year, we're looking forward to seeing what people create with Unison!

## Current status and future plans

We released a public alpha version of Unison in August 2019 and have been incorporating feedback from alpha testers since then (the [docs site](/docs) has information on participating in alpha testing). We'll make Unison generally available this year and then help to build out the Unison open source ecosystem alongside other contributors. Our stretch goal is to release an alpha version of our first cloud product this year.

We also have a few areas we're looking at for the future:

- Create or curate free documentation, tutorials, and educational materials that enable anyone to learn how to build distributed systems starting from first principles. Great learning materials should be available for anyone or any team.
- Create simpler, more accessible *interfaces* to programming in Unison. When you remove the possibility of syntax and type errors from programming (as is done in [Scratch](https://www.media.mit.edu/projects/scratch/overview/) or spreadsheets), the barrier to entry drops dramatically, enabling kids and non-programmers to become productive at building programs. We want that same level of approachability but for a powerful, general purpose language. This was an area of research early on in the development of Unison, but we set it aside to focus more on the core language and tooling. It's still an area we are enthusiastic about and are planning to pick back up later this year or next. It's also an area where other groups have been doing a lot of interesting active research (for instance, [Hazel](https://hazel.org/)).

Thanks so much for reading. If you have questions about this report, feel free to come visit us [on Slack](/slack).

😀 *Paul, Rúnar, Arya*
