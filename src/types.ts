export type ScanStage = 'upload' | 'scanning' | 'error_screen' | 'results';

export interface BrainScanResult {
  id: string;
  icon: string;
  label: string;
  count: string;
  roast: string;
  extra: string;
}

export interface ForeheadRoast {
  title: string;
  dimension: string;
  thermalRoast: string;
  roastText: string;
}

export interface BrainCategory {
  name: string;
  tag: string;
  icon: string;
  description: string;
  powerConsumption?: string;
}

export interface RandomBrainRoastItem {
  id: string;
  title: string;
  icon: string;
  badge: string;
  badgeColor: string;
  metricLabel?: string;
  metricValue?: string | number;
  highlightText?: string;
  warningAlert?: {
    title: string;
    description: string;
    subtext?: string;
  };
  quote: string;
  subDescription?: string;
}
