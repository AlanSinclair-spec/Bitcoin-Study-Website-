# Claude Code + Cursor Workflow Guide

## Best Practices for Using Both Tools Together

---

## Quick Decision Matrix

### Use **Claude Code** for:
- ✅ Understanding large codebases (multiple files)
- ✅ Debugging complex errors with stack traces
- ✅ Architectural decisions and refactoring
- ✅ Git operations (commits, branch management)
- ✅ Planning multi-step features
- ✅ Analyzing performance issues
- ✅ Security audits and code reviews
- ✅ Writing comprehensive documentation
- ✅ Complex data transformations
- ✅ Terminal operations (npm, build, deploy)

### Use **Cursor** for:
- ✅ Writing new React components quickly
- ✅ CSS/Tailwind styling and tweaks
- ✅ Inline code completion and autocomplete
- ✅ Quick bug fixes in single files
- ✅ Renaming variables/functions
- ✅ Adding comments and JSDoc
- ✅ UI iterations and visual adjustments
- ✅ Converting designs to code
- ✅ Writing tests for specific functions
- ✅ Quick edits during active development

---

## Workflow Scenarios

### Scenario 1: Adding a New Feature

**Step 1: Planning (Claude Code)**
```
User: "I want to add a dark mode toggle to the app"

Claude Code will:
- Analyze current CSS variables and theme structure
- Check existing components for theme dependencies
- Create implementation plan with file changes
- Identify potential breaking changes
- Suggest testing strategy
```

**Step 2: Implementation (Cursor)**
```
After getting the plan from Claude Code, use Cursor to:
- Create DarkModeToggle.tsx component
- Add inline completion for common patterns
- Write CSS with real-time preview
- Quick iterations on button styling
```

**Step 3: Testing & Refinement (Claude Code)**
```
Use Claude Code to:
- Run build and fix TypeScript errors
- Test across different pages
- Commit changes with descriptive message
- Update documentation
```

---

### Scenario 2: Debugging an Error

**Use Claude Code when:**
- Error spans multiple files
- Need to trace data flow through components
- Stack trace is complex
- Error involves localStorage, API calls, or async operations
- Need to check console logs and network requests

**Use Cursor when:**
- Simple syntax error in one file
- Missing import statement
- Typo in variable name
- Quick type annotation fix

**Example:**
```
❌ Complex: "JSON parsing error in storage layer affecting multiple pages"
   → Use Claude Code

✅ Simple: "TypeError: Cannot read property 'map' of undefined in Card.tsx line 42"
   → Use Cursor
```

---

### Scenario 3: UI/Styling Work

**Use Cursor for:**
- Adjusting margins, padding, colors
- Adding hover effects and animations
- Responsive design tweaks
- Converting Figma designs to Tailwind classes
- Trying different color combinations

**Use Claude Code for:**
- Creating new design system
- Global CSS architecture changes
- Accessibility improvements across all components
- Performance optimization (removing unused CSS)

---

## Git Coordination

### Recommended Git Workflow

**Option A: Sequential (Safest)**
```bash
# 1. Work in Claude Code
# Make changes, test, commit

# 2. Switch to Cursor
git pull origin main  # Get Claude Code's changes
# Make changes, test, commit

# 3. Back to Claude Code
git pull origin main  # Get Cursor's changes
```

**Option B: Feature Branches (Best for complex work)**
```bash
# In Claude Code
git checkout -b feature/dark-mode
# Work on architecture and logic
git commit -m "Add dark mode state management"
git push origin feature/dark-mode

# In Cursor
git checkout feature/dark-mode
git pull origin feature/dark-mode
# Work on UI components
git commit -m "Add DarkModeToggle component"
git push origin feature/dark-mode

# Merge when ready
git checkout main
git merge feature/dark-mode
```

---

## Avoiding Conflicts

### ⚠️ DON'T:
- ❌ Edit the same file in both tools simultaneously
- ❌ Have both tools open and making changes without syncing
- ❌ Forget to commit before switching tools
- ❌ Make quick "fix" without pulling latest changes

### ✅ DO:
- ✅ Commit frequently with clear messages
- ✅ Pull before starting work in new tool
- ✅ Use feature branches for complex work
- ✅ Communicate in commit messages which tool was used
- ✅ Close files in one tool before opening in other

### Example Commit Messages:
```bash
# Claude Code commits
git commit -m "feat: Add localStorage error handling (Claude Code)"
git commit -m "refactor: Optimize progress tracking queries (Claude Code)"
git commit -m "docs: Update API documentation (Claude Code)"

# Cursor commits
git commit -m "style: Update button hover animations (Cursor)"
git commit -m "feat: Add DarkModeToggle component (Cursor)"
git commit -m "fix: Correct typo in Card component (Cursor)"
```

---

## Common Tasks Breakdown

### Adding a New Page

**Claude Code:**
```typescript
// 1. Plan routing structure
// 2. Create page.tsx file
// 3. Set up data fetching
// 4. Add to navigation
// 5. Test routing and SEO
```

**Cursor:**
```typescript
// 6. Design the UI layout
// 7. Add Tailwind styling
// 8. Create sub-components
// 9. Polish animations
// 10. Responsive tweaks
```

---

### Refactoring a Component

**Claude Code:**
```typescript
// 1. Analyze component usage across codebase
// 2. Identify breaking changes
// 3. Plan migration strategy
// 4. Update all imports and references
// 5. Run build to catch errors
// 6. Test affected pages
```

**Cursor:**
```typescript
// 7. Rename variables for clarity
// 8. Add PropTypes/TypeScript annotations
// 9. Split into smaller sub-components
// 10. Update comments
```

---

### Fixing a Bug

**Start with Claude Code:**
```
1. Reproduce the bug
2. Check console errors and stack trace
3. Trace data flow through components
4. Identify root cause
5. Plan the fix
```

**Switch to Cursor:**
```
6. Implement the fix
7. Add defensive checks
8. Test manually
```

**Back to Claude Code:**
```
9. Run full test suite
10. Check for regression
11. Commit with detailed message
```

---

## Project-Specific Workflow

### For This Softwar Learning Platform

**Use Claude Code for:**
- Adding new lessons to `/data/fundamentals/` or `/data/softwar/`
- Modifying storage layer (`lib/journal/storage.ts`, `lib/progress/storage.ts`)
- Building new features (quiz system, spaced repetition)
- Debugging localStorage issues
- Optimizing performance (React.memo, useMemo)
- Git operations and deployments

**Use Cursor for:**
- Styling lesson pages
- Creating new UI components in `/components/ui/`
- Adjusting colors, spacing, animations
- Writing flashcard components
- Updating homepage hero section
- Quick content edits in MDX files

---

## Emergency Conflict Resolution

### If Both Tools Modified Same File

**Steps:**
```bash
# 1. Check git status
git status

# 2. See what changed
git diff

# 3. Decide which version to keep
# Option A: Keep Claude Code version
git checkout --theirs path/to/file.tsx

# Option B: Keep Cursor version
git checkout --ours path/to/file.tsx

# Option C: Manually merge
# Open file and resolve conflicts manually

# 4. Stage and commit
git add .
git commit -m "Resolve merge conflict in [file]"
```

---

## Communication Between Tools

### Using TODO Comments

**In Claude Code:**
```typescript
// TODO(Cursor): Add hover animation to this button
// TODO(Cursor): Style this card with Tailwind
// TODO(Cursor): Adjust responsive breakpoints
```

**In Cursor:**
```typescript
// TODO(Claude): Add error handling here
// TODO(Claude): Optimize this query
// TODO(Claude): Add TypeScript types
```

---

## Daily Workflow Example

### Morning (Planning & Architecture)
**Claude Code - 30 min**
- Pull latest changes
- Review TESTING_CHECKLIST.md
- Plan today's features
- Set up data structures
- Write utility functions

### Midday (Active Development)
**Cursor - 2 hours**
- Build UI components
- Style with Tailwind
- Write component logic
- Quick iterations
- Visual testing

### Afternoon (Integration & Testing)
**Claude Code - 1 hour**
- Integrate Cursor's components
- Run full build
- Fix TypeScript errors
- Test cross-browser
- Write documentation

### End of Day (Git & Cleanup)
**Claude Code - 15 min**
- Review all changes
- Run TESTING_CHECKLIST quick test
- Commit with detailed messages
- Push to GitHub
- Update project board

---

## Tool-Specific Shortcuts

### Claude Code Strengths
- Multi-file refactoring
- Complex regex find/replace across codebase
- Understanding legacy code
- Terminal automation
- Git operations
- Performance profiling

### Cursor Strengths
- AI autocomplete (Tab)
- Cmd+K for inline edits
- Quick component generation
- CSS IntelliSense
- Real-time error checking
- Multi-cursor editing

---

## When to Use Only One Tool

### Use ONLY Claude Code:
- First time setting up project
- Major architecture changes
- Debugging production issues
- Database migrations
- CI/CD setup
- Security audits

### Use ONLY Cursor:
- Rapid prototyping
- Design system implementation
- CSS animations
- Component library creation
- Content writing (MDX files)

---

## Checklist Before Switching Tools

```
[ ] All files saved
[ ] No syntax errors in current tool
[ ] Git status clean (or intentional uncommitted changes)
[ ] Pull latest from remote
[ ] Close files that might conflict
[ ] Read last commit message to understand recent changes
```

---

## Troubleshooting

### Issue: "Changes I made in Cursor aren't in Claude Code"
**Solution:**
```bash
# In Claude Code terminal
git pull origin main
```

### Issue: "Both tools showing different file contents"
**Solution:**
```bash
# Check git status
git status

# Stash changes in one tool
git stash

# Pull latest
git pull

# Apply stash if needed
git stash pop
```

### Issue: "Merge conflict between tools"
**Solution:**
```bash
# See conflicting files
git diff

# Use visual merge tool
git mergetool

# Or manually edit conflict markers
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>>
```

---

## Performance Tips

### Keep Both Tools Fast
- **Claude Code**: Clear terminal history, close unused files
- **Cursor**: Disable extensions you don't need, restart if sluggish
- **Both**: Commit frequently to reduce git diff size

### Avoid Slowdowns
- Don't run `npm run dev` in both tools simultaneously
- Close browser DevTools when not debugging
- Clear `.next` cache if build is slow
- Restart tools if memory usage is high

---

## Success Metrics

You're using both tools well when:
- ✅ No merge conflicts
- ✅ Commits are small and focused
- ✅ Can switch tools without confusion
- ✅ Each tool is used for its strengths
- ✅ Code quality is high in both tools
- ✅ Development speed increases
- ✅ Less time debugging, more time building

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  CLAUDE CODE          │  CURSOR                         │
├───────────────────────┼─────────────────────────────────┤
│  Architecture         │  UI Components                   │
│  Multi-file edits     │  Single file edits               │
│  Debugging            │  Styling                         │
│  Git operations       │  Quick fixes                     │
│  Terminal commands    │  Visual editing                  │
│  Documentation        │  Code completion                 │
│  Testing              │  Rapid iteration                 │
│  Refactoring          │  Design to code                  │
└─────────────────────────────────────────────────────────┘
```

---

**Remember:** Tools are meant to complement each other. Use the right tool for the right job, and you'll be unstoppable! 🚀
