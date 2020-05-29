---
slug: heather-miller
title: Summer collaboration with Heather Miller on Unison distributed programming library
description: "Exciting news! Heather Miller, CMU professor and Scala Center founder, who does very cool research at the intersection of programming languages, FP, and distributed systems, will be a Visiting Researcher with us this summer. Like us, Heather is passionate about finding ways to make distributed programming more compositional. We'll be collaborating together on a library for distributed computing in Unison and some interesting demo application using that library."
date: 2020-05-29
authors: ["paul-chiusano"]
categories: ["announcements"]
featuredImage: /media/thing13.svg
---

Exciting news! [Heather Miller](https://heather.miller.am/), [CMU professor](https://isr.scs.cmu.edu/people/core-faculty/miller-heather.html) and [Scala Center founder](https://scala.epfl.ch/), who does very cool research at the intersection of programming languages, FP, and distributed systems, will be a Visiting Researcher with us this summer. She starts next week. Like us, Heather is passionate about finding ways to make distributed programming more *compositional.* We'll be collaborating together on a library for distributed computing in Unison and some interesting demo application using that library.

The focus of this library will be creating fundamental, reusable abstractions that can be used to assemble distributed systems of any size. We'll be using Unison's [abilities system](/docs/abilities) to keep the library high-level and portable: distributed algorithms and data structures can be implemented in terms of abstract abilities which are then handled into more concrete backend implementations. One backend might just do local execution (possibly with simulated faults injected for testing), another might delegate to a static on-premise cluster, and another might delegate to an elastic source of cloud compute.

All the work will be open source and we'll be developing it out in the open and blogging as we go. We'll also be publishing some blog posts covering distributed systems from first principles, so anyone can follow along with the work without needing to be a distributed systems guru who's read every paper in the field going back 30 years.

Heather's position is being jointly funded by [Unison Computing](/2020/03/30/benefit-corp-report/) and the early supporters of Unison on Patreon (when I closed down my Patreon for Unison, I wanted to put the funds toward open source Unison work, but wasn't sure how best to do that until now). This Visiting Researcher role is something we'll start doing regularly.

Stay tuned for more updates on this. And welcome, Heather! 👋💜

