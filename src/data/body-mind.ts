export interface LedgerRow {
  label: string;
  /** null hides the row — never render a placeholder. */
  value: string | null;
}

export interface LedgerCard {
  title: string;
  rows: LedgerRow[];
}

export const bodyMind: LedgerCard[] = [
  {
    title: "Body",
    rows: [
      { label: "Marathon PR", value: "3:19:25" },
      { label: "Training", value: "Push / Pull / Legs" },
      { label: "Sunday", value: "Long run" },
      { label: "Also", value: "Tennis, hiking, climbing" },
    ],
  },
  {
    title: "Mind",
    rows: [
      // TODO: fill in the current year's reading list (count or current book).
      { label: "Reading list", value: null },
      { label: "Studying", value: "NASM CPT" },
      { label: "Learning", value: "iOS development" },
      { label: "Favorite read", value: "Tuesdays with Morrie" },
    ],
  },
];
