export type TimelineStatus = 'completed' | 'in-progress' | 'pending' | 'failed';

export interface TimelineMetric {
  label: string;
  value: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  status: TimelineStatus;
  description?: string;
  tag?: string;
  commitHash?: string;
  metrics?: TimelineMetric[];
  author?: {
    name: string;
    role?: string;
  };
}

