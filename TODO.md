# TODO — Remaining Tasks

> Project context, architecture, and agent instructions live in
> [`AGENTS.md`](AGENTS.md).

## Current Status

- Core site pages populated from CV sources: home, contact, teaching,
  projects, resources, news.
- `src/_data/bibliography.json` now drives both publications and talks;
  `/publications.bib` is generated at build time.
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
   - Keep all communications in `bibliography.json`, or move selected
     activity items to `news`.
   - Decide how to discriminate visually and/or enable sorting/filtering
     between publications and talks.
4. **Publication long-tail details**
   - Remaining fine-grained bibliographic polish for unresolved records
     (human-owned by default; agents resume only if explicitly asked).

## Agent-Doable Tasks (no private data needed)


1. Add start and end date for projects on home page
1. Update subtitle below "Joseph Chazalon" on top of pages. Simplify description, maybe format on two lines: Research fields on first line, "Assistant Professor at EPITA Paris, France" on second.
1. **Wire assets once provided**
   - Update bibliography/resource fields (`image`) and verify rendering.
2. **Remove documentation fragments from templates**
   - E.g. author-facing notes at the top of `src/publications/index.njk`.
3. **Consistency cleanup pass**
   - Normalize venue naming and entry subtypes in `bibliography.json`.
   - Optional author-name accent harmonization.
4. **Verification**
   - Run `npm run build` and fix any parse/render issues after each batch.

## Key Files for Ongoing Work

- `src/_data/site.json` — pending real URLs
- `src/_data/projects.json` — project cards and IDs
- `src/_data/news.json` — activity/news curation
- `src/_data/resources.json`
- `src/_data/bibliography.json`
- `src/publications/index.njk`
- `src/projects/index.njk`
