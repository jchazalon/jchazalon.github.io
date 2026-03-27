# jchazalon.github.io

Personal academic site, built with [Eleventy](https://www.11ty.dev/) and deployed to **GitHub Pages** via **GitHub Actions**.

**This is a documentation about how to build and maintain this website. I you want to visit this site, please go to <https://jchazalon.github.io>.**

Context for AI agents is provided in [AGENTS.md](AGENTS.md).

## Local build

```bash
npm ci
npm run build   # output: _site/
npm start       # serve with hot reload
```

## Deploying

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main` or `master`; the workflow in `.github/workflows/pages.yml` runs `npm run build` and publishes `_site`.

To use a single branch name, edit the `on.push.branches` entry in that workflow.

## Content and cross-links

- **Publications:** [`publications.bib`](publications.bib) (see [Publication (BibTeX)](#publication-bibtex)).
- **Projects:** [`src/_data/projects.json`](src/_data/projects.json) — [Project](#project).
- **Resources** (navbar label for software, datasets, models): [`software.json`](src/_data/software.json), [`datasets.json`](src/_data/datasets.json), [`models.json`](src/_data/models.json) — [Artifact](#artifact-software-dataset-model); page URL remains [`/artifacts/`](src/artifacts/index.njk).
- **News:** [`src/_data/news.json`](src/_data/news.json) — [News item](#news-item).
- **Blog:** Markdown posts under [`src/blog/posts/`](src/blog/posts/) — [Blog posts](#blog-posts) (math, code highlighting, optional widgets, RSS, home sidebar).
- **Site metadata:** [`src/_data/site.json`](src/_data/site.json) — [Site](#site).
- **Contact & opportunities:** [`src/contact/index.njk`](src/contact/index.njk) — contact text, PhD/internship/collaboration blurb, booking link (see `scheduleUrl` in `site.json`).
- **Imprint / legal:** [`src/imprint/index.njk`](src/imprint/index.njk) — CC-BY and personal-views disclaimer; linked from the site footer only (not in the main nav).
- **Teaching:** [`src/teaching/index.md`](src/teaching/index.md) — Markdown page with optional front matter (`layout`, `title`, `description`); no shared JSON schema.

Blog posts are **not** in `news.json`: they are separate files so you can use long form, code, math, and embeds. News stays best for short, dated announcements.

Project pages aggregate linked publications and artifacts; publication and artifact pages show **Related projects** pills when `projects` / `projectIds` are set.

### Where to put resources (images, data, static files)

The build copies **`src/assets/`** wholesale into **`_site/assets/`** (see `addPassthroughCopy` in [`eleventy.config.mjs`](eleventy.config.mjs)). **`publications.bib`** at the repository root is also copied to the site root. Everything else under `src/` is treated as templates or data, not as arbitrary binary files—so **do not** drop images next to a template expecting them to publish unless you add another passthrough rule.

| What you are adding | Where the *content* lives | Where images / downloads / extra static files go |
| ------------------- | ------------------------- | -------------------------------------------------- |
| **Project** | New object in [`src/_data/projects.json`](src/_data/projects.json) | Optional `image`: path starting with **`/assets/...`** (file under `src/assets/`, e.g. `src/assets/images/projects/<id>.png`) or a full `https://...` URL. |
| **Software, dataset, or model** | New object in [`src/_data/software.json`](src/_data/software.json), [`datasets.json`](src/_data/datasets.json), or [`models.json`](src/_data/models.json) | Same as project `image`: **`/assets/...`** or external URL. The primary **`url`** usually points off-site (repo, Zenodo, Hugging Face, etc.); this site does not host dataset or model binaries. |
| **Publication teaser** | [`publications.bib`](publications.bib) — `thumb` / `image` in [site-specific fields](#publication-bibtex) | Site-hosted teasers: **`/assets/...`** (e.g. `src/assets/images/pubs/`). PDFs/slides/posters are normally external URLs in `pdf`, `slides`, etc. |
| **Blog post** | New `.md` under [`src/blog/posts/`](src/blog/posts/) | Put figures and downloads under **`src/assets/`** (e.g. `src/assets/images/blog/`) and reference them in Markdown with **`/assets/...`** (or absolute `https://...`). |
| **News item** | [`src/_data/news.json`](src/_data/news.json) — text fields only | No dedicated asset fields; embed off-site links in `body` / `href`, or add a passthrough + convention if you need hosted files. |
| **Another site page** | New `index.njk` / `index.md` under `src/` (e.g. [`src/teaching/index.md`](src/teaching/index.md)) | Same as blog: static files under **`src/assets/`**, linked as **`/assets/...`**. |

**Structured “data” for the generator** (lists of projects, news, artifacts, `site.json`) always lives in **`src/_data/`** as JSON or JS, or in **`publications.bib`** for bibliography—not mixed into `src/assets/`. Use **`src/assets/`** for anything that should be served as a file (images, CSS overrides you add, JS, optional PDFs you choose to host on Pages).

**URL rule:** For anything stored under `src/assets/`, use a **root-relative** path in content: **`/assets/<path-under-src/assets>`** (leading slash, no `src/`). That matches how [`projects.json`](src/_data/projects.json) and the BibTeX extras already reference images.

## Content object reference

Field names below are the ones the templates and data pipeline expect. Optional fields may be omitted or set to empty values as noted.

### Publication (BibTeX)

Source file: [`publications.bib`](publications.bib). Entries are parsed with [Citation.js](https://citation.js.org/) for bibliographic data and with [`src/_data/bibEntryExtras.cjs`](src/_data/bibEntryExtras.cjs) for site-only fields.

**Included on the Publications page** when the Citation.js type is one of: `article`, `article-journal`, `paper-conference`, `book`, `thesis`, `chapter`, `report`, `manuscript`. Other entry types (for example `@software` mixed into the same file) are skipped for that list.

**Standard BibTeX / CSL fields** (examples; use normal BibTeX for your entry type):

- **`title`**, **`author`**, **`year`** (or `date`): required for a sensible listing.
- **`doi`**: optional; shown as a DOI link.
- **`url`**: optional; shown as “Publisher page”.
- Venue depends on type: e.g. **`booktitle`** + **`pages`** for proceedings, **`journal`**, **`volume`**, **`number`**, **`pages`** for articles, **`school`** for theses (rendered via Citation.js).

**Site-specific braced fields** (parsed only from the raw `.bib` text; multiple values separated by **comma** or **`and`**):

- **`projects`**: string ids matching [`projects.json`](src/_data/projects.json) `id` values. Example: `projects = {doc-ie-historical and eval-benchmarks}`.
- **`pdf`**: URLs to paper PDFs (HAL, arXiv, publisher OA, etc.).
- **`slides`**: URLs to slides.
- **`poster`**: URLs to posters.
- **`code`**: URLs to source repositories.
- **`model`**: URLs to model artifacts (e.g. Hugging Face, Zenodo).
- **`thumb`** or **`image`**: optional teaser image (single path or URL). Site-relative paths should start with `/assets/...` so they resolve after build.
- **`core`**: optional CORE conference rank (free text, e.g. `A*`, `A`, `B`); shown as a badge.
- **`scimago`**: optional Scimago / SJR-style journal label (e.g. `Q1`); shown as an **SJR** badge.

At build time each publication row also gets:

- **`projectIds`**: string array from `projects`.
- **`bibLinks`**: object with keys `pdf`, `slides`, `poster`, `code`, `model`, each a string array of URLs.
- **`thumb`**, **`core`**, **`scimago`**: copied from the extras parser for templates.

### Project

Source file: [`src/_data/projects.json`](src/_data/projects.json). The file is a **JSON array** of objects.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | string | yes | Stable slug; used in anchors (`/projects/#id`) and in `projectIds` / `projects` elsewhere. Use letters, numbers, hyphens. |
| `title` | string | yes | Short human-readable project name. |
| `summary` | string | yes | One or two sentences for the project page. |
| `startYear` | string or number | no | Start year of the project (e.g. `"2018"`). |
| `endYear` | string, number, or `null` | no | End year, or `null` / omit for **ongoing** (shown as “present”). On `/projects/`, entries with an `endYear` are listed under **Past projects**; others under **Ongoing projects**. |
| `image` | string or `null` | no | Optional illustration: `/assets/images/...` or `https://...`. |
| `role` | string | no | Your role (e.g. PI, co-PI, partner work-package leader). Omitted from the page if not set. |
| `fundingSources` | string | no | Funding bodies or programmes (free text). Omitted if not set. |
| `budget` | string | no | Total budget (include currency or scale in the string, e.g. `120 kEUR`). Omitted if not set. |
| `links` | array | no | Zero or more `{ "label": string, "url": string }` objects for external pages. |

If none of `role`, `fundingSources`, or `budget` is set, no funding block is rendered.

### Artifact (software, dataset, model)

Source files: [`src/_data/software.json`](src/_data/software.json), [`src/_data/datasets.json`](src/_data/datasets.json), [`src/_data/models.json`](src/_data/models.json). Each file is a **JSON array** of objects with the **same** shape.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `id` | string | yes | Stable slug; used in HTML ids on `/artifacts/` (`#software-id`, `#dataset-id`, `#model-id`). |
| `name` | string | yes | Display name (heading + link text). |
| `description` | string | yes | Short paragraph. |
| `url` | string | yes | Primary link (repo, dataset page, model card, etc.). |
| `image` | string or `null` | no | Optional thumbnail (same rules as project `image`). |
| `projectIds` | string[] | no | Ids of projects this artifact belongs to; drives **Related projects** on the artifact page and lists on project pages. |

### News item

Source file: [`src/_data/news.json`](src/_data/news.json). The file is a **JSON array** of objects.

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `date` | string | yes | ISO-like date `YYYY-MM-DD`; used for sorting (newest first) and fragment ids on `/news/` (`#news-YYYY-MM-DD`). |
| `title` | string | yes | Headline (full news page). |
| `summary` | string | no | One-line blurb for the **home** sidebar; if omitted, the home page falls back to `title`. |
| `body` | string | no | Longer text on `/news/`; may be omitted. |
| `href` | string or null | no | Optional “More” link; use `null` when absent. |

### Blog posts

Blog content is **Markdown** (`.md`) with **YAML front matter**. Listing page: [`src/blog/index.njk`](src/blog/index.njk) → URL [`/blog/`](src/blog/index.njk). Individual posts must live under **[`src/blog/posts/`](src/blog/posts/)** (not in `src/blog/` next to `index.njk`): that layout avoids directory-wide data accidentally changing the index URL or tagging the index as a post.

Defaults for every file in `posts/` come from [`src/blog/posts/posts.11tydata.js`](src/blog/posts/posts.11tydata.js): layout `post.njk`, URL `/blog/<filename-without-extension>/`, collection tag `posts` (plus any extra tags you add), KaTeX and blog widget script enabled, Open Graph type `article`.

#### Front matter (per post)

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `title` | string | yes | Page `<title>`, `<h1>`, and RSS entry title. |
| `date` | string | yes | Prefer `YYYY-MM-DD`. Drives sort order, `<time>` on the post and blog index, RSS `pubDate`, and the [home page](#blog-posts-on-the-home-page) “recent blog” filter. |
| `description` | string | yes | Meta description and Open Graph text; also shown as the blurb under the title on [`/blog/`](src/blog/index.njk). |
| `summary` | string | no | **RSS:** If set, the RSS plugin uses `summary` for the short `<description>` and puts the full HTML body in `<content:encoded>`. If omitted, the full HTML is duplicated in `<description>` (valid but noisy in feed readers). Recommended: set `summary` to a one-line teaser, or keep it in sync with `description` (see below). |
| `tags` | string or string[] | no | Optional **topic** labels (e.g. `document-ai` or `[layout, evaluation]`). Do **not** use `posts` here; [`posts.11tydata.js`](src/blog/posts/posts.11tydata.js) always adds the `posts` collection tag. Topic tags appear as small labels under the post date. |

**Keeping `description` and `summary` in sync (DRY):** YAML anchors avoid duplicating the same string:

```yaml
---
title: "My post"
date: 2026-04-01
description: &desc "One line for meta, blog index, and RSS summary."
summary: *desc
---
```

If you want a **shorter** RSS teaser than the meta description, set `summary` to the short line and keep `description` longer for search/social snippets.

#### Authoring the body (Markdown + more)

- **GitHub-flavored style:** headings, lists, links, emphasis, etc., as usual.
- **Fenced code blocks** with a language id (e.g. ` ```python `) get **syntax highlighting** at build time (Prism-style markup; styles in [`site.css`](src/assets/css/site.css)).
- **Math (KaTeX):** inline `$...$`, display `$$...$$`. A **KaTeX CSS** stylesheet is loaded on post pages only (via layout data). If a dollar sign is not math, escape or rephrase to avoid accidental parsing.
- **Raw HTML** in Markdown is allowed (`html: true` on the Markdown-it instance in [`eleventy.config.mjs`](eleventy.config.mjs)). Use this for one-off embeds (e.g. iframes). **Only use this for content you trust** (your own posts); never pipe untrusted Markdown through the same setup.
- **Nunjucks inside `.md`:** `markdownTemplateEngine` is `njk`, so you can use `{% include %}` and shortcodes in the body.

#### Widget shortcode and client script

The paired shortcode **`widgetSlot`** wraps a JSON payload that a small module hydrates in the browser:

```markdown
{% widgetSlot %}
{"kind":"demo","message":"Hello from blog-widgets.js"}
{% endwidgetSlot %}
```

Implementation: [`eleventy.config.mjs`](eleventy.config.mjs) (shortcode) and [`src/assets/js/blog-widgets.js`](src/assets/js/blog-widgets.js) (reads `kind` and updates the DOM). **Extend** `applySpec` in that script for new `kind` values (e.g. Vega-Lite, Chart.js): add cases there and emit matching JSON from the shortcode body. The script is loaded on post pages when `loadBlogWidgets` is true (set in directory data).

#### RSS feed

- **URL:** `/feed.xml` at the site root, built from [`src/feed.njk`](src/feed.njk). The default `feedPlugin` virtual template from `@11ty/eleventy-plugin-rss` was **not** used: it omitted the **`xmlns:content`** namespace required for valid RSS 2.0 when using `<content:encoded>` (RSS Content Module). The manual template declares `xmlns:content="http://purl.org/rss/1.0/modules/content/"` and uses **`eleventyImport.collections: [posts]`** so `collections.posts` is populated when the feed renders.
- **Plugin:** [`eleventy.config.mjs`](eleventy.config.mjs) registers the package’s main **`rssPlugin`** export (filters such as `renderTransforms`, `htmlBaseUrl`, `dateToRfc822`, `getNewestCollectionItemDate`). **`siteBaseUrl`** is exposed as a Nunjucks global (trailing slash after `site.url`) for `xml:base` and absolute links.
- **Channel fields** use [`src/_data/site.json`](src/_data/site.json) (`title`, `description`, `author`, `url`). Keep **`url`** correct (canonical origin, no trailing slash in the JSON file) so `siteBaseUrl` and feed links resolve.

#### Blog posts on the home page

[`src/index.njk`](src/index.njk) shows up to **four** posts in the sidebar under **News**, using the `recentBlogPosts` filter in [`eleventy.config.mjs`](eleventy.config.mjs). A post is included if its **UTC calendar date** is on or after the same month–day **one year before** the build date (not a rolling 365-day millisecond window, so anniversary-day posts are not dropped by timezone edge cases). If no post qualifies, the Blog block is omitted.

### Site

Source file: [`src/_data/site.json`](src/_data/site.json). Single **JSON object** (not an array).

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `title` | string | yes | Site / owner name (header, default title suffix). |
| `tagline` | string | no | Subtitle under the name in the header. |
| `description` | string | no | Default meta description and Open Graph description where pages do not override. |
| `author` | string | no | Meta `author`. |
| `url` | string | yes | Canonical site origin, no trailing slash (e.g. `https://jchazalon.github.io`). Used for `og:url` / `canonical` with each page path. |
| `cvUrl` | string | no | Link to CV / résumé PDF; powers the home page **CV / résumé** button and biography sentence. |
| `scheduleUrl` | string | no | Booking page (Calendly, institutional calendar, etc.); used on the home page **Book an appointment** button and on `/contact/#schedule`. |

### Contact page

Static template: [`src/contact/index.njk`](src/contact/index.njk). Not driven by JSON; edit the HTML/Nunjucks there. The **Book an appointment** button uses `scheduleUrl` from [`site.json`](src/_data/site.json). **Profile links** (GitHub, ORCID, Scholar, etc.) are intentionally only on the [home page](src/index.njk); the contact page lists emails, languages you read, and points readers to the home page for profiles.
