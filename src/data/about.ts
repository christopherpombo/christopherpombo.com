export interface AboutItem {
  label: string;
  title: string;
  /** Hidden when empty. */
  meta?: string;
}

export const about: AboutItem[] = [
  {
    label: "Serving as",
    title: "2d Lt, USAF Medical Service Corps",
    meta: "Group Practice Manager, David Grant Medical Center",
  },
  { label: "Studied", title: "B.S. Operations Research", meta: "U.S. Air Force Academy, 2026" },
  { label: "Building", title: "iOS apps", meta: "Simply Spend" },
  { label: "Running", title: "Marathons", meta: "PR 3:04:44" },
];
