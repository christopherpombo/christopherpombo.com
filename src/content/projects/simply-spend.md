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

Most money apps overcomplicate things. They push you into budgets with preset categories, ask you to link your bank, and still make it hard to answer simple questions. They also automate everything, and that misses the point. If an app tracks your spending for you, you stop paying attention to it, and your habits never change.

I wanted something simpler: a manual tracker that shows me three numbers. What I’ve spent this month, what I’ve made, and the difference. No budgets to set up, nothing to pre-allocate. Just logging everything, so I stay aware of where my money goes. The simple apps I tried were outdated or didn’t feel good to use, so I built Simply Spend to fill that gap.

## Who it's for

Anyone who wants to stay aware of their spending by tracking it themselves, without budgets, bank links, or extra complexity.

## Key features

<!-- One highlight on this page, max (see .highlight in global.css). -->

### See exactly what you <span class="highlight highlight--yellow">spend</span>

The month opens on what you've spent so far, and a chart card tracks this week's running total against your usual week, so you know by Wednesday whether you're running ahead.

### Know where your money goes

One swipe over, a by-category breakdown sizes each category by its share of the month. An "Exclude fixed" switch takes rent and other fixed costs out of the picture.

### Your whole year at a glance

Flip the calendar between Spent, Earned, and Net to see every day — or every month of the year — from the angle you need.

### In, out, and what's left

A monthly statement puts money in, money out, and the net side by side, each broken down by category.

### Log it in seconds

A built-in keypad, one-tap categories and payment methods, and an optional note, so "$18.50" still means something next month.

### Looks great day or night

A full dark mode, charts included.

### Also

- **Recurring transactions.** Set up rent, paychecks, and subscriptions once and they repeat on their own.
- **CSV export.** Export every transaction as a CSV from Settings and send it wherever you like.
- **Budgets** are coming in a later release.

## Private by design

Everything stays on the device. There are no accounts, no servers, and no analytics or tracking. The full details are in the [privacy policy](/simply-spend/privacy).

## Built with

Swift and SwiftUI, with SwiftData for on-device storage.
