# christopherpombo.com — project conventions

Personal site for Christopher Pombo (2d Lt, USAF / iOS developer). Astro,
vanilla CSS, zero client-side JS unless a page truly needs it.

## Design system (extracted from the previous Wix site — see design-reference/
screenshots, they are the visual source of truth)
- Background: warm beige #E7E1D6. Header & footer: white #FFFFFF.
- Cards: white, border-radius 0 or very small, soft drop shadow
  (e.g. 0 6px 18px rgba(0,0,0,0.08)), generous padding.
- Accent: forest green #3F6B45 — used ONLY for: dates, active nav item,
  section-heading squares, card title bars, small hover states. Never large
  green areas.
- Text: near-black #1F1F1F on beige/white. Muted gray #5C5C5C for meta text
  (darkened from the original #6B6B6B — that value was 4.1:1 on the beige
  background, under WCAG AA's 4.5:1 for normal text; #5C5C5C clears 5:1+).
- Signature motifs: (1) small green square (~14px) before section headings;
  (2) 6px green vertical bar on the left of card titles; (3) letter-spaced
  uppercase for role subtitles.
- Type: Poppins 600/700 for headings (self-host via @fontsource), Mulish
  400/500 for body. Body ~17px, line-height 1.6.
- Layout: max-width ~1100px, centered. Resume cards are two-column: green
  date + role on the left, description on the right; stack on mobile.

## Content rules
- Christopher is a 2d Lt / MSC officer, NOT a cadet. Never use "cadet" for
  his current status (past roles on the resume are fine).
- Voice: first person, confident, plainspoken. No corporate filler.
- Goals page keeps the "Near Rocks / Far Rocks / Stacked Rocks" structure.
- Known typos from the old site — never reproduce: "Scount" → Scout,
  "Involvments" → Involvements, "Activites" → Activities.

## Engineering rules
- Content lives in content collections as markdown; pages render collections.
  Adding a goal/project must never require touching component code.
- Clean URLs only (/goals/honolulu-marathon). No "copy-of" cruft.
- Every page sets a unique <title> and meta description via BaseLayout props.
- Semantic HTML, accessible by default (landmarks, alt text, contrast).
- Commit after each working milestone with clear messages.
