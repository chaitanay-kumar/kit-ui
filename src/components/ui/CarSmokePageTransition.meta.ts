import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Car Smoke Page Transition',
  description:
    'A cinematic car drift and smoke overlay with an application completion callback.',
  category: 'Motion',
  tagline: 'Cinematic automotive page transition',
  badges: ['Cinematic', 'Motion Physics', 'Reduced Motion'],
  createdAt: '2026-09-08',
  features: [
    'Canvas2D smoke plumes, skid marks and speed lines',
    'Choreographed multi-axis Ferrari drift movement, wheel spin, and speed lines',
    'Customizable travel direction (left-to-right or right-to-left), density, and scale',
    'Automatic theme awareness (light and dark mode overlay shading)',
    'Keyboard trigger and an automatic prefers-reduced-motion branch',
  ],
  props: [
    { name: 'direction', type: "'left-to-right' | 'right-to-left'", default: "'left-to-right'", description: 'Direction of car travel' },
    { name: 'carDuration', type: 'number', default: '1350', description: 'Duration of car crossing animation in milliseconds' },
    { name: 'carDelay', type: 'number', default: '0', description: 'Delay before car starts moving in milliseconds' },
    { name: 'carSize', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the car (affects scale)' },
    { name: 'smokeDensity', type: "'off' | 'low' | 'medium' | 'high'", default: "'medium'", description: 'Density of smoke particles emitted' },
    { name: 'smokeLifetime', type: 'number', default: '1400', description: 'Lifetime of smoke particles in milliseconds' },
    { name: 'showSpeedLines', type: 'boolean', default: 'true', description: 'Whether to show speed lines effect behind the car' },
    { name: 'pageTransitionDelay', type: 'number', default: '900', description: 'Normal-motion completion offset: callback runs at carDelay + pageTransitionDelay + 100 ms. Overlay fade starts independently at carDelay + 0.65 × carDuration.' },
    { name: 'pageTransitionDuration', type: 'number', default: '400', description: 'Overlay fade duration; also the completion delay in reduced motion, in milliseconds' },
    { name: 'resetDelay', type: 'number', default: '350', description: 'Reset hold in milliseconds; normal motion also includes pageTransitionDuration and a final 350 ms fade' },
    { name: 'onTransitionComplete', type: '() => void', default: 'undefined', description: 'Application callback on the completion timer; navigation is supplied by the application' },
    { name: 'verticalPosition', type: "'center' | 'top' | 'bottom' | number", default: "'center'", description: 'Vertical anchor; numeric values use percentages for the car position and canvas calculations' },
    { name: 'children', type: 'ReactNode', default: 'undefined', description: 'The trigger element (typically a Button)' },
    { name: 'className', type: 'string', default: "undefined", description: 'Additional Tailwind classes merged into the root' },
  ],
  accessibility: [
    'The trigger is keyboard accessible via Enter and Space keys',
    'Reduced motion preference automatically disables the fast car animation and smoke effects',
    'The overlay background respects the current Kit UI theme (light/dark)',
    'The decorative overlay is aria-hidden and ignores pointer input; focus management and navigation belong to the application',
  ],
  usageCode: `import { CarSmokePageTransition } from "@/components/ui/car-smoke-page-transition";

export function Demo() {
  return (
    <CarSmokePageTransition
      onTransitionComplete={() => {
        // The application chooses navigation on the completion timer.
        window.location.href = "/about";
      }}
    >
      <button className="bg-[#FAFAFA] text-[#050505] hover:bg-white px-4 py-2 rounded-md font-medium transition-colors">
        Start Journey
      </button>
    </CarSmokePageTransition>
  );
}`,
};

export default meta;
