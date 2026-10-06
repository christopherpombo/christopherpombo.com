---
title: "RuBric"
# A bare `2026` would parse as a timestamp in 1970; the page only shows the year.
date: 2026-01-01
stack: ["Swift", "SwiftUI", "SwiftData", "WidgetKit", "Notion API", "Google Calendar API"]
order: 2
summary: "A rubric for my life, built brick by brick. A personal iOS app that turns my Notion goals into brick walls that grow as I finish tasks."
---

I track every goal and task in Notion, but a database doesn't show progress. RuBric reads my Notion Goals and To-Do List and draws each goal as a brick wall: one brick per task, laid as it's done, mustard while it's in progress. A "Next brick" card shows the one task to do next across all my goals.

**Goal detail.** A timeline strip runs from the start date to the target date, with every task as a waypoint, the days left, and overdue tasks flagged.

**Today.** A daily dashboard that pulls in my Google Calendar, my running plan, my open Notion tasks, and a morning brief that a scheduled task writes to Notion every weekday at 4 AM.

**Widgets.** Home-screen widgets for goals and for today, so I can see progress without opening the app.

**How it's built.** Swift 6 and SwiftUI, with SwiftData as an offline cache that the widgets share through an App Group. The access token lives in the Keychain, and the app is read-only, so Notion and Google stay the source of truth. I built it with Claude Code.

**The look.** A warm brick-red "Fired" theme with paper cards, Bricolage Grotesque type, and a custom brick-wall progress component.

*Screenshots use the app's demo data.*
