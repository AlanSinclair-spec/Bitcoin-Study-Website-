# Quick Start Guide

Get the Softwar Learning Platform running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Terminal/command line access
- (Optional) The thesis PDF for full content ingestion

## Step-by-Step Setup

### 1. Navigate to Project

```bash
cd softwar-learning-platform
```

### 2. Install Dependencies (if not done)

```bash
npm install
```

This installs all required packages (~500 packages, takes ~1-2 minutes).

### 3. Initialize Database

```bash
npm run db:generate
npm run db:migrate
```

This creates the SQLite database for progress tracking.

### 4. Start Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

### 5. Open in Browser

Navigate to `http://localhost:3000` and you'll see:

- ✅ Hero page with "Start Learning" button
- ✅ Navigation to Chapters, Flashcards, Glossary, etc.
- ✅ Sample content (Executive Summary + Chapter 1)
- ✅ Working quiz and flashcard systems

## What's Included Out-of-the-Box

### Content
- **2 Complete Chapters**: Executive Summary + Chapter 1
- **11 Flashcards**: Ready for spaced repetition
- **12 Quiz Questions**: MCQ + short answer
- **8 Glossary Terms**: Core concepts defined
- **8 Figure Placeholders**: Metadata ready
- **12 Timeline Events**: From Constantinople to Bitcoin

### Features
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark/light mode (browser default)
- ✅ Progress tracking (localStorage)
- ✅ Spaced repetition (SM-2 algorithm)
- ✅ Interactive quizzes with feedback
- ✅ Glossary with chapter cross-references
- ✅ Timeline visualization
- ✅ Search interface (mock implementation)

## Next Steps

### Option A: Use Sample Content

You're ready to go! Explore the platform with the included sample content:

1. Click **"Start Learning"**
2. Read **Executive Summary**
3. Take the **quiz**
4. Review **flashcards**
5. Explore **glossary** and **timeline**

### Option B: Ingest Full Thesis

If you have `lowery-jplowery-sm-sdm-2023-thesis.pdf`:

```bash
# Place PDF in project root
cp /path/to/lowery-jplowery-sm-sdm-2023-thesis.pdf .

# Run dry-run to preview
npm run ingest:dry

# Run full ingestion
npm run ingest
```

This will:
- Extract all 6+ chapters
- Generate 120+ flashcards
- Create 100+ quiz questions
- Build complete glossary
- Extract all figures

**⚠️ Warning**: This overwrites sample content in `/content` and `/data`.

## Testing

Run smoke tests to verify everything works:

```bash
npm run test
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run test` | Run tests |
| `npm run db:studio` | Open database GUI |

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill existing process or use different port
PORT=3001 npm run dev
```

### Database Errors

```bash
# Reset database
rm prisma/dev.db
npm run db:migrate
```

### Missing Dependencies

```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate types
npm run db:generate
```

## Project Structure at a Glance

```
softwar-learning-platform/
├── app/                 # Pages (Next.js App Router)
│   ├── page.tsx        # Homepage
│   ├── learn/          # Chapters
│   ├── quiz/           # Quizzes
│   ├── flashcards/     # Flashcards
│   ├── glossary/       # Glossary
│   └── ...
├── components/ui/      # UI components
├── content/chapters/   # MDX lesson files
├── data/               # JSON data (flashcards, quizzes, etc.)
├── lib/                # Utilities
├── prisma/             # Database
└── scripts/            # Ingestion script
```

## Key Features to Try

1. **Chapter Reading**
   - `/learn/executive-summary`
   - Left sidebar: Table of contents
   - Right sidebar: Quick actions

2. **Quiz System**
   - `/quiz/executive-summary`
   - Multiple choice + short answer
   - Instant feedback with explanations

3. **Flashcards**
   - `/flashcards`
   - Spaced repetition (SM-2)
   - Review scheduling persists

4. **Glossary**
   - `/glossary`
   - Searchable terms
   - Links to chapters

5. **Timeline**
   - `/timeline`
   - Historical context
   - 1453 → 2023

## Getting Help

- 📖 Read full **README.md** for comprehensive docs
- 🔍 Check **INGESTION_NOTES.md** for PDF parsing details
- 📝 See **SAMPLE_OUTPUT.md** for content examples
- 🐛 Run tests: `npm run test`

## Production Build

When ready to deploy:

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
vercel
```

---

**You're all set! Start exploring the Softwar thesis.** 🚀
