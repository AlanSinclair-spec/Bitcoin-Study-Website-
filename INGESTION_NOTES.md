# PDF Ingestion Script - Notes & TODOs

## Overview

The ingestion script (`scripts/ingest-softwar.ts`) automates content extraction from the Softwar thesis PDF. This document details heuristics used, known limitations, and refinement TODOs.

## Dry-Run Output Example

When you run `npm run ingest:dry`, you'll see output like:

```
🔍 Extracting text from PDF...
✅ Extracted 250 pages

📚 Detecting chapters...
✅ Found 8 chapters

🖼️  Extracting figures...
✅ Found 47 figures

📖 Processing: Executive Summary
  [DRY-RUN] Would write: chapters/executive-summary.mdx
  ✅ Generated 12 flashcards
  ✅ Generated 17 quiz questions

📖 Processing: Chapter 1: Power Projection and Historical Precedents
  [DRY-RUN] Would write: chapters/ch1.mdx
  ✅ Generated 11 flashcards
  ✅ Generated 17 quiz questions

[... continues for all chapters ...]

🕒 Building timeline...
🗺️  Building concepts map...

[DRY-RUN] Would write data files to /data/
  - figures.json (47 items)
  - timeline.json (12 events)
  - concepts.json (15 concepts)
  - flashcards.json (128 cards)
  - quizzes.json (103 questions)

✨ Ingestion complete!
```

## Parsing Heuristics

### 1. Chapter Detection

**Strategy**: Regex patterns matching common thesis formatting

```typescript
const chapterPatterns = [
  /Chapter\s+(\d+)[:\s]+([^\n]+)/gi,
  /(Executive Summary|Abstract)[:\s]*\n/gi,
  /(Acknowledgements|Acknowledgments)[:\s]*\n/gi,
  /(List of Figures|List of Tables)[:\s]*\n/gi,
  /(Recommendations and Conclusion|Conclusion)[:\s]*\n/gi,
  /(References|Bibliography)[:\s]*\n/gi,
];
```

**Limitations**:
- May miss chapters with non-standard formatting
- Assumes consistent heading hierarchy
- Sensitive to PDF text extraction order

**TODO**:
- [ ] Add fallback manual chapter mapping
- [ ] Improve detection for multi-line chapter titles
- [ ] Handle subsections better (3.1, 3.2, etc.)

### 2. Figure Extraction

**Strategy**: Regex for "Figure X: Caption" pattern

```typescript
const figurePattern = /Figure\s+(\d+[-\.]?\d*)[:\s]+([^\n]{10,150})/gi;
```

**Limitations**:
- Only extracts captions, not actual images
- May miss figures with non-standard numbering
- Cannot determine exact page without additional parsing

**TODO**:
- [ ] Extract actual figure images from PDF
- [ ] Implement page number mapping
- [ ] Handle table captions separately
- [ ] Detect figure references in text

### 3. Flashcard Generation

**Strategy**: Concept-based sentence extraction

1. Identify sentences mentioning core concepts (e.g., "Proof-of-Work", "Bitpower")
2. Create Q&A pairs from key sentences
3. Ensure minimum 10 cards per chapter

**Limitations**:
- Heuristic approach may miss nuanced concepts
- Quality varies based on sentence clarity
- No semantic understanding

**TODO**:
- [ ] Implement NLP for better concept extraction
- [ ] Add more sophisticated Q&A generation
- [ ] Manual review and refinement process
- [ ] Support for multi-line answers

### 4. Quiz Generation

**Strategy**: Template-based question creation

```typescript
// MCQ template
{
  question: `Which statement best describes a key idea in ${chapterTitle}?`,
  options: [/* templated options */],
  correctAnswer: /* based on thesis */,
  explanation: /* contextual */
}
```

**Limitations**:
- Questions are templated, not extracted from content
- Manual refinement needed for accuracy
- Limited diversity in question types

**TODO**:
- [ ] Extract actual claims from text for MCQ options
- [ ] Add true/false questions
- [ ] Improve distractor generation (wrong options)
- [ ] Validate all questions against source material

### 5. Timeline Building

**Strategy**: Manual seed + year detection

Currently uses a hardcoded seed of key events. Could be enhanced to:

**TODO**:
- [ ] Extract years from text (regex: `\b(1\d{3}|20\d{2})\b`)
- [ ] Match years with surrounding context
- [ ] Validate historical accuracy
- [ ] Add more granular events

### 6. Glossary Generation

**Strategy**: Core concept list + definition extraction

Scans for bolded terms and definitions in proximity.

**TODO**:
- [ ] Better definition boundary detection
- [ ] Handle acronyms (e.g., "PoW", "MAD")
- [ ] Cross-reference glossary terms in chapters
- [ ] Auto-link terms in lesson text

## Known Issues

### Issue 1: Hyphenation Across Pages

**Problem**: PDF text extraction may break words across page boundaries

Example: "defen-\nsive" → "defen- sive"

**Workaround**: Normalize with `.replace(/\s+/g, ' ')`, but not perfect

**TODO**: Implement smarter de-hyphenation

### Issue 2: Table Extraction

**Problem**: Tables in PDFs don't extract cleanly as structured data

**Workaround**: Currently ignored; only captions extracted

**TODO**: Use dedicated table extraction library

### Issue 3: Bibliography Parsing

**Problem**: Citations may not parse cleanly

**Workaround**: Not currently parsed

**TODO**: Extract and structure bibliography

### Issue 4: Figure-Text Mapping

**Problem**: Cannot reliably map figures to their in-text references

**Workaround**: Use "List of Figures" and guess chapters

**TODO**: Scan text for "see Figure X" references

## Manual Refinement Checklist

After running ingestion, manually review:

- [ ] Chapter titles and ordering
- [ ] Flashcard accuracy (spot-check 20%)
- [ ] Quiz question quality (all short-answer questions)
- [ ] Figure captions and chapter mapping
- [ ] Timeline event accuracy
- [ ] Glossary definitions

## Advanced Ingestion (Future)

Potential enhancements:

1. **LLM-Assisted Generation**
   - Use GPT-4 to generate higher-quality flashcards/quizzes
   - Summarize chapters automatically
   - Extract key takeaways

2. **Computer Vision**
   - OCR for figure images
   - Diagram parsing and annotation
   - Chart data extraction

3. **Semantic Analysis**
   - Concept graph generation
   - Argument mapping (claims → evidence)
   - Contradiction detection

4. **Interactive Content**
   - Embed interactive simulations (e.g., hash rate vs. security)
   - Code examples (e.g., simple PoW implementation)
   - Data visualizations from thesis tables

## Validation Scripts

Consider adding validation scripts:

```bash
# Validate all MDX files parse correctly
npm run validate:mdx

# Check flashcard/quiz counts meet minimums
npm run validate:content

# Cross-reference glossary terms in chapters
npm run validate:glossary
```

## Contact

If you encounter parsing issues not covered here, please:
1. Document the issue with PDF page numbers
2. Suggest improved heuristics
3. Contribute fixes via PR

---

**Remember**: Ingestion is a starting point. Manual review and refinement ensure quality and accuracy.
