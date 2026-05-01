/**
 * Widely cited motivational quotes (English) + Unsplash imagery.
 * Rotates by calendar day. Images: https://unsplash.com/license
 */

export type MotivationQuote = {
  quote: string;
  author: string;
  /** Hotlinked Unsplash CDN — attribution appreciated */
  imageUrl: string;
  imageAlt: string;
};

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Focused work at a laptop by a window",
  },
  {
    quote:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Mountain peaks above the clouds",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Sunrise over mountains and valley",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    imageUrl:
      "https://images.unsplash.com/photo-1483728642387-6ccf3bebf549?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Alpine lake and rocky peaks",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Starry sky over snow-covered mountains",
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas A. Edison",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Electronic circuit board macro",
  },
  {
    quote: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Digital globe and network imagery",
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-9e038871aa2a?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Notebook and planning on a desk",
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    imageUrl:
      "https://images.unsplash.com/photo-1434030210611-70e44f935804?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Running track lanes",
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    imageUrl:
      "https://images.unsplash.com/photo-1547347298-4074fc308dbc?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Ice hockey rink under bright lights",
  },
  {
    quote: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "Thomas Edison",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Books and study materials",
  },
  {
    quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    imageUrl:
      "https://images.unsplash.com/photo-1470071459606-704ee45203d2?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Misty forest path",
  },
  {
    quote: "Our greatest weakness lies in giving up.",
    author: "Thomas A. Edison",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Modern architecture and sky",
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&q=80",
    imageAlt: "Team collaborating at a table",
  },
];

export function quoteIndexForDate(dateYmd: string): number {
  let h = 0;
  for (let i = 0; i < dateYmd.length; i++) {
    h = (h * 31 + dateYmd.charCodeAt(i)) >>> 0;
  }
  return h % MOTIVATION_QUOTES.length;
}

export function progressHint(done: number, total: number): string {
  const left = Math.max(0, total - done);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (done === 0) {
    return `You're at the trailhead—${total} questions ahead. First solve unlocks the graph.`;
  }

  if (pct < 25) {
    return `${done}/${total} solved—most of the ladder is still ahead. That's real upside.`;
  }

  if (pct < 60) {
    return `${done} locked in, ${left} still wide open—enough runway to separate from the pack.`;
  }

  if (pct < 90) {
    return `Solid base (${pct}%): tighten the long tail—review gaps matter as much as new solves.`;
  }

  return `Deep bench—only ${left} left to clear the bank. Finish with discipline, not hurry.`;
}
