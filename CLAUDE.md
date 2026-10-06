# christopherpombo.com — project conventions

Personal site for Christopher Pombo (2d Lt, USAF / iOS developer). Astro,
vanilla CSS, zero client-side JS unless a page truly needs it.

## Design system: "Field Notes" (tokens in src/styles/tokens.css)
- Background: graph paper on the whole page — #F7F9FC base with a 24px grid
  of 1px #DCE5F2 lines (two linear-gradient layers on body). html is the
  plain base color so overscroll matches. Header/footer sit on the base color
  with a 1.5px navy rule.
- Ink: navy #1C2B4A for text, borders, filled buttons, and device bezels.
  Muted text #4A5878.
- Accent: red #B23A31 — used ONLY for small labels/eyebrows, section numbers,
  checkmarks, active/hover states, and handwritten notes. Never large red
  areas. (Darkened from #C8453B, which was 3.78:1 where text crosses a grid
  line; #B23A31 clears 4.5:1 on the paper, the grid lines, and white.)
- Type (self-hosted via @fontsource): IBM Plex Sans 400/600/700 for headings
  and body; IBM Plex Mono 400/600 for nav, section labels, dates, metadata,
  and buttons; Caveat 600 for handwritten margin notes ONLY (`.hand`). Body
  17px, line-height 1.6.
- Cards: white, 1.5px solid navy border, square corners, no soft shadows.
  The only shadow on the site is the hard offset shadow (6px 6px 0 navy) on
  the tilted (1.5deg) hero photo card.
- Section labels: mono, uppercase, letter-spaced, numbered on Home
  ("01 — WHAT I'M DOING") with the number in red and a navy rule after the
  label (`SectionHeading` with `number`).
- Buttons: primary = filled navy rectangle (hover: red fill); secondary =
  1.5px navy outline (hover: red text/border). Mono uppercase labels.
- Lists of facts are ledgers: label/value rows separated by thin grid-blue
  (#DCE5F2) rules.
- App screenshots sit in navy iPhone-style bezels (`.device`).
- Layout: max-width ~1100px, centered. Everything must work at phone width.

## Content rules
- Christopher is a 2d Lt / MSC officer, NOT a cadet. Never use "cadet" for
  his current status (past roles on the resume are fine).
- Voice: first person, confident, plainspoken. No corporate filler.
- Goals page is organized on one axis: "Working toward" (active) vs.
  "Accomplished" (done) — not by theme. Each goal carries a free-text `tag`
  (Build, Service, Body, Mind, Coaching, Create, Education, ...) instead.
- Known typos from the old site — never reproduce: "Scount" → Scout,
  "Involvments" → Involvements, "Activites" → Activities.

## Engineering rules
- Content lives in content collections as markdown; pages render collections.
  Adding a goal/project must never require touching component code.
- Clean URLs only (/goals/honolulu-marathon). No "copy-of" cruft.
- Every page sets a unique <title> and meta description via BaseLayout props.
- Semantic HTML, accessible by default (landmarks, alt text, contrast).
- Commit after each working milestone with clear messages.
