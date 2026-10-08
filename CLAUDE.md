# christopherpombo.com — project conventions

A minimal personal portfolio for Christopher Pombo: his name, a short About,
the work, and how to get in touch. Astro, vanilla CSS, zero client-side JS unless a page
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
- Highlighter: a hand-swiped marker band behind one key word (`Highlight`,
  or `<span class="highlight highlight--<color>">` in markdown headings).
  Yellow, green, blue, pink, orange, purple at 70%, matching the App Store
  screenshots. One word per heading, max, and at most one on a case study
  page; never in body text, nav, buttons, or the footer. Highlighted words are always navy (muted text fails 4.5:1).
- Type (self-hosted via @fontsource): IBM Plex Sans 400/600/700 for headings
  and body; IBM Plex Mono 400/600 for nav, section labels, dates, metadata,
  and buttons. Body 17px, line-height 1.6. Caveat appears only inside the
  generated "cp" mark (as outlines); the pages don't load it.
- Cards: white, 1.5px solid navy border, square corners, no shadows. The one
  exception is the About photo card: tilted 1.5deg with a hard navy offset
  shadow (`--shadow-hard`).
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
- About is a CSS-only crossfade of three photos (src/assets/about/,
  metadata stripped: desert ride, the beret photo, the lake) and one short
  line. Christopher chose the beret photo knowing it shows his uniform
  tapes; don't add more photos like it, or photos of other people, without
  asking. Nothing else biographical in text: no
  military content (rank, branch, unit, base, the Academy), school, degree,
  research, races or times, certifications, or philosophy lines.
- Never describe Christopher with a title or role ("iOS developer",
  "engineer", "officer", ...). His name appears; what he is doesn't.
- Contact is a mailto link and LinkedIn only. No other personal socials.
- Pages: / (intro hero, then 01 About, 02 Work, 03 Contact sections),
  /projects, /projects/[slug], /contact, and /simply-spend/privacy (kept live
  for the App Store listing, left out of the sitemap, linked from the Simply
  Spend case study). /resume and /goals 301 to / via public/_redirects.
- Nav links go to real pages, never anchors: Home → /, Projects → /projects
  (active on /projects/*), Contact → /contact. The footer links the same
  pages (labeled About, Work, Contact) plus each published project, so every
  page is one click from every other.
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
