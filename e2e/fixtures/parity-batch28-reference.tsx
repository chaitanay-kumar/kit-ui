import '../../src/styles/index.css';import React,{useRef,useState} from 'react';import {createRoot} from 'react-dom/client';import {MoveDown,MoveUp,RotateCw} from 'lucide-react';import {AnimatedTabs} from '../../src/components/ui/AnimatedTabs';import {ScrollVelocityText} from '../../src/components/ui/Scrollvelocitytext';
export const ScrollVelocityTextLiveShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(1.2);
  const expandDistance = 300;

  const scrollDown = () => {
    containerRef.current?.scrollBy({ top: 120, behavior: 'smooth' });
  };

  const scrollUp = () => {
    containerRef.current?.scrollBy({ top: -120, behavior: 'smooth' });
  };

  const resetScroll = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#202020] border border-[#363636] text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={scrollDown}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#242424] border border-[#363636] text-[#F5F5F5] hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-1.5 font-medium text-[11px] sm:text-xs"
          >
            <MoveDown className="w-3.5 h-3.5 text-white" />
            <span>Scroll Down</span>
          </button>
          <button
            type="button"
            onClick={scrollUp}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#242424] border border-[#363636] text-[#F5F5F5] hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-1.5 font-medium text-[11px] sm:text-xs"
          >
            <MoveUp className="w-3.5 h-3.5 text-white" />
            <span>Scroll Up</span>
          </button>
          <button
            type="button"
            onClick={resetScroll}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#242424] border border-[#363636] text-[#A3A3A3] hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-[#A3A3A3] shrink-0">
          <label className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span>Intensity:</span>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-16 accent-white cursor-pointer"
            />
            <span className="font-mono text-[11px] text-[#F5F5F5] w-6">{intensity}x</span>
          </label>
        </div>
      </div>

      {/* Scoped Scroll Area */}
      <div
        ref={containerRef}
        className="relative w-full h-[340px] sm:h-[380px] overflow-y-auto rounded-2xl border border-[#363636] bg-[#151515] p-4 sm:p-6 shadow-2xl select-none scrollbar-thin scrollbar-thumb-zinc-800"
      >
        <div className="min-h-[900px] flex flex-col items-center justify-between py-8 sm:py-12 text-center">
          <div className="sticky top-2 sm:top-4 z-20 px-2.5 sm:px-3 py-1 rounded-md bg-[#202020] border border-[#363636] text-[10px] sm:text-[11px] font-mono text-[#A3A3A3] backdrop-blur max-w-full">
            Scroll the container down and up to observe kinetic velocity physics
          </div>

          <div className="my-auto py-10 sm:py-16 flex flex-col items-center gap-3 w-full">
            <ScrollVelocityText
              as="h2"
              text="BUILD THE FUTURE"
              scrollContainerRef={containerRef}
              expandDistance={expandDistance}
              intensity={intensity}
              minLetterSpacing={0.02}
              maxLetterSpacing={0.6}
              maxScale={1.4}
              fadeStart={0.6}
              className="text-2xl sm:text-6xl font-black tracking-tight text-[#F5F5F5] uppercase text-center font-mono"
            />
            <p className="text-xs sm:text-sm text-[#A3A3A3] max-w-sm px-2">
              Direction-aware letter-spacing expanding on downward momentum with zero per-frame React re-renders.
            </p>
          </div>

          <div className="text-[11px] sm:text-xs font-mono text-[#737373]">
            End of velocity track · Scroll back up to restore rest state
          </div>
        </div>
      </div>
    </div>
  );
};
function TabsDemo(){const demoKey=0;return (
          <div className="py-8 flex flex-col items-center justify-center">
            <AnimatedTabs
              key={demoKey}
              tabs={[
                {
                  id: 'tab1',
                  label: 'Overview',
                  content: (
                    <div className="text-xs text-text-secondary p-4 bg-surface-raised rounded-xl border border-border dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]">
                      Overview metrics & telemetry
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  label: 'Integration',
                  content: (
                    <div className="text-xs text-text-secondary p-4 bg-surface-raised rounded-xl border border-border dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]">
                      Next.js App Router setup
                    </div>
                  ),
                },
                {
                  id: 'tab3',
                  label: 'Security',
                  content: (
                    <div className="text-xs text-text-secondary p-4 bg-surface-raised rounded-xl border border-border dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]">
                      Zero external runtime network dependencies
                    </div>
                  ),
                },
              ]}
              defaultTab="tab1"
            />
          </div>
        );}

const api=window as any;const query=new URLSearchParams(location.search);document.documentElement.classList.toggle('dark',query.get('theme')==='dark');api.referenceRoot?.unmount();api.referenceRoot=createRoot(document.body.appendChild(document.createElement('div')));api.referenceRoot.render(<div id="reference" style={{padding:16}}>{query.get('kind')==='velocity'?<ScrollVelocityTextLiveShowcase/>:<TabsDemo/>}</div>);
