export interface PricingFeature{label:string;description?:string}
export interface PricingTier{name:string;tagline?:string;price:string;cadence:string;features:(string|PricingFeature)[];ctaLabel:string;onCtaClick?:()=>void}
export const DEFAULT_FREE_TIER:PricingTier={name:'Free',tagline:'For personal & open-source projects',price:'$0',cadence:'Forever',features:['All components','Copy & paste','React + Tailwind','MIT licensed'],ctaLabel:'Get started'};
export const DEFAULT_PRO_TIER:PricingTier={name:'Pro',tagline:'For production teams',price:'$129',cadence:'One-time payment',features:['Everything in Free','Premium components','Advanced animations','Future updates'],ctaLabel:'Get Pro'};
