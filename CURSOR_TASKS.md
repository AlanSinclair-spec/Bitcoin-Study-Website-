# Cursor Tasks: Fix Build Issues & Polish UI

## Priority 1: Fix Build-Blocking Issues ⚠️ (CRITICAL)

### 1.1 Fix Missing Component in /learn/ch3
**Error:**
```
Expected component `EverydayApplication` to be defined
Export encountered an error on /learn/[chapter]/page: /learn/ch3
```

**Location:** `app/learn/[chapter]/page.tsx` or MDX content file for Chapter 3

**Task:**
- [ ] Navigate to the chapter 3 content file (likely in `/data/softwar/` or `/app/learn/`)
- [ ] Search for `<EverydayApplication` component usage
- [ ] Either:
  - Option A: Create the missing `EverydayApplication` component
  - Option B: Remove the component reference from MDX content
  - Option C: Replace with existing component (Card, Badge, etc.)

**Test:**
```bash
npm run build
# Should complete without errors
```

---

## Priority 2: Fix ESLint Warnings (Optional but Recommended)

### 2.1 Fix React Hook Dependencies

**Files:**
- `app/journal/[id]/page.tsx:30`
- `app/journal/page.tsx:32`

**Warnings:**
```
React Hook useEffect has a missing dependency: 'loadEntry'.
Either include it or remove the dependency array.
```

**Task:**
- [ ] Open `app/journal/[id]/page.tsx`
- [ ] Line 30: Add `loadEntry` to useEffect dependency array OR wrap `loadEntry` in useCallback
- [ ] Open `app/journal/page.tsx`
- [ ] Line 32: Add `loadData` to useEffect dependency array OR wrap `loadData` in useCallback

**Recommended Fix (use useCallback):**
```typescript
// In app/journal/[id]/page.tsx
const loadEntry = useCallback(async () => {
  const entry = await journalStorage.getEntry(id);
  if (entry) setEntry(entry);
}, [id]);

useEffect(() => {
  loadEntry();
}, [loadEntry]);
```

---

## Priority 3: UI Polish & Enhancements

### 3.1 Test Premium UI Design
- [ ] Navigate to http://localhost:3002 (or whatever port is running)
- [ ] Verify Bitcoin orange (#F7931A) gradients are visible
- [ ] Check glassmorphism header (backdrop blur)
- [ ] Test hover effects on all cards
- [ ] Verify pulsing dot indicators on progress dashboard
- [ ] Test responsive design on mobile viewport (< 640px)

### 3.2 Fix Any Visual Glitches
- [ ] Check for any layout shifts
- [ ] Verify all images load correctly
- [ ] Test dark mode (if implemented)
- [ ] Check for any overlapping elements
- [ ] Verify text contrast meets accessibility standards

### 3.3 Add Loading States
- [ ] Add skeleton loaders for async data fetches
- [ ] Add loading spinners for button clicks
- [ ] Improve perceived performance with optimistic UI updates

---

## Priority 4: Performance Optimization

### 4.1 Check Bundle Size
```bash
npm run build
# Check .next/server/app output for page sizes
# Look for pages > 500KB
```

- [ ] Identify any large pages
- [ ] Consider code splitting for large components
- [ ] Lazy load heavy dependencies

### 4.2 Optimize Images
- [ ] Replace `<img>` tags with Next.js `<Image>` component
- [ ] Add width/height to prevent layout shift
- [ ] Use appropriate image formats (WebP where supported)

---

## Priority 5: Content & Data Fixes

### 5.1 Review MDX Content Files
- [ ] Check all files in `/data/softwar/` for broken components
- [ ] Verify all MDX imports are correct
- [ ] Test all interactive elements within lesson pages

### 5.2 Validate JSON Data
- [ ] Verify `/data/flashcards.json` is valid
- [ ] Verify `/data/quizzes.json` is valid
- [ ] Verify `/data/glossary.json` is valid
- [ ] Check for any typos or missing fields

---

## Priority 6: Functionality Testing

### 6.1 Progress Tracking
- [ ] Complete a lesson
- [ ] Verify progress bar updates on homepage
- [ ] Check localStorage contains correct data
- [ ] Test quiz score recording

### 6.2 Journal Feature
- [ ] Create a new journal entry
- [ ] Edit an existing entry
- [ ] Delete an entry
- [ ] Test prefill functionality from lesson page
- [ ] Create goals and habits
- [ ] Test sample entry displays correctly

### 6.3 Flashcards
- [ ] Navigate to /flashcards
- [ ] Test card flip animation
- [ ] Test filtering by category
- [ ] Test navigation (next/previous)

### 6.4 Glossary
- [ ] Navigate to /glossary
- [ ] Test search functionality
- [ ] Verify all terms display correctly
- [ ] Test links to related lessons

---

## Priority 7: Deploy to Vercel

### 7.1 Verify Build Succeeds Locally
```bash
rm -rf .next
npm run build
```
- [ ] Build completes without errors
- [ ] All pages generate successfully
- [ ] No TypeScript errors
- [ ] No critical ESLint errors

### 7.2 Push to GitHub
```bash
git add -A
git commit -m "fix: Resolve remaining build issues for Vercel"
git push origin main
```

### 7.3 Deploy via Vercel Dashboard
1. [ ] Visit https://vercel.com/new
2. [ ] Import GitHub repository: `AlanSinclair-spec/Bitcoin-Study-Website-`
3. [ ] Click "Deploy"
4. [ ] Wait for build to complete (~2-3 min)
5. [ ] Get live URL

### 7.4 Test Live Deployment
- [ ] Visit live URL
- [ ] Test homepage loads
- [ ] Navigate to /fundamentals
- [ ] Navigate to /learn
- [ ] Test /journal
- [ ] Test /flashcards
- [ ] Check browser console for errors

---

## Priority 8: Post-Deployment Polish

### 8.1 SEO Optimization
- [ ] Verify all pages have proper `<title>` tags
- [ ] Add meta descriptions to key pages
- [ ] Test Open Graph tags for social sharing
- [ ] Add structured data (JSON-LD) for lessons

### 8.2 Analytics Setup (Optional)
- [ ] Enable Vercel Analytics
- [ ] Or add Google Analytics
- [ ] Track key user flows

### 8.3 Performance Monitoring
- [ ] Run Lighthouse audit on live site
- [ ] Aim for 90+ scores across all metrics
- [ ] Fix any issues identified

---

## Quick Commands Reference

```bash
# Build locally
npm run build

# Run development server
npm run dev

# Clear build cache
rm -rf .next

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint

# Git operations
git status
git add -A
git commit -m "your message"
git push origin main
```

---

## Known Issues Summary

| Issue | Status | Priority | Location |
|-------|--------|----------|----------|
| Missing `EverydayApplication` component | ❌ Blocking | P1 | /learn/ch3 |
| useEffect dependency warnings | ⚠️ Warning | P2 | journal pages |
| Build cache corruption | ✅ Fixed | - | - |
| localStorage JSON parsing | ✅ Fixed | - | storage.ts |
| ESLint quote escaping | ✅ Fixed | - | Multiple files |
| Async params in Next.js 15 | ✅ Fixed | - | quiz page |
| Suspense boundary missing | ✅ Fixed | - | journal/new |

---

## Success Criteria

Before marking as complete, verify:
- ✅ `npm run build` completes without errors
- ✅ All pages accessible on local dev server
- ✅ No console errors in browser
- ✅ Premium UI design looks polished
- ✅ All features work (progress, journal, flashcards, glossary)
- ✅ Deployed successfully to Vercel
- ✅ Live site loads without errors
- ✅ Lighthouse score > 90 on all metrics

---

## Communication with Claude Code

If you encounter issues or need help:

1. **Document the error** - Copy full error message
2. **Note the file** - What file were you editing?
3. **Describe what you tried** - What solutions did you attempt?
4. **Share the result** - Did it improve or worsen?

Use TODO comments to communicate:
```typescript
// TODO(Claude): Need help with this component structure
// TODO(Claude): This API call is failing, check endpoint
```

---

## Estimated Time

- **P1 (Critical)**: 15-30 minutes
- **P2-P3 (Recommended)**: 1-2 hours
- **P4-P6 (Polish)**: 2-3 hours
- **P7 (Deploy)**: 10-15 minutes
- **P8 (Post-deploy)**: 1 hour

**Total**: 4-7 hours depending on issues encountered

---

**Last Updated**: After Claude Code fixed ESLint errors, TypeScript issues, and Suspense boundaries
**Next Step**: Fix missing `EverydayApplication` component in /learn/ch3, then deploy!

🚀 **You got this!**
