# ChronoCrime

An idle/incremental game in the style of [Evolve](https://pmotschmann.github.io/Evolve/).
Work your way up a criminal underworld, build a time machine, and start over in another era.

**[Play it](https://2ndnegative.github.io/ChronoCrime/)**

Work in progress.

## Built with generative AI

This game was made with the help of generative AI. Most of the code here was written
by a large language model working from my direction. Design decisions, mechanics,
balance, review and all of the in-game prose are mine; a lot of the typing is not.

## Writing the text

All in-game text lives in `loc/strings.csv`, one row per key: `key`, `context` (a hint
about where the text appears) and `text`. Unwritten text shows in game as `‹key›`.
`npm run loc:sync` adds rows for new keys and never touches text that is already written.

`docs/DESIGN.md` is the long version: what every system does, why it is shaped that way,
which constants tune it, and the rules for working on the code.
