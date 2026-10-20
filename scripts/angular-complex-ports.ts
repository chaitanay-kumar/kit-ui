import {aiResponsePort} from './angular-ai-response';
import {chatPort} from './angular-chat';
import {smartComparisonPort} from './angular-smart-comparison';
import {pricingPort} from './angular-pricing';
import {dependencyTracePort} from './angular-dependency-trace';
import { advancedDataTablePort } from './angular-data-table';
/** Native implementations for components with independent state/data contracts. */
export const COMPLEX_PORTS = [
  advancedDataTablePort,
  dependencyTracePort,
  pricingPort,
  smartComparisonPort,
  chatPort,
  aiResponsePort,
];
