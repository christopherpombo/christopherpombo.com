---
title: "Simply Spend"
date: 2026-01-01
stack: ["Swift", "SwiftUI", "SwiftData"]
order: 1
featured: true
tagline: "Budgets are complicated. This isn’t."
subtagline: "Track what you earn, what you spend, and see what’s left."
taglineHighlight: "isn't"
summary: "An iOS expense tracker built around one question: where did my money go this month? Log spending in seconds, read the month on a calendar, and keep every number on your own phone."
---

## The problem

Most money apps overcomplicate things. They push you into budgets with preset categories, ask you to link external accounts, and make it hard to answer the simple questions. In trying to make you feel in control, they automate everything, which misses the point entirely. If an app tracks your spending for you, you stop paying attention, and your habits never change.

I wanted something simpler, and well made. A manual tracker that shows me three numbers: what I’ve spent this month, what I’ve made, and the difference. No budgets to set up, nothing to pre-allocate. Just logging everything, so I stay aware of where my money goes. The simple apps I tried were outdated or didn’t feel good to use, so I built Simply Spend to fill that gap.

> Automation does the paying attention for you, and that’s exactly the problem. Simply Spend keeps you in the loop on purpose. The logging is the point, because awareness is what actually changes behavior.

## Who it's for

Anyone who wants to stay aware of their spending by tracking it themselves, without budgets, bank links, or extra complexity.

## Key features

### Log it in seconds

Tap the plus, enter the amount, pick a category, and you’re done. Add a note if you want to remember what it was.

### Spent, earned, and what’s left

Every month shows three numbers: what you spent, what you made, and the difference. No budgets to set up.

### Stay aware as you go

A weekly chart compares this week to a normal one, so you can tell early if you’re on track or spending more than usual.

### See where it goes

A category breakdown shows where your money went this month. Flip a switch to hide rent and other fixed costs and see your everyday spending.

### Zoom out

Switch the calendar between Spent, Earned, and Net to see any month of the year.

### Yours alone

No accounts and no bank links. Your data stays on your phone. Works in light and dark mode.

## Private by design

Everything stays on the device. There are no accounts, no servers, and no analytics or tracking. The full details are in the [privacy policy](/simply-spend/privacy).

## What I learned

- **Taking an idea from my head to a shipped product.** This was the first time I carried something all the way from concept to a real app in people’s hands, and the arc taught me more than any single step.
- **The details users feel but never name.** I obsessed over haptics, the small tactile feedback nobody consciously notices but everyone feels when it’s missing. A lot of this came down to human systems engineering: designing as the user, not just for them.
- **Building effectively with artificial intelligence.** I learned how to direct these tools well, where they speed you up, and where you still have to own the engineering yourself.
- **I spend more than I would have claimed.** Building an app to track spending made me actually watch my own, and the numbers weren’t what I expected. I’m still working on that one.

## Built with

Swift and SwiftUI, with SwiftData for on-device storage.

## Status

Simply Spend is currently in beta testing, with an App Store release coming soon.
