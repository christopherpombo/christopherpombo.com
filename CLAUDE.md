# christopherpombo.com — project conventions

A minimal, product-focused portfolio of apps by Christopher Pombo. It's about
the work, not the person. Astro, vanilla CSS, zero client-side JS unless a page
truly needs it.

## Design system: "Field Notes" (tokens in src/styles/tokens.css)
- Background: graph paper on the whole page — #F7F9FC base with a 24px grid
  of 1px #DCE5F2 lines (two linear-gradient layers on body). html is the
  plain base color so overscroll matches. Header/footer sit on the base color
  with a 1.5px navy rule.
- Ink: navy #1C2B4A for text, borders, filled buttons, and device bezels.
  Muted text #4A5878.
- Accent: red #B23A31 — used ONLY for small labels/eyebrows, list arrows,
  and active/hover states. Never large red areas. (Darkened from #C8453B, which was 3.78:1 where text crosses a grid
  line; #B23A31 clears 4.5:1 on the paper, the grid lines, and white.)
- Type (self-hosted via @fontsource): IBM Plex Sans 400/600/700 for headings
  and body; IBM Plex Mono 400/600 for nav, section labels, dates, metadata,
  and buttons. Body 17px, line-height 1.6. Caveat appears only inside the
  generated "cp" mark (as outlines); the pages don't load it.
- Cards: white, 1.5px solid navy border, square corners, no shadows.
- Section labels: mono, uppercase, letter-spaced, with a navy rule after the
  label (`SectionHeading`).
- Buttons: primary = filled navy rectangle (hover: red fill); secondary =
  1.5px navy outline (hover: red text/border). Mono uppercase labels.
- Lists of facts are ledgers: label/value rows separated by thin grid-blue
  (#DCE5F2) rules.
- App screenshots sit in navy iPhone-style bezels (`.device`), three at a
  time with the middle one raised (`PhoneTrio`).
- Brand mark: red (#C8453B) Caveat 700 "cp" on a navy-bordered graph-paper
  tile (public/mark.svg, used in the header). Favicon, touch icon, and OG
  image all come from `npm run generate-assets` — edit the script, not the
  files.
- Layout: max-width ~1100px, centered. Everything must work at phone width.

## Content rules
- Product portfolio only. No biographical or military content anywhere: no
  rank, branch, unit, base, school, degree, research, races or times,
  certifications, or personal photos. No philosophy headlines.
- Never describe Christopher with a title or role ("iOS developer",
  "engineer", "officer", ...). His name appears; what he is doesn't.
- Contact is a mailto link and LinkedIn only. No other personal socials.
- Pages: / (featured app + project list), /projects, /projects/[slug],
  /contact, and /simply-spend/privacy (kept live for the App Store listing,
  left out of the sitemap). /resume and /goals 301 to / via public/_redirects.
- Voice: product-first and plainspoken. First person only where natural
  ("I built Simply Spend to…"). No corporate filler.
- Projects with `draft: true` are hidden everywhere (pages, lists, sitemap).
  Their screenshots go in src/assets/drafts/<id>/, not src/assets/projects/:
  every image the screenshot glob imports is published, page or not. RuBric
  is a draft until it has neutral demo screenshots and copy.

## Engineering rules
- Content lives in content collections as markdown; pages render collections.
  Adding a project must never require touching component code. Every page
  lists projects through `publishedProjects()` (src/data/projects.ts), which
  drops drafts.
- Clean URLs only (/projects/simply-spend). No "copy-of" cruft.
- Every page sets a unique <title> and meta description via BaseLayout props.
- Semantic HTML, accessible by default (landmarks, alt text, contrast).
- Commit after each working milestone with clear messages.
