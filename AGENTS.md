# AGENTS.md — Project Context for AI Agents

> Authoritative reference for any AI agent working on this repository.
> Keep this file up-to-date when architecture or conventions change.
> Task tracking lives in `TODO.md`.

## 1. Project Overview

Personal academic website for **Joseph Chazalon** (EPITA-LRE), hosted on
**GitHub Pages** at <https://jchazalon.github.io>.

The site showcases publications, research projects, teaching, news, blog
posts, software, datasets, and models.

## 2. Stack and Tooling

| Component | Detail |
|-----------|--------|
| **SSG** | [Eleventy 3](https://www.11ty.dev/) (ESM config) |
| **Templates** | Nunjucks (`.njk`) for HTML and Markdown |
| **Markdown** | `markdown-it` with `markdown-it-katex` (LaTeX math) |
| **Bibliography** | Citation.js (`@citation-js/core` + `plugin-bibtex` + `plugin-csl`) |
| **Syntax highlight** | `@11ty/eleventy-plugin-syntaxhighlight` |
| **RSS** | `@11ty/eleventy-plugin-rss` |
| **Hosting** | GitHub Pages via `.github/workflows/pages.yml` |

### Build commands

```bash
# If nvm is used and `npm` is not found:
source ~/.nvm/nvm.sh

npm run build     # production build  (eleventy)
npm run start     # dev server        (eleventy --serve)
```

Always verify changes compile cleanly with `npm run build`.

## 3. Directory Layout

```
/                          repo root
├── AGENTS.md              this file
├── TODO.md                remaining tasks
├── publications.bib       master BibTeX (passthrough-copied to _site/)
├── eleventy.config.mjs    Eleventy config (ESM)
├── package.json
├── .github/workflows/     GitHub Pages CI
└── src/                   Eleventy input directory
    ├── _data/             global data (JSON, JS, CJS)
    │   ├── site.json          site metadata
    │   ├── projects.json      project cards (id, title, summary, ...)
    │   ├── news.json          activity/news items
    │   ├── software.json      software resources
    │   ├── datasets.json      dataset resources
    │   ├── models.json        model resources
    │   ├── publications.js    async data: parses publications.bib
    │   ├── bibEntryExtras.cjs custom BibTeX field parser
    │   └── projectEnrichment.cjs
    ├── _includes/partials/ reusable Nunjucks partials
    ├── _layouts/           base.njk, post.njk
    ├── assets/             static files (CSS, JS, images) — passthrough
    ├── blog/posts/         Markdown blog posts (*.md + 11tydata.js)
    ├── projects/           project listing (index.njk + 11tydata.js)
    ├── publications/       publication listing
    ├── contact/, imprint/, news/, teaching/, artifacts/
    ├── index.njk           home page
    └── feed.njk            RSS/Atom feed
```

Output is written to `_site/` (gitignored). A `.nojekyll` sentinel is
auto-created by the `eleventy.after` hook.

## 4. Publication Data Pipeline

This is the most complex subsystem; understand it before touching
publications.

### Flow

1. **`publications.bib`** (repo root) — the single source of truth.
2. **`src/_data/publications.js`** reads the file at build time via
   Citation.js (`Cite.async`).
3. **`src/_data/bibEntryExtras.cjs`** parses custom braced fields that
   Citation.js ignores (see below). The two are merged by `publications.js`.
4. Only entries whose CSL type is in `PUBLICATION_TYPES` are kept:
   `article`, `article-journal`, `paper-conference`, `book`, `thesis`,
   `chapter`, `report`, `manuscript`.
5. Output is sorted **year descending** and exposed as `publications`
   global data.

### Custom BibTeX fields

These fields are parsed by `bibEntryExtras.cjs` using brace-matching
(not by Citation.js):

| Field | Format | Purpose |
|-------|--------|---------|
| `projects` | `{id}` or `{id1 and id2}` | Links pub to project cards |
| `pdf` | `{url}` or `{url1, url2}` | Full-text PDF links |
| `slides` | same | Slide deck links |
| `poster` | same | Poster links |
| `code` | same | Source code repo links |
| `model` | same | Trained model links |
| `thumb` / `image` | `{/assets/images/...}` | Thumbnail path |
| `core` | `{A*}`, `{A}`, `{B}`, ... | CORE ranking |
| `scimago` | `{Q1}`, `{Q2}`, ... | SCImago quartile |

Separator for multi-value fields: comma or ` and `.

### Nunjucks filters (eleventy.config.mjs)

Key filters available in templates: `pubYear`, `formatAuthors`, `doiUrl`,
`pubVenue`, `pubPrimaryLink`, `bibLinkLabel`, `externalLinkAttrs`,
`isAbsoluteUrl`, `projectUrl`, `sortNews`, `sortPosts`, `recentBlogPosts`,
`recentNewsItems`, `isoDate`, `readableDate`.

Label helpers (`pdfArchiveLabel`, `codeRepoLabel`, `modelRepoLabel`) detect
hosting platform from URL hostname (HAL, arXiv, GitHub, etc.).

## 5. Cross-Linking Contract

**Project IDs** are the shared namespace that ties data together:

| File | How project IDs are used |
|------|--------------------------|
| `src/_data/projects.json` | `"id": "soduco"` — defines the ID |
| `publications.bib` | `projects = {soduco}` or `{soduco and mezanno}` |
| `src/_data/software.json` | `"projectIds": ["soduco"]` |
| `src/_data/datasets.json` | `"projectIds": [...]` |
| `src/_data/models.json` | `"projectIds": [...]` |

`src/projects/projects.11tydata.js` enriches each project page with its
linked publications, software, datasets, and models.

## 6. Asset Serving

- Static files live under `src/assets/` and are passthrough-copied to
  `_site/assets/`.
- Reference assets with **web-root paths**: `/assets/images/my-pic.png`.
- `publications.bib` is also passthrough-copied to `_site/publications.bib`
  so visitors can download it.

## 7. Data File Schemas (quick reference)

### `src/_data/site.json`

```jsonc
{
  "title": "Joseph Chazalon",
  "tagline": "...",
  "description": "...",
  "author": "Joseph Chazalon",
  "url": "https://jchazalon.github.io",
  "cvUrl": "",         // TODO: human must provide
  "scheduleUrl": ""    // TODO: human must provide
}
```

### `src/_data/projects.json`

Array of objects:

```jsonc
{
  "id": "soduco",          // unique, used everywhere for cross-linking
  "title": "ANR SODUCO Project",
  "summary": "...",
  "startYear": "2019",
  "endYear": "2024",       // null if ongoing
  "image": null,           // optional thumbnail path
  "role": "...",
  "fundingSources": "...", // optional
  "links": [{ "label": "...", "url": "..." }]
}
```

### `src/_data/news.json`

Array of `{ "date": "YYYY-MM-DD", "text": "...", "url": "..." }`.
Sorted by `sortNews` filter (date descending). `recentNewsItems` filter
shows only items from the last year (UTC calendar day cutoff).

### Resource files (`software.json`, `datasets.json`, `models.json`)

Each is an array of objects with at least:
`{ "title", "url", "projectIds": [...] }`.

## 8. Templates and Layouts

| Layout | Used by |
|--------|---------|
| `_layouts/base.njk` | All pages (site shell, nav, footer) |
| `_layouts/post.njk` | Blog posts |

Partials in `_includes/partials/`:
- `project-detail-block.njk` — detailed project card
- `project-pills.njk` — compact project tag badges
- `pub-icons.njk` — publication link icons (PDF, code, slides, ...)

## 9. Conventions and Coding Style

- **No TypeScript** — plain ES modules (`.mjs` config, `.js` data) and
  CommonJS (`.cjs`) where Citation.js / Node interop requires it.
- **Nunjucks** for all HTML templates; Markdown rendered through Nunjucks
  pipeline (`markdownTemplateEngine: "njk"`).
- Template filters and globals are defined in `eleventy.config.mjs`.
- CSS is a single file (`src/assets/css/site.css`), no preprocessor.
- JS is minimal (`src/assets/js/blog-widgets.js`).
- Commit messages: imperative mood, concise.

## 10. Deployment

GitHub Actions workflow (`.github/workflows/pages.yml`) builds and deploys
to GitHub Pages on push to main. The `eleventy.after` hook writes
`.nojekyll` to prevent Jekyll processing.

## 11. Common Agent Tasks — Quick Recipes

### Add a publication

1. Add BibTeX entry to `publications.bib` (at the top for visibility).
2. Include custom fields (`projects`, `pdf`, `code`, etc.) as needed.
3. Run `npm run build` to verify parsing.

### Add a project

1. Append object to `src/_data/projects.json` with a unique `id`.
2. Use that `id` in `publications.bib` (`projects` field) and resource
   JSON files (`projectIds`) to cross-link.

### Add a news item

Append to `src/_data/news.json` with `date` (YYYY-MM-DD), `text`, and
optional `url`.

### Add software / dataset / model

Append to the appropriate JSON file in `src/_data/`, including
`projectIds` for cross-linking.

### Wire image assets

1. Place the image in `src/assets/images/`.
2. Reference it as `/assets/images/filename.ext` in the relevant JSON or
   BibTeX `thumb`/`image` field.

## 12. Gotchas and Pitfalls

- **`npm` not found?** Run `source ~/.nvm/nvm.sh` first.
- **Unsupported BibTeX types are silently dropped** by `publications.js`.
  If a new entry does not appear, check its type against `PUBLICATION_TYPES`.
- **Custom BibTeX fields** (`projects`, `pdf`, ...) are NOT parsed by
  Citation.js — they rely on the brace-matching logic in
  `bibEntryExtras.cjs`. Syntax errors (unmatched braces) can silently lose
  data.
- **`recentBlogPosts` / `recentNewsItems`** use a rolling 1-year UTC
  calendar cutoff. Items older than that disappear from the home page
  automatically.
- **External links** get `target="_blank" rel="noopener noreferrer"`
  automatically via the `externalLinkAttrs` filter — no need to add
  attributes manually.
- Publication-detail enrichment (fine-grained bibliographic corrections) is
  **human-owned by default**; agents should only resume if explicitly asked.
