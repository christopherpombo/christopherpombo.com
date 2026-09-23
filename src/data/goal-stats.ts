export interface GoalStat {
  /** Set to null for a stat that isn't confirmed yet — the page hides that cell rather than guessing. */
  value: string | null;
  label: string;
}

export const goalStats: GoalStat[] = [
  { value: "3:19:25", label: "Honolulu Marathon" },
  { value: "2d Lt", label: "Commissioned, May 2026" },
  { value: "1", label: "iOS app built from scratch" },
  // TODO: fill in once I've actually counted how many books I finished in 2025.
  { value: null, label: "Books read in 2025" },
];
