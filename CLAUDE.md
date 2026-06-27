# My Dashboard — Project Context

## What This Is

A single-file personal life OS: `My_Dashboard.html`. No build step, no npm, no framework. Pure HTML + CSS + JavaScript. Data persists via Firebase Realtime Database with a Sync button. Designed for mobile-first use.

## File Structure

Everything lives in one file:
- **`<style>`** blocks — full design system + per-panel component styles
- **`<section class="panel" id="panel-X">`** — each panel is a hidden section, shown via JS tab switching
- **`<script>`** blocks — panel logic, Firebase sync, event listeners
- Bottom nav (`<nav class="botnav">`) drives tab switching

## Panels

| Panel ID | Nav label | What it tracks |
|----------|-----------|----------------|
| `panel-home` | Home (center FAB) | Overview tiles linking to other panels |
| `panel-main` | Goals | Daily goals checklist |
| `panel-health` | Health | Water intake, supplements, caffeine, nutrition (Open Food Facts + barcode scan), body weight |
| `panel-fitness` | Fitness | Workout logging, Hevy API sync, progress stats |
| `panel-finance` | Finance | Portfolio assets, transactions, allocation chart |
| `panel-drumming` | Drumming | Practice sessions, goals, stats |
| `panel-reading` | Reading | Current book progress, reading habits, completed books |

## Design System

CSS variables (never rename these):
```css
--text, --text-2, --text-3, --text-4   /* text hierarchy */
--success (#6BE3A4), --warning (#F2C063), --danger (#FF6B6B), --water (#7DD3FC), --violet (#C77DFF)
--bg (#050506), --card, --card-2       /* backgrounds */
--line, --line-soft                    /* borders */
--r (16px), --r-sm (11px)             /* border radii */
--font, --mono                         /* typography */
```

Key component classes:
- `.card` — main content container
- `.btn`, `.btn-primary`, `.btn-accent`, `.btn-block` — buttons
- `.sect`, `.sect-h` — section wrappers with auto-divider
- `.fstat` — stat tile (label + big number)
- `.bar` — progress bar (add `.warn` or `.violet` to change color)
- `.modal-bg` + `.modal` — modal pattern
- `.seg` + `.seg-btn` — segmented control

## Data Layer

Firebase Realtime Database via the compat SDK (v10.12.2). Data key: configured in the `<script>` block at bottom. The Sync button (`#syncBtn`) triggers push/pull. Each panel stores its own key namespace in localStorage first, then syncs to Firebase.

Pattern for reading/writing panel data:
```js
// Read from localStorage
const data = JSON.parse(localStorage.getItem('myKey') || '{}');

// Write + trigger sync
localStorage.setItem('myKey', JSON.stringify(data));
// (sync button handles Firebase push)
```

## Adding a New Panel

1. Add `<section class="panel" id="panel-X">` in `<main id="panels">`
2. Add a nav button in the `botnav` via JS (see existing `buildNav()` function)
3. Follow the panel template: `.page-bar` header, `.sect` sections, `.card` containers
4. Use existing CSS classes before adding new ones

## Development Workflow

Open `My_Dashboard.html` directly in a browser — no server needed for most features. Firebase sync and camera (barcode scanner) require HTTPS (use a local server like `python3 -m http.server` if needed).

No linter, no test suite. Visual QA = open in browser and click through the affected panel.

## Hevy API Integration

In Fitness panel settings: enter Hevy API key to sync workout history automatically. Falls back to manual logging if CORS blocks direct access (use a Vercel proxy endpoint as workaround).

## Commit Style

```
feat(health): add sleep tracking panel
fix(fitness): correct weekly volume calculation
style(nav): adjust home FAB shadow on active state
```

Branch: `claude/claude-professional-setup-mdoxoo`
