export interface DataRowItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  status: 'active' | 'pending' | 'churned' | 'paused';
  revenue: string | number;
  date: string;
  metadata?: {
    plan?: string;
    sessions?: number;
    lastActive?: string;
    billingMethod?: string;
    location?: string;
  };
  recentActivity?: Array<{
    action: string;
    timestamp: string;
  }>;
}

export const DEFAULT_DATA_ROWS: DataRowItem[] = [
  {
    id: 'usr_01',
    user: {
      name: 'Sarah Connor',
      email: 'sarah.c@cyberdyne.io',
      role: 'Lead Architect',
    },
    status: 'active',
    revenue: '$4,280',
    date: 'Oct 24, 2026',
    metadata: {
      plan: 'Enterprise Plus',
      sessions: 482,
      lastActive: '12m ago',
      billingMethod: 'Visa •••• 8841',
      location: 'San Francisco, CA',
    },
    recentActivity: [
      { action: 'Upgraded team seat quota to 50 members', timestamp: '2 hours ago' },
      { action: 'Generated production API key for US-East cluster', timestamp: 'Yesterday' },
      { action: 'Completed SAML SSO authentication setup', timestamp: '3 days ago' },
    ],
  },
  {
    id: 'usr_02',
    user: {
      name: 'Marcus Vance',
      email: 'marcus@hyperion.tech',
      role: 'VP Engineering',
    },
    status: 'pending',
    revenue: '$1,950',
    date: 'Oct 22, 2026',
    metadata: {
      plan: 'Growth Pro',
      sessions: 124,
      lastActive: '2h ago',
      billingMethod: 'Mastercard •••• 1092',
      location: 'London, UK',
    },
    recentActivity: [
      { action: 'Requested custom SOC2 compliance report', timestamp: '4 hours ago' },
      { action: 'Added 4 new engineers to developer workspace', timestamp: '2 days ago' },
    ],
  },
  {
    id: 'usr_03',
    user: {
      name: 'Elena Rostova',
      email: 'elena@solaris.design',
      role: 'Principal Designer',
    },
    status: 'active',
    revenue: '$3,400',
    date: 'Oct 19, 2026',
    metadata: {
      plan: 'Design Scale',
      sessions: 890,
      lastActive: 'Just now',
      billingMethod: 'Apple Pay',
      location: 'Berlin, DE',
    },
    recentActivity: [
      { action: 'Exported component token dictionary (JSON)', timestamp: '10m ago' },
      { action: 'Created 8 new shared motion templates', timestamp: 'Yesterday' },
    ],
  },
  {
    id: 'usr_04',
    user: {
      name: 'Alex Chen',
      email: 'alex@quantum-ops.co',
      role: 'DevOps Lead',
    },
    status: 'paused',
    revenue: '$850',
    date: 'Oct 14, 2026',
    metadata: {
      plan: 'Starter Team',
      sessions: 42,
      lastActive: '5d ago',
      billingMethod: 'Invoice (Net-30)',
      location: 'Toronto, CA',
    },
    recentActivity: [
      { action: 'Paused subscription renewal pending budget review', timestamp: '5 days ago' },
    ],
  },
];

