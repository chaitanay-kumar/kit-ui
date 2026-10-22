// Same example as AIResponseLiveShowcase; independently owned native state.
export const responseMarkdown = `# Component Analysis & Optimization

Based on the verified codebase audit, here is the recommended architecture for **Kit UI** motion integration:

> All spring transitions must be imported directly from the unified motion tokens file to maintain 60fps hardware acceleration and physical consistency.

### Implementation Example

\`\`\`typescript
import { motionTransitions } from '@/lib/motion-tokens';

export const cardAnimation = {
  whileHover: { scale: 1.02, y: -2 },
  transition: motionTransitions.springSnappy,
};
\`\`\`

### Verification Checklist
- Respects \`prefers-reduced-motion\` media queries.
- Utilizes CSS variables for zero-flash dark and light theme switching.
- Standardized accessible focus-visible rings with 2px offset.

Feel free to request a custom benchmark or bundle size breakdown.`;
