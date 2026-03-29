# Bibliography Data Guide

This project now uses a **single source of truth** for publications and talks:

- Source file: `src/_data/bibliography.json`
- Rendered pages:
  - `src/publications/index.njk` (`category: "publication"`)
  - `src/talks/index.njk` (`category: "talk"`)
- Generated download:
- `/publications.bib` (generated from JSON at build time)

## Top-level shape

```json
{
  "version": 1,
  "entries": []
}
```

## Entry schema (common fields)

Use `{ "literal": "..." }` in `authors` for non-person entities (consortia, committees).

```json
{
  "id": "unique-id",
  "category": "publication",
  "subtype": "article-journal",
  "title": {
    "text": "Plain title",
    "html": null
  },
  "authors": [
    { "given": "Alice", "family": "Doe", "literal": null }
  ],
  "date": "2025-03-10",
  "summary": null,
  "projectIds": ["project-id"],
  "venue": {
    "name": "Venue / event",
    "location": null
  },
  "publication": {
    "doi": null,
    "url": null,
    "volume": null,
    "issue": null,
    "pages": null,
    "publisher": null
  },
  "ranking": {
    "core": null,
    "scimago": null
  },
  "links": {
    "pdf": [{ "url": "https://...", "label": "HAL", "description": null }],
    "slides": [],
    "poster": [],
    "event": [],
    "video": []
  },
  "image": null,
  "related": {
    "publicationIds": []
  },
  "bibtex": {
    "type": "article",
    "key": "doe.25.example",
    "includeInDownload": true,
    "fields": {}
  }
}
```

## Examples by type

### Journal article

```json
{
  id: "doe.25.journal",
  category: "publication",
  subtype: "article-journal",
  title: {
    text: "Learning from Historical Records",
    html: null
  },
  authors: [
    { given: "Alice", family: "Doe", literal: null },
    { given: "Bob", family: "Martin", literal: null }
  ],
  date: "2025",
  summary: null,
  projectIds: ["soduco"],
  venue: { name: "Journal of Digital History", location: null },
  publication: {
    doi: "10.1000/example-doi",
    url: "https://doi.org/10.1000/example-doi",
    volume: "12",
    issue: "3",
    pages: "42-58",
    publisher: "Example Press"
  },
  ranking: { core: null, scimago: "Q1" },
  links: {
    pdf: [{ url: "https://hal.science/hal-123", label: "HAL", description: null }],
    slides: [],
    poster: [],
    event: [],
    video: []
  },
  image: "/assets/images/pubs/doe25.png",
  related: { publicationIds: [] },
  bibtex: { type: "article", key: "doe.25.journal", includeInDownload: true, fields: {} }
}
```

### Conference paper

```json
{
  id: "doe.25.icdar",
  category: "publication",
  subtype: "paper-conference",
  title: { text: "Structured Extraction for Maps", html: null },
  authors: [{ given: "Alice", family: "Doe", literal: null }],
  date: "2025",
  summary: null,
  projectIds: ["mezanno"],
  venue: { name: "Proceedings of ICDAR 2025", location: "Paris, France" },
  publication: {
    doi: null,
    url: "https://example.org/paper",
    volume: null,
    issue: null,
    pages: "120-134",
    publisher: null
  },
  ranking: { core: "A", scimago: null },
  links: {
    pdf: [{ url: "https://arxiv.org/abs/2501.00001", label: "arXiv", description: null }],
    slides: [{ url: "https://speakerdeck.com/...", label: "Slides", description: null }],
    poster: [],
    event: [],
    video: []
  },
  image: null,
  related: { publicationIds: [] },
  bibtex: {
    type: "inproceedings",
    key: "doe.25.icdar",
    includeInDownload: true,
    fields: {
      booktitle: "Proceedings of ICDAR 2025"
    }
  }
}
```

### Thesis

```json
{
  id: "doe.24.phd",
  category: "publication",
  subtype: "thesis",
  title: { text: "Document Intelligence for Archives", html: null },
  authors: [{ given: "Alice", family: "Doe", literal: null }],
  date: "2024",
  summary: null,
  projectIds: [],
  venue: { name: "INSA Rennes", location: "Rennes, France" },
  publication: {
    doi: null,
    url: "https://theses.fr/example",
    volume: null,
    issue: null,
    pages: null,
    publisher: "INSA Rennes"
  },
  ranking: { core: null, scimago: null },
  links: {
    pdf: [{ url: "https://theses.hal.science/example", label: "HAL", description: null }],
    slides: [],
    poster: [],
    event: [],
    video: []
  },
  image: null,
  related: { publicationIds: [] },
  bibtex: { type: "phdthesis", key: "doe.24.phd", includeInDownload: true, fields: {} }
}
```

### Report / manuscript

```json
{
  id: "doe.26.report",
  category: "publication",
  subtype: "report",
  title: { text: "Benchmark Protocol v2", html: null },
  authors: [{ given: "Alice", family: "Doe", literal: null }],
  date: "2026",
  summary: "Internal technical report.",
  projectIds: ["soduco"],
  venue: { name: "EPITA-LRE", location: null },
  publication: {
    doi: null,
    url: "https://example.org/report.pdf",
    volume: null,
    issue: null,
    pages: null,
    publisher: "EPITA-LRE"
  },
  ranking: { core: null, scimago: null },
  links: {
    pdf: [{ url: "https://example.org/report.pdf", label: "PDF", description: "Version 2" }],
    slides: [],
    poster: [],
    event: [],
    video: []
  },
  image: null,
  related: { publicationIds: [] },
  bibtex: { type: "techreport", key: "doe.26.report", includeInDownload: true, fields: {} }
}
```

### Invited seminar / talk

```json
{
  id: "talk-2026-04-01-example",
  category: "talk",
  subtype: "Invited seminar",
  title: {
    text: "From OCR to Linked Historical Knowledge",
    html: "From OCR to <em>Linked Historical Knowledge</em>"
  },
  authors: [],
  date: "2026-04-01",
  summary: "Invited talk about extraction pipelines and reproducibility.",
  projectIds: ["soduco", "mezanno"],
  venue: { name: "IXXI seminar", location: "Lyon, France" },
  publication: {
    doi: null,
    url: null,
    volume: null,
    issue: null,
    pages: null,
    publisher: null
  },
  ranking: { core: null, scimago: null },
  links: {
    pdf: [],
    slides: [{ url: "https://example.org/slides.pdf", label: "PDF slides", description: null }],
    poster: [],
    event: [{ url: "https://example.org/event", label: "Event page", description: null }],
    video: [{ url: "https://youtu.be/...", label: "Recording", description: null }]
  },
  image: null,
  related: { publicationIds: ["doe.25.journal"] },
  bibtex: { type: "misc", key: "doe.26.ixxi-talk", includeInDownload: true, fields: {} }
}
```

## Notes

- Prefer keeping `title.text` as plain text and use `title.html` only when needed.
- JSON does not support comments; document conventions in this file instead.
- For file-related links, use arrays even for one link to support alternates.
- Code/model artifacts are managed in `src/_data/resources.json` (not in bibliography links).
- Use `projectIds` to preserve cross-linking with project cards.
- `bibtex.fields` lets you override/add fields without changing rendering fields.
