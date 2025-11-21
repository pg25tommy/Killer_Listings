// BC-only supported cities for MVP
export const SUPPORTED_CITIES = [
  "Vancouver",
  "Burnaby",
  "New Westminster",
  "Richmond",
  "Surrey",
  "Delta",
  "Coquitlam",
  "Port Coquitlam",
  "Port Moody",
  "North Vancouver",
  "West Vancouver",
  "Victoria",
] as const;

export const BC_BOUNDS = {
  north: 60.0,
  south: 48.3,
  west: -139.1,
  east: -114.0,
};

export const LOWER_MAINLAND_CENTER = {
  lat: 49.2827,
  lng: -123.1207,
};

export const HISTORY_SCORE_LABELS = {
  CLEAN: "No history found. You're in the clear.",
  POSSIBLE: "Something came up. Take a closer look.",
  CONFIRMED: "Confirmed incident. Read before you proceed.",
} as const;

export const HISTORY_SCORE_COLORS = {
  CLEAN: "green",
  POSSIBLE: "yellow",
  CONFIRMED: "red",
} as const;

export const OUTSIDE_BC_MESSAGE =
  "Killer Listings is currently available in British Columbia. More regions coming soon.";
