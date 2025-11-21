export type HistoryScore = "CLEAN" | "POSSIBLE" | "CONFIRMED";

export interface PropertyWithIncidents {
  id: string;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  listingPrice: number | null;
  status: string | null;
  historyScore: HistoryScore;
  incidents: IncidentSummary[];
}

export interface IncidentSummary {
  id: string;
  type: string;
  date: Date;
  summary: string;
  sourceUrl: string | null;
  severity: number;
}

export interface SearchResult {
  id: string;
  address: string;
  city: string;
  historyScore: HistoryScore;
  incidentCount: number;
}

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  type: "property" | "incident";
  historyScore?: HistoryScore;
  severity?: number;
}
