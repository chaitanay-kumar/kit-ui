import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Smart Comparison',
  description: 'An interactive feature matrix and SaaS tier comparison component featuring live difference filtering, collapsible specification categories, search indexing, and mobile card toggle.',
  category: 'Navigation',
  tagline: 'Interactive tier comparison matrix with difference filtering',
  badges: ['Feature Matrix', 'SaaS Pricing', 'Diff Filter'],
  createdAt: '2026-08-19',
  features: [
    'Live "Differences Only" filter to instantly surface plan divergence',
    'Integrated feature keyword search with real-time row matching',
    'Collapsible category groups with spring height transitions',
    'Segmented mobile plan selector avoiding wide horizontal table scrolling',
    'Contextual info tooltips and custom value cell rendering',
  ],
  props: [
    { name: 'plans', type: 'ComparisonPlan[]', default: '[]', description: 'Array of plans/tiers containing pricing and metadata' },
    { name: 'categories', type: 'ComparisonCategory[]', default: '[]', description: 'Grouped feature categories with plan-specific values' },
    { name: 'defaultPlanId', type: 'string', default: 'featured plan or plans[0].id', description: 'Initial plan selected on mobile viewports' },
    { name: 'enableSearch', type: 'boolean', default: 'true', description: 'Whether to show the instant feature search input' },
    { name: 'enableDiffFilter', type: 'boolean', default: 'true', description: 'Whether to render the "Differences Only" toggle button' },
    { name: 'className', type: 'string', default: 'undefined', description: 'Optional CSS class name for container' },
  ],
  accessibility: [
    'Semantic region container with ARIA labels',
    'Keyboard accessible category accordions and tooltips',
    'Boolean values render visual check and minus icons',
  ],
  usageCode: `import { SmartComparison } from "@/components/ui/smart-comparison";

const plans = [
  { id: "hobby", name: "Hobby", tagline: "For side projects", price: "$0", billingPeriod: "mo" },
  { id: "pro", name: "Pro", tagline: "For fast-moving teams", price: "$29", billingPeriod: "mo", featured: true, badge: "Popular" },
  { id: "enterprise", name: "Enterprise", tagline: "Dedicated compliance", price: "Custom", billingPeriod: "yr" },
];

const categories = [
  {
    id: "compute",
    title: "Compute & Scale",
    features: [
      { id: "bandwidth", name: "Global Bandwidth", values: { hobby: "100 GB", pro: "1 TB", enterprise: "Unlimited" } },
      { id: "regions", name: "Multi-Region Routing", values: { hobby: false, pro: true, enterprise: true } },
      { id: "concurrency", name: "Max Concurrency", values: { hobby: "10", pro: "250", enterprise: "Dedicated" } },
    ],
  },
];

export function Demo() {
  return <SmartComparison plans={plans} categories={categories} />;
}`,
};

export default meta;
