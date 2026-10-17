export interface StoryCard {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  href?: string;
  ctaLabel?: string;
}

export const DEFAULT_STORY_CARDS: StoryCard[] = [
  {
    id: 1,
    title: 'Annual letter 2025',
    description:
      'We survived another year of meetings, deadlines, bugs, and pretending everything was part of the plan.',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Modern office interior',
    href: '/annual-letter',
    ctaLabel: 'Read the damage',
  },
  {
    id: 2,
    title: 'Building for the future',
    description:
      'A deep dive into how we build things nobody asked for, then spend three weeks fixing them.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Team collaborating in an office',
    href: '/stories/future',
    ctaLabel: 'See the chaos',
  },
  {
    id: 3,
    title: 'Inside the journey',
    description:
      "One person's inspiring journey from 'this should be easy' to 47 browser tabs and a Stack Overflow account.",
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Person exploring a landscape',
    href: '/stories/journey',
    ctaLabel: 'Join the adventure',
  },
  {
    id: 4,
    title: 'The internet economy',
    description:
      'An extremely serious investigation into why everything costs money, including things that used to be free.',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Technology infrastructure',
    href: '/stories/economy',
    ctaLabel: 'Understand capitalism',
  },
];
