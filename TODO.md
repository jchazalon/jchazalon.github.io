# TODO — Remaining Tasks

> Project context, architecture, and agent instructions live in
> [`AGENTS.md`](AGENTS.md).

## Current Status

- Core site pages populated from CV sources: home, contact, teaching,
  projects, resources, news.
- `publications.bib` contains a broad publication list with DOI/URL/PDF
  enrichments.
- Major project cards created: mezanno, soduco, ner-historical-docs,
  maptext-competitions, mobile-doc-capture, brainles-miccai, numis-coins,
  irisa-yvelines-archives.
- Build is healthy (`npm run build` succeeds).

## Human-Only Tasks (needs assets, private links, or decisions)

1. **Provide real personal URLs** in `src/_data/site.json`
   - `cvUrl` (public PDF URL)
   - `scheduleUrl` (booking/calendar URL)
2. **Provide/choose visual assets**
   - Project and publication thumbnails under `src/assets/images/`
   - Decide which projects/publications get `image`/`thumb`
3. **Final curation decisions**
   - Keep national conferences/workshops/invited talks in `publications.bib`?
     If so, decide how to discriminate visually and/or enable sorting/filtering.
   - Or move some to `news` / activity pages.
4. **Publication long-tail details**
   - Remaining fine-grained bibliographic polish for unresolved records
     (human-owned by default; agents resume only if explicitly asked).

## Agent-Doable Tasks (no private data needed)

1. **Wire assets once provided**
   - Update JSON/BibTeX fields (`image`, `thumb`) and verify rendering.
2. **Remove documentation fragments from templates**
   - E.g. author-facing notes at the top of `src/publications/index.njk`.
3. **Consistency cleanup pass**
   - Normalize venue naming in `publications.bib` (`booktitle`/`journal` style).
   - Optional author-name accent harmonization.
4. **News/activity restructuring** (if requested)
   - Move selected non-paper bibliography items into `news` or separate
     data files.
5. **Verification**
   - Run `npm run build` and fix any parse/render issues after each batch.

## Key Files for Ongoing Work

- `src/_data/site.json` — pending real URLs
- `src/_data/projects.json` — project cards and IDs
- `src/_data/news.json` — activity/news curation
- `src/_data/software.json`, `datasets.json`, `models.json`
- `publications.bib`
- `src/publications/index.njk`
- `src/projects/index.njk`
