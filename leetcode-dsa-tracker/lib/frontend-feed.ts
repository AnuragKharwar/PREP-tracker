export type FeedTopic = {
  rank: number;
  topic: string;
  mentions: number;
  sources: string[];
  why: string;
};

export type InterviewQuestion = {
  q: string;
  source: string;
  hot: boolean;
};

export type FrontendQuestionGroups = {
  javascript: InterviewQuestion[];
  react: InterviewQuestion[];
  systemDesign: InterviewQuestion[];
  machineCoding: InterviewQuestion[];
  behavioral: InterviewQuestion[];
};

export type FrontendResource = {
  name: string;
  url: string;
  category: string;
  note: string;
  hot: boolean;
};

export const FE_HOT_TOPICS: FeedTopic[] = [
  {
    rank: 1,
    topic: "React Reconciliation & Fiber",
    mentions: 6,
    sources: ["Paytm R3", "Upstox R1", "Uber R1", "Rippling R1", "PhonePe R2", "Aakash Jain post"],
    why: "Top senior differentiator. Every SDE2 frontend loop hits this.",
  },
  {
    rank: 2,
    topic: "debounce / throttle (implement from scratch)",
    mentions: 5,
    sources: ["Paytm OA", "Upstox R1", "Rippling R1", "PhonePe OA", "40Q List"],
    why: "Most common coding question across all companies.",
  },
  {
    rank: 3,
    topic: "useCallback, useMemo, React.memo",
    mentions: 5,
    sources: ["Paytm R3", "Upstox R2", "Navi R2", "40Q List", "Aakash Jain post"],
    why: "Performance optimisation — always a follow-up.",
  },
  {
    rank: 4,
    topic: "this keyword & bind / polyfill for bind",
    mentions: 4,
    sources: ["Rippling R1", "Upstox R1", "40Q List Q9", "40Q List Q10"],
    why: "Rippling literally asked this + polyfill in same round.",
  },
  {
    rank: 5,
    topic: "Closures with real-world example",
    mentions: 4,
    sources: ["Upstox R1", "40Q List Q4", "Aryan prep post", "Namaste JS"],
    why: "Classic deep-dive. Needs a real-world use-case, not textbook.",
  },
  {
    rank: 6,
    topic: "Infinite Scroll (IntersectionObserver)",
    mentions: 4,
    sources: ["Paytm R3", "React LLD Q1", "40Q List Q22", "Aryan prep post"],
    why: "Machine coding + system design overlap — very high ROI.",
  },
  {
    rank: 7,
    topic: "SSR vs CSR vs Streaming",
    mentions: 3,
    sources: ["PhonePe R2", "40Q List Q30", "Aakash Jain post"],
    why: "Next.js wave — every company now asks rendering strategy.",
  },
  {
    rank: 8,
    topic: "State management: Redux vs Context vs Zustand",
    mentions: 3,
    sources: ["40Q List Q28", "Aakash Jain post", "Aryan prep post"],
    why: "Architecture question. Wrong answer = red flag at senior level.",
  },
  {
    rank: 9,
    topic: "LRU Cache (design + implement)",
    mentions: 3,
    sources: ["40Q List Q36", "Paytm R3", "Linked List section"],
    why: "Both DSA + system design. Two-in-one signal.",
  },
  {
    rank: 10,
    topic: "Web Vitals (LCP, CLS, INP) optimization",
    mentions: 2,
    sources: ["40Q List Q24", "Aryan prep post"],
    why: "Performance round staple for product companies.",
  },
  {
    rank: 11,
    topic: "Event Loop: microtask vs macrotask",
    mentions: 2,
    sources: ["40Q List Q1", "Aryan prep post"],
    why: "JS fundamentals — always appears in R1 screening.",
  },
  {
    rank: 12,
    topic: "Promise.all / promises in series (polyfill)",
    mentions: 2,
    sources: ["40Q List Q2", "PhonePe R2"],
    why: "Async mastery check. Surprisingly many candidates fail this.",
  },
  {
    rank: 13,
    topic: "Virtualization for large lists (react-window)",
    mentions: 2,
    sources: ["Paytm R3", "Aryan prep post"],
    why: "10k+ rows scenario — must know virtualization approach.",
  },
  {
    rank: 14,
    topic: "XSS, CSRF, secure auth flows",
    mentions: 2,
    sources: ["40Q List Q29", "Aakash Jain post"],
    why: "Security round — fintech companies (Paytm, Razorpay) ask this.",
  },
];

export const FE_RESOURCES: FrontendResource[] = [
  {
    name: "javascript.info",
    url: "https://javascript.info",
    category: "JavaScript",
    note: "Best deep JS resource — engine internals, closures, async, prototype chain",
    hot: true,
  },
  {
    name: "Namaste JavaScript — Akshay Saini (YT)",
    url: "https://www.youtube.com/@akshaymarch7",
    category: "JavaScript",
    note: "Mentioned by 3+ people. Event loop, closures, this, prototypes — each topic in depth",
    hot: true,
  },
  {
    name: "react.dev/learn",
    url: "https://react.dev/learn",
    category: "React",
    note: "Official React docs — hooks, rendering lifecycle, state management best practices",
    hot: true,
  },
  {
    name: "bigfrontend.dev",
    url: "https://bigfrontend.dev",
    category: "Practice",
    note: "Implement debounce, throttle, Promise.all — exactly what real frontend coding rounds ask",
    hot: true,
  },
  {
    name: "greatfrontend.com",
    url: "https://greatfrontend.com",
    category: "Practice",
    note: "Frontend system design + coding. Mentioned in Paytm interview experience post",
    hot: true,
  },
  {
    name: "patterns.dev",
    url: "https://patterns.dev",
    category: "System Design",
    note: "Frontend design patterns — rendering, performance, component patterns",
    hot: true,
  },
  {
    name: "Piyush Agarwal — FE Machine Coding (YT)",
    url: "https://www.youtube.com/@piyushgarg_dev",
    category: "Machine Coding",
    note: "Frontend machine coding & system design. Mentioned by multiple people in your feed",
    hot: true,
  },
  {
    name: "NeetCode 150",
    url: "https://neetcode.io/practice",
    category: "DSA",
    note: "Curated 150 DSA questions with video solutions. Mentioned as key resource.",
    hot: true,
  },
  {
    name: "Striver A2Z DSA Sheet",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/",
    category: "DSA",
    note: "Comprehensive DSA sheet. Mentioned alongside NeetCode as the go-to.",
    hot: true,
  },
  {
    name: "Shrayansh Jain — LLD/HLD (YT)",
    url: "https://www.youtube.com/@ConceptandCoding",
    category: "System Design",
    note: "LLD & HLD. Mentioned in '10 videos you need for SE' post",
    hot: false,
  },
  {
    name: "roadmap.sh/frontend",
    url: "https://roadmap.sh/frontend",
    category: "Roadmap",
    note: "Visual frontend learning roadmap — good for identifying gaps",
    hot: false,
  },
  {
    name: "roadmap.sh/react",
    url: "https://roadmap.sh/react",
    category: "Roadmap",
    note: "React-specific roadmap",
    hot: false,
  },
  {
    name: "devchallenges.io",
    url: "https://devchallenges.io",
    category: "Practice",
    note: "Real frontend UI challenges for portfolio building",
    hot: false,
  },
  {
    name: "Frontend Interview Handbook",
    url: "https://frontendinterviewhandbook.com",
    category: "Reference",
    note: "Curated frontend interview questions and answers",
    hot: false,
  },
];

export const FE_INTERVIEW_QUESTIONS: FrontendQuestionGroups = {
  javascript: [
    {
      q: "Explain the JavaScript event loop. Microtasks vs macrotasks?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Implement Promise.all from scratch.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Implement debounce and throttle.",
      source: "40Q List + Paytm R1",
      hot: true,
    },
    {
      q: "Explain closures with a real-world example.",
      source: "40Q List + Upstox R1",
      hot: true,
    },
    {
      q: "How does prototypal inheritance work?",
      source: "40Q List",
      hot: false,
    },
    {
      q: "Difference between var, let, and const.",
      source: "40Q List",
      hot: false,
    },
    {
      q: "Explain shallow copy vs deep copy. Implement deep clone.",
      source: "40Q List",
      hot: false,
    },
    {
      q: "How does `this` behave in arrow functions, class methods, event handlers?",
      source: "40Q List + Rippling R1 + Upstox R1",
      hot: true,
    },
    {
      q: "Explain call, apply, and bind with use cases.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Write a polyfill for bind.",
      source: "Rippling R1",
      hot: true,
    },
    {
      q: "Implement a pub-sub / state subscription system.",
      source: "Rippling R1",
      hot: false,
    },
    {
      q: "What is the difference between Promises and async/await?",
      source: "Navi R2",
      hot: false,
    },
    {
      q: "Execute promises in series (not parallel).",
      source: "PhonePe R2",
      hot: true,
    },
    {
      q: "Flatten a nested array with custom ordering (top-level first).",
      source: "Rippling R1",
      hot: false,
    },
    {
      q: "Memory leaks & garbage collection in JavaScript.",
      source: "Aryan's prep list",
      hot: false,
    },
  ],
  react: [
    {
      q: "What is reconciliation? How does React diffing work?",
      source: "40Q List + Paytm R3 + Aakash Jain",
      hot: true,
    },
    {
      q: "What causes unnecessary re-renders in React?",
      source: "40Q List + Paytm R3",
      hot: true,
    },
    {
      q: "Explain useEffect deeply — cleanup, dependency array pitfalls.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Difference between useMemo and useCallback.",
      source: "40Q List + Paytm R3",
      hot: true,
    },
    {
      q: "When would you use React.memo?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "What is state batching? What changed in React 18?",
      source: "40Q List + Paytm R3",
      hot: true,
    },
    {
      q: "How does React Context work? When can it hurt performance?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Build a custom hook like useDebounce or useFetch.",
      source: "40Q List + React LLD",
      hot: true,
    },
    {
      q: "How does React Fiber architecture work and why does it matter?",
      source: "Aakash Jain + Paytm R3",
      hot: true,
    },
    {
      q: "React 18: Concurrent Rendering, Suspense, useTransition.",
      source: "Aakash Jain + Paytm R3",
      hot: true,
    },
    {
      q: "Why are keys important in lists?",
      source: "40Q List",
      hot: false,
    },
    {
      q: "Controlled vs uncontrolled components.",
      source: "40Q List + React LLD",
      hot: false,
    },
    {
      q: "Server Components: Client vs Server, impact on DX & performance.",
      source: "Aakash Jain",
      hot: false,
    },
    {
      q: "How does React handle hydration mismatches and streaming SSR?",
      source: "Aakash Jain",
      hot: false,
    },
    {
      q: "Profiling with React DevTools flamegraph.",
      source: "Paytm R3",
      hot: false,
    },
  ],
  systemDesign: [
    {
      q: "Design an autocomplete search with debouncing and caching.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Design an infinite scrolling feed (IntersectionObserver, skeleton loaders).",
      source: "40Q List + Paytm R3 + React LLD",
      hot: true,
    },
    {
      q: "How would you optimize a slow React application?",
      source: "40Q List + Aakash Jain",
      hot: true,
    },
    {
      q: "How would you improve Web Vitals (LCP, CLS, INP)?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "How would you handle API failures, retries, and exponential backoff?",
      source: "40Q List + Paytm R2",
      hot: true,
    },
    {
      q: "Redux vs Context vs Zustand — decide for a large-scale app.",
      source: "40Q List + Aakash Jain",
      hot: true,
    },
    {
      q: "How would you prevent XSS, CSRF, token leakage in a frontend app?",
      source: "40Q List + Aakash Jain",
      hot: true,
    },
    {
      q: "SSR vs SSG vs hydration strategy — when to use each?",
      source: "40Q List + PhonePe R2",
      hot: true,
    },
    {
      q: "Build a reusable payment status tracker (Polling vs WebSockets).",
      source: "Paytm R2",
      hot: false,
    },
    {
      q: "Optimize 10k+ row list with virtualization (react-window).",
      source: "Paytm R3 + Aryan's prep",
      hot: true,
    },
    {
      q: "Bundle splitting / code splitting strategy for large SPA.",
      source: "Aryan's prep + Aakash Jain",
      hot: false,
    },
    {
      q: "Design a reusable component library for a large team.",
      source: "40Q List + Paytm R2",
      hot: false,
    },
    {
      q: "Design a role-based access UI system.",
      source: "Aryan's prep",
      hot: false,
    },
  ],
  machineCoding: [
    {
      q: "Build a JIRA/Trello-like board with drag-and-drop.",
      source: "Navi R1 (2 hours)",
      hot: true,
    },
    {
      q: "Build an infinite scroll list with skeleton loaders.",
      source: "Paytm R3",
      hot: true,
    },
    {
      q: "Build a search with live filtering (debounced).",
      source: "React LLD + Upstox R2",
      hot: true,
    },
    {
      q: "Implement drag-and-drop list reordering.",
      source: "React LLD + Navi R1",
      hot: true,
    },
    {
      q: "Build a progress bar with queue behavior (next starts after current).",
      source: "Navi R2",
      hot: false,
    },
    {
      q: "Build a Pool Widget (progress bars, conditional rendering, dynamic styling).",
      source: "Uber R1 (60 mins)",
      hot: false,
    },
    {
      q: "Build a stock watchlist: add/remove stocks, search functionality.",
      source: "Upstox R2",
      hot: false,
    },
    {
      q: "Build a multi-step form with state management.",
      source: "React LLD",
      hot: false,
    },
    {
      q: "Implement lazy loading (React.lazy + Suspense).",
      source: "React LLD",
      hot: false,
    },
  ],
  behavioral: [
    {
      q: "Explain a frontend project you built end-to-end.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Describe the hardest production bug you fixed.",
      source: "40Q List",
      hot: true,
    },
    {
      q: "How do you balance performance vs feature delivery?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "How do you handle disagreements in technical decisions?",
      source: "40Q List",
      hot: true,
    },
    {
      q: "Describe a time you took ownership despite external dependencies.",
      source: "Paytm R4",
      hot: false,
    },
    {
      q: "How do you ensure code quality and reliability in fast-moving teams?",
      source: "Paytm R4",
      hot: false,
    },
    {
      q: "Tell me about a time you mentored a junior engineer.",
      source: "Paytm R4",
      hot: false,
    },
  ],
};
