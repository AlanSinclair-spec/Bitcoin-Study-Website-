# Softwar Learning Platform

A comprehensive, interactive learning platform for mastering **"Softwar: A Novel Theory on Power Projection and the National Strategic Significance of Bitcoin"** by Jason P. Lowery (MIT, 2023).

## Features

### 📚 Complete Content Coverage
- **Executive Summary** + 6 full chapters
- Structured lessons with key concepts, takeaways, and policy implications
- Faithful to the original thesis with proper CC BY 4.0 attribution

### 🎓 Learning Features
- **Interactive Lessons**: Chapter-by-chapter content with left sidebar navigation and right-rail quick actions
- **Flashcards**: 120+ cards with SM-2 spaced repetition algorithm
- **Quizzes**: 100+ questions (MCQ + short answer) with instant feedback and explanations
- **Glossary**: A-Z terms with cross-references to chapters
- **Figures Gallery**: Visual aids with captions and chapter links
- **Timeline**: Historical events from gunpowder to Bitcoin
- **Search**: Unified search across all content (client-side)

### 📊 Progress Tracking
- Chapter completion tracking
- Quiz score history
- Flashcard review scheduling
- Persistent storage (localStorage + optional SQLite via Prisma)

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Dark/light mode support
- Accessible (WCAG AA)
- Print-friendly chapter pages
- Keyboard shortcuts (j/k navigation)

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Content**: MDX for lesson pages with frontmatter
- **Database**: Prisma + SQLite for progress tracking
- **Search**: Lunr.js (client-side)
- **Validation**: Zod
- **PDF Processing**: pdfjs-dist
- **Testing**: Playwright

## Prerequisites

- Node.js 18+ and npm
- The thesis PDF: `lowery-jplowery-sm-sdm-2023-thesis.pdf` (place in project root)

## Getting Started

### 1. Installation

```bash
git clone <your-repo>
cd softwar-learning-platform
npm install
```

### 2. Generate Database

```bash
npm run db:generate
npm run db:migrate
```

### 3. Ingest Content (Optional)

If you have the PDF and want to regenerate content:

```bash
# Dry run (see what would be generated)
npm run ingest:dry

# Full ingestion (overwrites /content and /data)
npm run ingest
```

**Note**: Sample content is already included, so you can skip this step to get started immediately.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
softwar-learning-platform/
├── app/                      # Next.js App Router pages
│   ├── (marketing)/         # Marketing routes
│   ├── learn/               # Chapter lessons
│   │   └── [chapter]/       # Dynamic chapter pages
│   ├── quiz/[chapter]/      # Chapter quizzes
│   ├── flashcards/          # Spaced repetition flashcards
│   ├── glossary/            # Term definitions
│   ├── figures/             # Figure gallery
│   ├── timeline/            # Historical timeline
│   ├── search/              # Unified search
│   ├── sources/             # Attribution & license
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── learn/               # Learning-specific components
│   ├── quiz/                # Quiz components
│   └── flashcards/          # Flashcard components
├── content/                 # MDX content
│   ├── chapters/            # Chapter MDX files
│   └── glossary/            # Glossary markdown
├── data/                    # JSON data files
│   ├── flashcards.json      # Flashcard decks
│   ├── quizzes.json         # Quiz question banks
│   ├── figures.json         # Figure metadata
│   ├── timeline.json        # Historical events
│   └── concepts.json        # Concept-to-chapter mapping
├── lib/                     # Utilities and libraries
│   ├── content.ts           # MDX content loaders
│   ├── db.ts                # Prisma client
│   ├── utils.ts             # Utility functions
│   └── spaced-rep/          # SM-2 algorithm
│       └── sm2.ts           # Spaced repetition logic
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── scripts/                 # Build and ingestion scripts
│   └── ingest-softwar.ts    # PDF ingestion script
├── tests/                   # Playwright tests
│   └── smoke.spec.ts        # Basic smoke tests
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── README.md                # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run ingest` | Ingest PDF and generate content |
| `npm run ingest:dry` | Dry-run ingestion (show output without writing) |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run test` | Run Playwright tests |
| `npm run test:ui` | Run tests in UI mode |

## Ingestion Script

The ingestion script (`scripts/ingest-softwar.ts`) processes the thesis PDF:

### Usage

```bash
tsx scripts/ingest-softwar.ts --pdf <path-to-pdf> --out <output-dir> [--dry-run]
```

### What It Does

1. **Extracts Text**: Uses `pdfjs-dist` to extract text from PDF pages
2. **Detects Chapters**: Finds chapter boundaries via regex on headings
3. **Generates MDX**: Creates MDX files with frontmatter (title, chapter, order, tags, figures)
4. **Extracts Figures**: Parses "List of Figures" and builds `figures.json`
5. **Auto-generates Flashcards**: Creates 10-15 cards per chapter from key concepts
6. **Auto-generates Quizzes**: Creates 15-25 MCQ + 2 short-answer questions per chapter
7. **Builds Timeline**: Extracts historical references and dates
8. **Builds Concepts Map**: Maps core concepts to chapter occurrences
9. **Generates Glossary**: Identifies and defines key terms

### Output

- `/content/chapters/*.mdx` – Chapter lesson files
- `/data/flashcards.json` – All flashcards
- `/data/quizzes.json` – All quiz questions
- `/data/figures.json` – Figure metadata
- `/data/timeline.json` – Historical timeline
- `/data/concepts.json` – Concept mapping

### Heuristics & Limitations

The script uses heuristic parsing:
- Chapter detection via regex (may miss non-standard headings)
- Flashcard generation from sentences containing core concepts
- Quiz questions templated from chapter content
- Manual refinement recommended for production use

### TODOs for Refinement

- [ ] Improve chapter boundary detection for non-standard formats
- [ ] Enhance flashcard generation with more sophisticated NLP
- [ ] Add more diverse quiz question templates
- [ ] Extract actual images from PDF (currently captions only)
- [ ] Implement more robust glossary term extraction

## Editing Content

### Adding/Editing Chapters

1. Edit MDX files in `/content/chapters/`
2. Frontmatter format:

```yaml
---
title: "Chapter Title"
chapter: "ch1"
order: 1
tags: ["tag1", "tag2"]
figures: ["fig-1-1", "fig-1-2"]
---
```

3. Use standard Markdown + MDX components

### Adding/Editing Flashcards

Edit `/data/flashcards.json`:

```json
{
  "id": "unique-id",
  "chapterId": "ch1",
  "front": "Question text",
  "back": "Answer text",
  "tags": ["tag1", "tag2"]
}
```

### Adding/Editing Quizzes

Edit `/data/quizzes.json`:

```json
{
  "id": "unique-id",
  "chapterId": "ch1",
  "type": "mcq",
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "Why A is correct",
  "section": "Chapter 1 - Section Name"
}
```

## Progress Export

Progress is stored in:
- **localStorage**: Flashcard reviews, chapter completion (client-side)
- **SQLite**: Quiz attempts, user settings (via Prisma, optional)

### Export Progress

```javascript
// In browser console:
const reviews = localStorage.getItem('flashcard-reviews-anonymous');
console.log(JSON.parse(reviews));
```

## Testing

Basic Playwright smoke tests:

```bash
# Run tests
npm run test

# Interactive UI mode
npm run test:ui
```

Tests cover:
- Homepage navigation
- Chapter lesson loading
- Quiz flow
- Flashcard review
- Search functionality

## Attribution & License

### Original Work

**Title**: Softwar: A Novel Theory on Power Projection and the National Strategic Significance of Bitcoin
**Author**: Jason P. Lowery
**Institution**: MIT, System Design and Management
**Year**: 2023
**License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

### This Platform

This learning platform adapts the original thesis for educational purposes. All content is derived from the thesis and licensed under the same CC BY 4.0 terms.

### Critical Perspectives

The platform includes a "Critiques & Open Questions" section to encourage critical thinking. Students should evaluate:
- Speculative nature of strategic claims
- Proof-of-Work sustainability and centralization risks
- Practicality of implementation
- Alternative consensus mechanisms and security approaches

See `/app/sources/page.tsx` for full attribution and critique discussion.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the ingestion script TODOs for known limitations

## Roadmap

- [ ] Full Lunr.js search index implementation
- [ ] Advanced progress analytics dashboard
- [ ] Export flashcards to Anki
- [ ] Multi-user support with authentication
- [ ] Discussion forums per chapter
- [ ] Integrated note-taking
- [ ] Mobile app (React Native)

## Acknowledgments

- Jason P. Lowery for the original thesis
- MIT SDM program
- shadcn/ui for component library
- Next.js team for the framework
- Vercel for deployment platform (if applicable)

---

**Built with ❤️ for learning and critical thinking about power projection theory**
