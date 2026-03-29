# AGENTS.md — Project Context for AI Agents

> Authoritative reference for any AI agent working on this repository.
> Keep this file up-to-date when architecture or conventions change.
> Task tracking lives in `TODO.md`.

## 1. Project Overview

Personal academic website for **Joseph Chazalon** (EPITA-LRE), hosted on
**GitHub Pages** at <https://jchazalon.github.io>.

The site showcases publications, talks, research projects, teaching, news,
blog posts, software, datasets, and models.

## 2. Stack and Tooling

| Component | Detail |
|-----------|--------|
| **SSG** | [Eleventy 3](https://www.11ty.dev/) (ESM config) |
| **Templates** | Nunjucks (`.njk`) for HTML and Markdown |
| **Markdown** | `markdown-it` with `markdown-it-katex` (LaTeX math) |
| **Bibliography** | JSON source (`src/_data/bibliography.json`) + custom converters (`bibliographySource.cjs`) |
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
├── eleventy.config.mjs    Eleventy config (ESM)
├── package.json
├── docs/                  maintenance docs (including bibliography guide)
├── .github/workflows/     GitHub Pages CI
└── src/                   Eleventy input directory
    ├── _data/             global data (JSON, JS, CJS)
    │   ├── site.json          site metadata
    │   ├── projects.json      project cards (id, title, summary, ...)
    │   ├── news.json          activity/news items
    │   ├── bibliography.json  single source for publications and talks
    │   ├── resources.json     unified software/datasets/models resources
    │   ├── publications.js    derives publications collection from bibliography
    │   ├── talks.js           derives talks collection from bibliography
    │   ├── publicationsBib.js generates BibTeX export content
    │   ├── bibliographySource.cjs shared loaders/converters for bibliography
    │   └── projectEnrichment.cjs
    ├── _includes/partials/ reusable Nunjucks partials
    ├── _layouts/           base.njk, post.njk
    ├── assets/             static files (CSS, JS, images) — passthrough
    ├── blog/posts/         Markdown blog posts (*.md + 11tydata.js)
    ├── projects/           project listing (index.njk + 11tydata.js)
    ├── publications/       publication listing
    ├── talks/              talks listing
    ├── contact/, imprint/, news/, teaching/, resources/
    ├── index.njk           home page
    └── feed.njk            RSS/Atom feed
```

Output is written to `_site/` (gitignored). A `.nojekyll` sentinel is
auto-created by the `eleventy.after` hook.

## 4. Bibliography Data Pipeline

This is the most complex subsystem; understand it before touching
publications/talks.

### Flow

1. **`src/_data/bibliography.json`** is the single source of truth.
2. **`src/_data/bibliographySource.cjs`** loads/normalizes entries and
   provides conversion helpers.
3. **`src/_data/publications.js`** derives publication rows for
   `/publications/`.
4. **`src/_data/talks.js`** derives talk rows for `/talks/`.
5. **`src/_data/publicationsBib.js`** builds BibTeX export content; rendered
   by `src/publications.bib.11ty.js` at `/publications.bib`.

### JSON entry model

The source file supports publication and talk entries with shared fields.

| Field | Purpose |
|-------|---------|
| `category` (`publication`/`talk`) | Drives destination pages |
| `title.text` / `title.html` | Plain title + optional rich rendering |
| `authors[]` | Structured author names (`given`/`family` or `literal`) |
| `projectIds[]` | Project cross-linking |
| `links.*[]` | Multi-link slots (pdf/slides/poster/event/video) |
| `ranking.core` / `ranking.scimago` | Venue ranking badges |
| `bibtex.*` | Export type/key/overrides for generated `/publications.bib` |

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
| `src/_data/bibliography.json` | `"projectIds": ["soduco", "mezanno"]` |
| `src/_data/resources.json` | `"projectIds": ["soduco"]` and `"publicationIds": ["paper-id"]` |

`src/projects/projects.11tydata.js` enriches each project page with its
linked publications, software, datasets, and models.

## 6. Asset Serving

- Static files live under `src/assets/` and are passthrough-copied to
  `_site/assets/`.
- Reference assets with **web-root paths**: `/assets/images/my-pic.png`.
- `/publications.bib` is generated from JSON bibliography data at build time.

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

### `src/_data/bibliography.json`

Top-level object with `version` and `entries` array. Each entry contains
common metadata plus category-specific fields. See `docs/publications.md`
for full schema and examples.

### `src/_data/resources.json`

Top-level object with `version` and `entries` array. Each resource entry has
at least:
`{ "id", "type", "name", "url", "projectIds": [...], "publicationIds": [...] }`.

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
  CommonJS (`.cjs`) where Node interop or shared utilities require it.
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

1. Add/update an entry in `src/_data/bibliography.json` with
   `category: "publication"`.
2. Fill structured fields (`projectIds`, `links`, `ranking`, `bibtex`).
3. Run `npm run build` to verify publication rendering and BibTeX export.

### Add a project

1. Append object to `src/_data/projects.json` with a unique `id`.
2. Use that `id` in `src/_data/bibliography.json` (`projectIds`) and resource
   JSON files (`projectIds`) to cross-link.

### Add a news item

Append to `src/_data/news.json` with `date` (YYYY-MM-DD), `text`, and
optional `url`.

### Add a talk

Append to `src/_data/bibliography.json` with `category: "talk"` and
optional `venue`, `summary`, `links.event`, `links.slides`,
`links.video`, `projectIds`.

### Add software / dataset / model

Append to `src/_data/resources.json` with `type` (`software`/`dataset`/`model`),
plus `projectIds` and optional `publicationIds` for cross-linking.

### Wire image assets

1. Place the image in `src/assets/images/`.
2. Reference it as `/assets/images/filename.ext` in the relevant JSON
   `image` field.

## 12. Gotchas and Pitfalls

- **`npm` not found?** Run `source ~/.nvm/nvm.sh` first.
- **Invalid JSON syntax** in `bibliography.json` fails data loading.
  Validate commas/braces before build.
- **Missing `bibtex.key` or `bibtex.type`** still renders web pages, but
  weakens BibTeX export quality.
- **`recentBlogPosts` / `recentNewsItems`** use a rolling 1-year UTC
  calendar cutoff. Items older than that disappear from the home page
  automatically.
- **External links** get `target="_blank" rel="noopener noreferrer"`
  automatically via the `externalLinkAttrs` filter — no need to add
  attributes manually.
- Publication-detail enrichment (fine-grained bibliographic corrections) is
  **human-owned by default**; agents should only resume if explicitly asked.
