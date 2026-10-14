import '../../src/styles/index.css';import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import {StackUnfoldPanel} from '../../src/components/ui/StackUnfoldPanel';import {SettleModal} from '../../src/components/ui/SettleModal';
const SettleModalDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-xs font-medium cursor-pointer"
      >
        Open modal
      </button>
      <SettleModal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm archive"
        description="This will archive the project and notify collaborators."
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] text-xs font-medium cursor-pointer"
            >
              Archive
            </button>
          </>
        }
      />
    </>
  );
};


const api=window as any;api.referenceRoot?.unmount();api.referenceRoot=createRoot(document.body.appendChild(document.createElement("div")));api.referenceRoot.render(<div id="reference" style={{padding:16}}>{location.search.includes("modal")?<div className="py-12 flex flex-col items-center justify-center"><SettleModalDemo/></div>:<>
          <div className="py-6 w-full max-w-lg mx-auto">
            <StackUnfoldPanel
              
              cards={[
                {
                  id: '1',
                  title: 'Edge Compute Engine',
                  subtitle: 'v2.4.0 High-throughput pipeline',
                  content: 'Lightweight V8 isolates execute with zero cold-starts and under 5ms execution overhead globally.',
                  badge: 'Core',
                },
                {
                  id: '2',
                  title: 'Zero-Allocation Parser',
                  subtitle: 'Binary protocol serializer',
                  content: 'Stream-based decoding without heap allocation penalty, optimizing CPU utilization during peak traffic.',
                  badge: 'Protocol',
                },
                {
                  id: '3',
                  title: 'Cryptographic Attestation',
                  subtitle: 'Hardware TPM integrity',
                  content: 'Hardware-verified boot trust and per-request cryptographic telemetry verification.',
                  badge: 'Security',
                },
              ]}
            />
          </div>
        </>}</div>);