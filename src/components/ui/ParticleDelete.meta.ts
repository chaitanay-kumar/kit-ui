import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Particle Delete',
  description: 'Premium physics-driven particle dissolution delete animation that rasterizes components into thousands of authentic tiny pixels and disperses them smoothly before state removal.',
  category: 'Motion',
  tagline: 'Physics-driven pixel particle dissolution delete animation',
  badges: ['HTML5 Canvas', 'Particle Physics', 'High-DPI'],
  createdAt: '2026-08-21',
  features: [
    'DOM capture samples component pixels, with a procedural background/border fallback when capture is blocked',
    'Canvas 2D particle rendering with configurable sampling and particle limits',
    'Configurable physics: duration, explosion force, drag, and dissolution spread',
    'Automatic prefers-reduced-motion fade fallback',
    'Available as direct utility particleDelete(), hook useParticleDelete(), or <ParticleDeleteContainer /> wrapper',
  ],
  props: [
    { name: 'initialItems', type: 'ParticleDeleteItem[]', description: 'Initial resource cards; subsequent input changes affect Restore, not current items' },
    { name: 'onDelete', type: '() => void', description: 'ParticleDeleteContainer callback after dissolution; not a prop of the main resource-card component' },
    { name: 'options.duration', type: 'number', default: '850', description: 'Animation duration in milliseconds' },
    { name: 'options.force', type: 'number', default: '1.0', description: 'Outward velocity multiplier for particle dispersion' },
    { name: 'options.particleSize', type: 'number', default: '1.5', description: 'Visual diameter of individual particles in pixels' },
    { name: 'options.dissolvePattern', type: "'center-first' | 'edges-first' | 'uniform' | 'random'", default: "'center-first'", description: 'Dissolution spread delay algorithm' },
    { name: 'options.sampleStep', type: 'number', default: '2 (desktop) / 3 (mobile)', description: 'Pixel sampling step interval' },
  ],
  accessibility: [
    'Automatically honors prefers-reduced-motion: reduce with a 150ms opacity fade',
    'Delete trigger buttons maintain clear ARIA labels and keyboard focus ring states',
    'Canvas overlay is marked with aria-hidden="true" and pointer-events: none',
  ],
  usageCode: `import { useState } from "react";
import { ParticleDeleteContainer } from "@/components/ui/particle-delete";
import { Trash2 } from "lucide-react";

export function Demo() {
  const [items, setItems] = useState([
    { id: '1', name: 'Database Snapshot #409' },
    { id: '2', name: 'Redis Cache Layer' }
  ]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ParticleDeleteContainer
          key={item.id}
          onDelete={() => handleDelete(item.id)}
          className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex items-center justify-between"
        >
          {({ isDeleting, handleDelete: triggerDelete }) => (
            <>
              <span className="text-sm font-medium text-white">{item.name}</span>
              <button
                type="button"
                onClick={triggerDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg bg-[#141414] hover:bg-rose-950/40 text-[#888888] hover:text-rose-400 border border-[#262626] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </ParticleDeleteContainer>
      ))}
    </div>
  );
}`,
};

export default meta;
