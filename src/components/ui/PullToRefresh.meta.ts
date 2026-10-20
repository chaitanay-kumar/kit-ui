import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Pull to Refresh',
  description: 'A physical pull-to-refresh component and container featuring realistic elastic resistance curves, smooth cubic bezier line chart visualization with interactive point scrubbing, high/low metrics, and seamless light & dark mode compatibility.',
  category: 'Feedback',
  tagline: 'Elastic pull gesture with smooth interactive line charts and async lifecycle feedback',
  badges: ['Gesture Physics', 'Interactive Chart', 'Light & Dark', 'Touch & Pointer'],
  createdAt: '2026-09-24',
  features: [
    'Seamless Light and Dark mode theming with tuned contrast and crisp aesthetics',
    'Exponential pull resistance with spring-smoothed content translation',
    'Interactive pointer and touch chart scrubbing with realtime price and timestamp tracking',
    'Integrated financial statistics card with smooth bezier curve line chart, area fill, and endpoint glow',
    'Minimal key metrics summary row (24h High, 24h Low, Volume)',
    'Reactive time range switching (1H, 4H, 1D) with spring morph pill indicators',
    'Full async lifecycle support (idle, pulling, ready, refreshing, complete)',
    'R shortcut on the panel and a native hidden refresh button',
  ],
  props: [
    { name: 'onRefresh', type: '() => Promise<void> | void', default: 'undefined', description: 'Called for a qualifying pull/flick or explicit refresh; when omitted, runs the built-in financial simulation' },
    { name: 'threshold', type: 'number', default: '68', description: 'Downward travel distance in pixels required to trigger refresh' },
    { name: 'maxPull', type: 'number', default: '110', description: 'Maximum drag distance limit' },
    { name: 'resistance', type: 'number', default: '0.45', description: 'Elastic resistance multiplier' },
    { name: 'refreshingHoldOffset', type: 'number', default: '48', description: 'Vertical offset to hold content at while refresh resolves' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables gesture interaction' },
    { name: 'showDefaultIndicator', type: 'boolean', default: 'true', description: 'Show the built-in minimal circular progress indicator' },
    { name: 'pullIndicator', type: '(state: PullState) => React.ReactNode', default: 'undefined', description: 'Custom indicator renderer receiving status, distance, progress and threshold' },
    { name: 'children', type: 'React.ReactNode', default: '<FinancialStatsCard />', description: 'Custom child content to be pulled' },
    { name: 'className', type: 'string', default: 'undefined', description: 'Tailwind classes merged into the panel wrapper' },
  ],
  accessibility: [
    'Accessible role="region" with aria-busy and aria-label attributes',
    'Focused panel supports R without Control or Meta; the hidden native button supports ordinary keyboard activation',
    'Screen reader accessible hidden refresh button fallback',
    'Reduced motion removes content translation; refresh indicators and several financial-card effects retain their source animations',
  ],
  usageCode: `import { PullToRefresh, FinancialStatsCard } from "@/components/ui/pull-to-refresh";

export function Demo() {
  return (
    <PullToRefresh
      onRefresh={async () => {
        await new Promise((res) => setTimeout(res, 1200));
      }}
    >
      <FinancialStatsCard showMetrics showActions />
    </PullToRefresh>
  );
}`,
};

export default meta;
