import '../../src/styles/index.css';import React from 'react';import {createRoot} from 'react-dom/client';import {DensityLens} from '../../src/components/ui/DensityLens';import {GravityParticleBurst} from '../../src/components/ui/GravityParticleBurst';
const burst=new URLSearchParams(location.search).has('burst');createRoot(document.body.appendChild(document.createElement('div'))).render(<div id="reference" style={{padding:16}}>{burst?<>
          <div className="py-12 flex flex-col items-center gap-4">
            <GravityParticleBurst >Commit release</GravityParticleBurst>
            <p className="text-xs text-[#6B6B6B]">Click or tap to emit gravity-driven particles.</p>
          </div>
        </>:<>
          <div className="py-4 sm:py-6 w-full max-w-xl mx-auto overflow-hidden">
            <DensityLens lensSize={140} zoomScale={2}>
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] space-y-3 sm:space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#1F1F1F] pb-2.5">
                  <h4 className="text-xs font-semibold text-[#FAFAFA] font-mono leading-tight">
                    Microservice Cluster Topology
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                    STATUS: HEALTHY
                  </span>
                </div>
                <p className="text-xs text-[#A1A1A1] leading-relaxed break-words">
                  Hover your cursor across this surface to inspect sub-pixel details, high-density telemetry data, and underlying node architecture without expanding layout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[10px] font-mono text-[#6B6B6B]">
                  <div className="p-2 rounded bg-[#141414] border border-[#1F1F1F] truncate text-[#A1A1A1]" title="NODE_US_EAST_1">
                    NODE_US_EAST_1
                  </div>
                  <div className="p-2 rounded bg-[#141414] border border-[#1F1F1F] truncate text-[#A1A1A1]" title="NODE_EU_CENTRAL">
                    NODE_EU_CENTRAL
                  </div>
                  <div className="p-2 rounded bg-[#141414] border border-[#1F1F1F] truncate text-[#A1A1A1]" title="NODE_AP_SOUTH">
                    NODE_AP_SOUTH
                  </div>
                </div>
              </div>
            </DensityLens>
          </div>
        </>}</div>);