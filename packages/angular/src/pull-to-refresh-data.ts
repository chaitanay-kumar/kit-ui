/** Native data/math contract shared with the React financial card. */
export type PullStatus = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'complete';

export interface PullState {
  status: PullStatus;
  pullDistance: number;
  progress: number;
  threshold: number;
}

export interface FinancialDataPoint {
  value: number;
  displayValue: string;
  change: string;
  context: string;
  high?: string;
  low?: string;
  volume?: string;
  points: number[];
  timestamps?: string[];
}

export const DEFAULT_FINANCIAL_DATA: Record<string, FinancialDataPoint> = {
  '1H': {
    value: 42318.5,
    displayValue: '$42,318.50',
    change: '+128.30 · 0.3%',
    context: 'last hour',
    high: '$42,580.00',
    low: '$42,012.40',
    volume: '$180.6M',
    points: [35, 38, 42, 40, 48, 46, 54, 52, 60, 68, 72, 75],
    timestamps: ['11:00 AM', '11:05 AM', '11:10 AM', '11:15 AM', '11:20 AM', '11:25 AM', '11:30 AM', '11:35 AM', '11:40 AM', '11:45 AM', '11:50 AM', '12:00 PM'],
  },
  '4H': {
    value: 41742.85,
    displayValue: '$41,742.85',
    change: '+462.10 · 1.1%',
    context: 'last 4 hrs',
    high: '$42,150.00',
    low: '$40,920.50',
    volume: '$512.4M',
    points: [25, 28, 36, 32, 44, 42, 50, 48, 58, 64, 70, 78],
    timestamps: ['08:00 AM', '08:20 AM', '08:40 AM', '09:00 AM', '09:20 AM', '09:40 AM', '10:00 AM', '10:20 AM', '10:40 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
  },
  '1D': {
    value: 43128.4,
    displayValue: '$43,128.40',
    change: '+982.55 · 2.3%',
    context: 'today',
    high: '$43,510.20',
    low: '$41,840.75',
    volume: '$1.08B',
    // Multi-crest wave climbing up to the top right endpoint
    points: [16, 20, 26, 24, 32, 36, 34, 52, 46, 60, 56, 62, 68, 80],
    timestamps: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '21:00', '22:00', '23:59'],
  },
};

export function generateSmoothPath(
  data: number[],
  width = 320,
  height = 110,
  paddingX = 12,
  paddingY = 14
) {
  if (!data || data.length < 2) return { pathD: '', areaD: '', points: [], endpoint: { x: 0, y: 0 } };

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, i) => {
    const x = paddingX + (i / (data.length - 1)) * usableWidth;
    const normalizedY = (val - minVal) / range;
    const y = height - paddingY - normalizedY * usableHeight;
    return { x, y, raw: val };
  });

  let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  const lastPoint = points[points.length - 1];
  const areaD = `${pathD} L ${lastPoint.x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  return { pathD, areaD, points, endpoint: lastPoint };
}

/** Source demo simulation; inject randomness for deterministic engine checks. */
export const refreshDemoFinancialData=(prev:Record<string,FinancialDataPoint>,random:()=>number=Math.random):Record<string,FinancialDataPoint>=>{
          const deltaMultiplier = random() * 0.035 - 0.018;
          const base1D = prev['1D'].value * (1 + deltaMultiplier);
          const changeVal = base1D - 42145.85;
          const changePct = (changeVal / 42145.85) * 100;
          const sign = changeVal >= 0 ? '+' : '−'; // U+2212 minus, never "+-"
          const pctSign = changePct >= 0 ? '+' : '−';
          return {
            ...prev,
            '1D': {
              ...prev['1D'],
              value: base1D,
              displayValue: `$${base1D.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              change: `${sign}${Math.abs(changeVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · ${pctSign}${Math.abs(changePct).toFixed(1)}%`,
              points: prev['1D'].points.map((p) =>
                Math.max(12, Math.min(92, p + (random() * 6 - 3)))
              ),
            },
          };
        };

export function calculateDampedPull(rawDeltaY:number,threshold=68,maxPull=110,resistance=.45):number{
 if(rawDeltaY<=0)return 0;
 const factor=1-Math.exp(-(rawDeltaY*resistance)/threshold);
 return Math.min(maxPull,maxPull*factor);
}
