/**
 * Knowledge Base for Ask-Me-Anything Chatbot
 * Provides answers to common questions about Softwar and Bitcoin
 */

export interface KnowledgeEntry {
  question: string;
  answer: string;
  relatedLessons: string[];
  category: 'softwar' | 'bitcoin' | 'general';
}

export const knowledgeBase: KnowledgeEntry[] = [
  // Softwar concepts
  {
    question: "what is power projection",
    answer: "Power projection is the ability to demonstrate control over resources by imposing physical costs on challengers. Throughout evolution and human history, those who can credibly signal 'attacking me will be expensive for you' gain strategic advantages. This applies across all domains—land, sea, air, space, and now cyberspace with Bitcoin.",
    relatedLessons: ["/learn/executive-summary", "/learn/ch3"],
    category: "softwar"
  },
  {
    question: "what is proof-of-work",
    answer: "Proof-of-Work is a cyber security system that requires expending real physical energy (electricity) to validate transactions and secure a network. Bitcoin miners compete to solve complex mathematical puzzles, and the winner gets to add the next block to the blockchain. This makes attacking the Bitcoin network prohibitively expensive because you'd need to outspend the entire global mining industry.",
    relatedLessons: ["/fundamentals/2-how-bitcoin-works", "/learn/ch5"],
    category: "bitcoin"
  },
  {
    question: "what is softwar",
    answer: "Softwar is the projection of physical power in, from, and through cyberspace via proof-of-work protocols. Unlike traditional warfare (using kinetic weapons), softwar uses hash power (computational work) to secure digital resources. It's non-lethal warfare where nations compete by burning electricity instead of killing people.",
    relatedLessons: ["/learn/ch5", "/learn/conclusion"],
    category: "softwar"
  },
  {
    question: "what is the electro-cyber dome",
    answer: "The Electro-Cyber Dome is a protective barrier created by Bitcoin's cumulative hash power. Just as missile defense systems create a physical dome over territory, proof-of-work creates a barrier requiring massive physical cost (electricity expenditure) to breach. The longer Bitcoin exists and the more hash power secures it, the more expensive attacks become.",
    relatedLessons: ["/learn/ch5"],
    category: "softwar"
  },
  {
    question: "why does decentralization matter for security",
    answer: "Decentralization prevents any single authority from controlling the system. In centralized systems, whoever controls the center (a CEO, government, administrator) can change rules, censor users, or confiscate assets. Bitcoin's decentralization means no one person can alter it—you'd need to convince thousands of independent miners and node operators worldwide. This makes it resistant to both technical attacks and political pressure.",
    relatedLessons: ["/fundamentals/1-introduction-to-bitcoin", "/learn/ch5"],
    category: "general"
  },
  {
    question: "what is mutually assured preservation",
    answer: "Mutually Assured Preservation (MAP) is Bitcoin's alternative to nuclear Mutually Assured Destruction (MAD). While MAD creates peace through fear of annihilation, MAP creates security through shared economic benefit. Everyone who holds bitcoin benefits from everyone else's mining investment—your mining secures my bitcoins and vice versa. It's positive-sum security instead of zero-sum deterrence.",
    relatedLessons: ["/learn/ch5", "/learn/conclusion"],
    category: "softwar"
  },
  {
    question: "what is the bcr_a",
    answer: "BCR_A is the Benefit-to-Cost Ratio of Attack. It's calculated as: Benefits of attacking ÷ Costs of attacking. If BCR_A > 1, the attack is profitable and likely happens. If BCR_A < 1, the attack is unprofitable and gets deterred. This is the fundamental economic calculation governing conflict in nature and human society. Bitcoin works by making BCR_A approach zero—attacks cost more than they could ever gain.",
    relatedLessons: ["/learn/ch3", "/learn/ch5"],
    category: "softwar"
  },
  {
    question: "why is bitcoin important for national security",
    answer: "Bitcoin provides the first way to physically secure digital resources without centralized authority. Just as nations need militaries to protect physical territory, they need ways to protect cyberspace resources (data, digital property, communications). Bitcoin's proof-of-work makes cyber attacks physically expensive, giving nations a defensive technology that doesn't require killing. It's strategic infrastructure for the digital age.",
    relatedLessons: ["/learn/executive-summary", "/learn/conclusion"],
    category: "softwar"
  },
  {
    question: "what is the 21 million cap",
    answer: "Bitcoin has a hard-coded limit of 21 million coins that will ever exist. This makes it similar to gold—scarce and unforgeable. Unlike government currencies that can be printed infinitely (causing inflation), Bitcoin's supply is mathematically guaranteed. New bitcoins are created through mining, but the rate halves every 4 years until reaching the 21M limit around year 2140.",
    relatedLessons: ["/fundamentals/3-bitcoin-economics"],
    category: "bitcoin"
  },
  {
    question: "how does bitcoin mining work",
    answer: "Miners use specialized computers to solve complex mathematical puzzles. The first miner to solve the puzzle gets to add a new block of transactions to the blockchain and receives newly created bitcoin as a reward. This process requires massive amounts of electricity, making it expensive to fake or attack. The difficulty automatically adjusts every 2 weeks to maintain a steady rate of one block every 10 minutes.",
    relatedLessons: ["/fundamentals/2-how-bitcoin-works"],
    category: "bitcoin"
  },
  {
    question: "what is grounded theory",
    answer: "Grounded Theory is the research methodology used for the Softwar thesis. Instead of starting with a hypothesis and testing it, Grounded Theory builds explanations by systematically analyzing data from multiple sources. Lowery used this approach because Bitcoin's strategic significance spans multiple disciplines (biology, military strategy, computer science) and no existing framework adequately explained it.",
    relatedLessons: ["/learn/ch2"],
    category: "softwar"
  },
  {
    question: "why do humans need antlers",
    answer: "This is a metaphor from Chapter 4. Just as male elk grow antlers annually to signal strength without fighting, humans need costly power projection technologies (like nuclear weapons or Bitcoin) to deter attacks without war. Antlers are 'unforgeable' proof-of-work—only healthy elk can afford to grow large antlers. Similarly, Bitcoin mining is unforgeable proof that you've expended real energy, creating credible deterrence.",
    relatedLessons: ["/learn/ch3", "/learn/ch4"],
    category: "softwar"
  }
];

/**
 * Find best matching answer for a user question
 */
export function findAnswer(userQuestion: string): KnowledgeEntry | null {
  const normalized = userQuestion.toLowerCase().trim();

  // Direct match
  for (const entry of knowledgeBase) {
    if (normalized.includes(entry.question)) {
      return entry;
    }
  }

  // Keyword match
  const keywords = normalized.split(' ').filter(w => w.length > 3);
  let bestMatch: { entry: KnowledgeEntry; score: number } | null = null;

  for (const entry of knowledgeBase) {
    const questionWords = entry.question.split(' ');
    let score = 0;

    for (const keyword of keywords) {
      if (questionWords.some(w => w.includes(keyword) || keyword.includes(w))) {
        score++;
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }

  return bestMatch ? bestMatch.entry : null;
}

/**
 * Get suggested questions by category
 */
export function getSuggestedQuestions(category?: 'softwar' | 'bitcoin' | 'general'): string[] {
  const entries = category
    ? knowledgeBase.filter(e => e.category === category)
    : knowledgeBase;

  return entries.slice(0, 5).map(e => {
    // Convert to friendly question format
    const words = e.question.split(' ');
    return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '?';
  });
}
