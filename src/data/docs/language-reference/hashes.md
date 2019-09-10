---
title: Unison hashes
description: placeholder
---

# Hashes
A _hash_ in Unison is a 512-bit SHA3 digest of a term or a type's internal structure, excluding all names. The textual representation of a hash is its [base32Hex](https://github.com/multiformats/multibase#multibase-table-v100-rc-semver) Unicode encoding.

Unison attributes a hash to every term and type declaration, and the hash may be used to unambiguously refer to that term or type in all contexts. As far as Unison is concerned, the hash of a term or type is its _true name_.

## Literal hash references

A term, type, data constructor, or ability constructor may be unambiguously referenced by hash. Literal hash references have the following structure:

* A _term definition_ has a hash of the form `#x` where `x` is the base32Hex encoding of the hash of the term. For example `#a0v829`.
* A term or type definition that’s part of a _cycle of mutually recursive definitions_ hashes to the form `#x.n` where `x` is the hash of the cycle and `n` is the term or type’s index in its cycle. A cycle has a canonical order determined by sorting all the members of the cycle by their individual hashes (with the cycle removed).
* A data constructor hashes to the form `#x#c` where `x` is the hash of the data type definition and `c` is the index of that data constructor in the type definition.
* A data constructor in a cyclic type definition hashes to the form `#x.n#c` where `#x.n` is the hash of the data type and `c` is the data constructor’s index in the type definition.
* A _built-in reference_ to a Unison built-in term or type `n` has a hash of the form `##n`. `##Nat` is an example of a built-in reference.

## Short hashes
A hash literal may use a prefix of the base32Hex encoded SHA3 digest instead of the whole thing. For example the programmer may use a short hash like `#r1mtr0` instead of the much longer 104-character representation of the full 512-bit hash. If the short hash is long enough to be unambiguous given the [environment](#name-resolution-and-the-environment), Unison will substitute the full hash at compile time. When rendering code as text, Unison may calculate the minimum disambiguating hash length before rendering a hash.
