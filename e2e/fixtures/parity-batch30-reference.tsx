import '../../src/styles/index.css';import React from 'react';import {createRoot} from 'react-dom/client';import {GlassNavbar} from '../../src/components/ui/GlassNavbar';import {ScrollProgressNav} from '../../src/components/ui/ScrollProgressNav';
const ScrollProgressNavShowcase: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sections = [
    { id: 'sec-overview', index: '01', label: 'Overview' },
    { id: 'sec-architecture', index: '02', label: 'Architecture' },
    { id: 'sec-components', index: '03', label: 'Components' },
    { id: 'sec-telemetry', index: '04', label: 'Telemetry' },
    { id: 'sec-pricing', index: '05', label: 'Pricing' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-1 text-xs text-[#6B6B6B] font-mono">
        <span>Simulated Scroll Viewport</span>
        <span>Scroll or click pills to test navigation</span>
      </div>

      {/* Simulated Scrollable Container */}
      <div className="relative rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] overflow-hidden shadow-md">
        {/* Floating / Sticky Nav inside container */}
        <div className="p-3 sticky top-0 z-30 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-[#1F1F1F] flex justify-center">
          <ScrollProgressNav
            mode="inline"
            sections={sections}
            containerRef={containerRef}
          />
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={containerRef}
          className="h-[300px] overflow-y-auto p-5 space-y-6 scroll-smooth"
        >
          <div id="sec-overview" className="p-5 rounded-xl bg-[#141414] border border-[#1F1F1F] space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase">01 Overview</span>
            <h4 className="text-sm font-semibold text-[#FAFAFA]">Edge First Motion Architecture</h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Kit UI is engineered from the ground up for minimal latency, zero-jank spring physics, and Apple-grade micro interactions.
            </p>
          </div>

          <div id="sec-architecture" className="p-5 rounded-xl bg-[#141414] border border-[#1F1F1F] space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase">02 Architecture</span>
            <h4 className="text-sm font-semibold text-[#FAFAFA]">Neutral Dark Design Tokens</h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Strict grayscale elevation hierarchy using #050505 canvas, #0E0E0E surface, and calibrated 1px #1F1F1F borders.
            </p>
          </div>

          <div id="sec-components" className="p-5 rounded-xl bg-[#141414] border border-[#1F1F1F] space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase">03 Components</span>
            <h4 className="text-sm font-semibold text-[#FAFAFA]">44 Production UI Elements</h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Every component supports keyboard shortcuts, touch gestures, screen-reader semantics, and prefers-reduced-motion.
            </p>
          </div>

          <div id="sec-telemetry" className="p-5 rounded-xl bg-[#141414] border border-[#1F1F1F] space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase">04 Telemetry</span>
            <h4 className="text-sm font-semibold text-[#FAFAFA]">Real-Time Event Streams</h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Sub-millisecond latency tracking and automated canary deployments across 32 regional edge nodes worldwide.
            </p>
          </div>

          <div id="sec-pricing" className="p-5 rounded-xl bg-[#141414] border border-[#1F1F1F] space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase">05 Pricing</span>
            <h4 className="text-sm font-semibold text-[#FAFAFA]">Open Source & Free Forever</h4>
            <p className="text-xs text-[#A1A1A1] leading-relaxed">
              Install any component with the CLI. No subscriptions, no lock-in, 100% copy-pasteable TypeScript code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


function GlassDemo(){return (
          <div className="py-6 w-full space-y-4">
            <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#1F1F1F] overflow-hidden">
              <div className="relative py-2">
                <GlassNavbar

                  variant="floating"
                  sticky={false}
                  items={[
                    { label: 'Platform', href: '#platform' },
                    { label: 'Components', href: '#components', badge: 'New' },
                    { label: 'Showcase', href: '#showcase' },
                    { label: 'Docs', href: '#docs' },
                  ]}
                  cta={
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#FAFAFA] text-[#050505] text-xs font-medium hover:bg-white transition-colors cursor-pointer"
                    >
                      Deploy Now
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        );}
const query=new URLSearchParams(location.search);document.documentElement.classList.toggle('dark',query.get('theme')==='dark');createRoot(document.body.appendChild(document.createElement('div'))).render(<div id="reference" style={{padding:16}}>{query.get('kind')==='progress'?<ScrollProgressNavShowcase/>:<GlassDemo/>}</div>);
