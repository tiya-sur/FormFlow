export interface Site {
  id: number;
  name: string;
  location: string;
  surplus_panels: number;
  needed_panels: number;
  active_projects: number;
}

export interface Panel {
  id: string;
  site_id: number;
  site_name: string;
  type: string;
  reuse_cycles: number;
  status: 'idle' | 'in-use' | 'maintenance' | 'transit';
  last_tracked: string;
}

export interface Stats {
  totalWasteReduced: string;
  avgReuseCycles: number;
  costSavings: string;
  activeSites: number;
}

export interface MarketplaceSuggestion {
  from: string;
  to: string;
  panels: number;
  savings: string;
  distance: string;
}
