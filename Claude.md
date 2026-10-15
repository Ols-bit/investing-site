# Project: Beginner investing education site
- Audience: complete beginners learning to invest
- Stack: Next.js, TypeScript, Tailwind, lessons in MDX under /content/lessons
- Tone: calm, clear, no jargon without explanation
- Rules: educational only, never tell users what to buy; add a "not financial advice" disclaimer on every page; cite sources on each lesson
- Work in small steps and explain what you change
PROJECT RULES (apply to every task):
- Before writing code, review the existing structure, components, design system and conventions, and match them. Don't restyle or rewrite anything that already works.
- Visual style: flat, bold and playful. Chunky display font for headings, clean body font, a limited flat colour palette defined as CSS variables. NO emojis, NO gradients, NO glassmorphism, NO glowing blobs, NO filler badges, NO rows of identical icon cards, NO generic marketing copy.
- All API keys stay server-side in route handlers. Never expose secrets to the browser. Read localStorage only after mount to avoid hydration mismatches.
- Everything must be responsive, accessible (contrast, focus states, keyboard support) and respect prefers-reduced-motion.
- Handle loading, empty and error states in the site's style.
- Educational content only, never financial advice. Keep a "not financial advice" note where relevant.
- When finished: make sure `npm run build` passes with no errors or type warnings, and summarise the new files, routes and any environment variables needed.