export interface ReflectionPrompt {
  id: string;
  category: 'fundamentals' | 'softwar' | 'general';
  text: string;
  tags: string[];
  linkedConcepts?: string[];
}

export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Bitcoin Fundamentals
  {
    id: 'fund-1',
    category: 'fundamentals',
    text: 'In one paragraph, explain what decentralization means and one place I\'d want it in my life.',
    tags: ['decentralization', 'basics'],
    linkedConcepts: ['decentralization', 'bitcoin'],
  },
  {
    id: 'fund-2',
    category: 'fundamentals',
    text: 'List 3 steps I\'ll take to secure a wallet (deadline + why each step matters).',
    tags: ['security', 'action'],
    linkedConcepts: ['private-key', 'security'],
  },
  {
    id: 'fund-3',
    category: 'fundamentals',
    text: 'How would the 21M cap change the way I save or budget this month?',
    tags: ['economics', 'personal-finance'],
    linkedConcepts: ['scarcity', 'deflation'],
  },
  {
    id: 'fund-4',
    category: 'fundamentals',
    text: 'Write a script for teaching a family member private vs public keys in 2 minutes.',
    tags: ['security', 'teaching'],
    linkedConcepts: ['private-key', 'public-key'],
  },
  {
    id: 'fund-5',
    category: 'fundamentals',
    text: 'Energy debate: one pro, one con, and what data I\'d need to decide.',
    tags: ['energy', 'critical-thinking'],
    linkedConcepts: ['mining', 'proof-of-work'],
  },
  {
    id: 'fund-6',
    category: 'fundamentals',
    text: 'If I could send $100 anywhere instantly for pennies, how would that change my relationships or opportunities?',
    tags: ['lightning', 'practical'],
    linkedConcepts: ['lightning-network', 'remittances'],
  },
  {
    id: 'fund-7',
    category: 'fundamentals',
    text: 'Notice when I need permission to use money this week. Would Bitcoin solve those frictions?',
    tags: ['freedom', 'observation'],
    linkedConcepts: ['decentralization', 'censorship-resistance'],
  },
  {
    id: 'fund-8',
    category: 'fundamentals',
    text: 'Describe one myth about Bitcoin I believed and what changed my mind.',
    tags: ['misconceptions', 'learning'],
    linkedConcepts: ['myths', 'education'],
  },
  {
    id: 'fund-9',
    category: 'fundamentals',
    text: 'In 50 years, will Bitcoin be dominant, one option among many, or obsolete? What evidence points which way?',
    tags: ['future', 'analysis'],
    linkedConcepts: ['adoption', 'future'],
  },
  {
    id: 'fund-10',
    category: 'fundamentals',
    text: 'Set a specific Bitcoin learning goal with a deadline. What will success look like?',
    tags: ['goals', 'planning'],
  },

  // Softwar
  {
    id: 'soft-1',
    category: 'softwar',
    text: 'How does proof-of-work as cost change cyber defense? One real-world analogy.',
    tags: ['pow', 'security'],
    linkedConcepts: ['proof-of-work', 'physical-cost'],
  },
  {
    id: 'soft-2',
    category: 'softwar',
    text: 'If I led a small nation, list 2 policies I\'d consider after reading Softwar and why.',
    tags: ['policy', 'strategy'],
    linkedConcepts: ['national-security', 'bitpower'],
  },
  {
    id: 'soft-3',
    category: 'softwar',
    text: 'Where could bitpower show up in daily civilian life? Speculate responsibly.',
    tags: ['bitpower', 'application'],
    linkedConcepts: ['bitpower', 'power-projection'],
  },
  {
    id: 'soft-4',
    category: 'softwar',
    text: 'Name a legacy assumption about security I now question, and the habit I\'ll change.',
    tags: ['security', 'mindset'],
    linkedConcepts: ['cyber-security', 'deterrence'],
  },
  {
    id: 'soft-5',
    category: 'softwar',
    text: 'What would \'adopt fast, adapt fast\' look like for me this week?',
    tags: ['action', 'strategy'],
    linkedConcepts: ['adoption', 'innovation'],
  },
  {
    id: 'soft-6',
    category: 'softwar',
    text: 'Compare gunpowder\'s strategic impact to Bitcoin\'s. What\'s similar? What\'s different?',
    tags: ['history', 'analysis'],
    linkedConcepts: ['power-projection', 'historical-precedents'],
  },
  {
    id: 'soft-7',
    category: 'softwar',
    text: 'Explain the Electro-Cyber Dome concept to someone without technical background.',
    tags: ['teaching', 'concepts'],
    linkedConcepts: ['electro-cyber-dome', 'hash-rate'],
  },
  {
    id: 'soft-8',
    category: 'softwar',
    text: 'What does \'physical costs in cyberspace\' mean for everyday internet use?',
    tags: ['practical', 'concepts'],
    linkedConcepts: ['physical-cost', 'proof-of-work'],
  },
  {
    id: 'soft-9',
    category: 'softwar',
    text: 'How might Clausewitz\'s \'war as politics by other means\' apply to Bitcoin?',
    tags: ['theory', 'strategy'],
    linkedConcepts: ['clausewitz', 'power-projection'],
  },
  {
    id: 'soft-10',
    category: 'softwar',
    text: 'If Bitcoin is strategic, what responsibilities do I have as a citizen?',
    tags: ['ethics', 'citizenship'],
    linkedConcepts: ['national-security', 'individual-sovereignty'],
  },

  // General
  {
    id: 'gen-1',
    category: 'general',
    text: 'What concept from this week challenged me most? Why did it feel uncomfortable?',
    tags: ['reflection', 'learning'],
  },
  {
    id: 'gen-2',
    category: 'general',
    text: 'Write a 2-minute explanation of Bitcoin for someone who asked, \'Why should I care?\'',
    tags: ['teaching', 'communication'],
  },
  {
    id: 'gen-3',
    category: 'general',
    text: 'What actions can I take this month to apply what I\'ve learned?',
    tags: ['action', 'planning'],
  },
  {
    id: 'gen-4',
    category: 'general',
    text: 'Compare Bitcoin to another technology I use daily. What parallels exist?',
    tags: ['comparison', 'understanding'],
  },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    label: 'Review seed phrase storage',
    cadence: 'weekly',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    label: '10-minute glossary review',
    cadence: 'daily',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    label: 'Re-quiz one weak chapter',
    cadence: 'weekly',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-4',
    label: 'Check Lightning wallet tx fees',
    cadence: 'weekly',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-5',
    label: 'Backup journal notes to Markdown',
    cadence: 'weekly',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Set up a practice wallet and move $10',
    description: 'Experience self-custody hands-on',
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    title: 'Write a 500-word Softwar synthesis',
    description: 'Summarize for a friend who hasn\'t read it',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-3',
    title: 'Build a budget rule inspired by 21M scarcity',
    description: 'E.g., save fixed % like Bitcoin\'s fixed supply',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

import type { Habit, Goal } from './types';
