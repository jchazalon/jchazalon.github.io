# TODO.md — Website Population Handoff

## Current Status (high level)

- Core site pages are populated from CV sources: `home`, `contact`, `teaching`, `projects`, `resources`, `news`.
- `publications.bib` is no longer placeholder content; it contains a broad publication list with many DOI/URL/PDF enrichments.
- Project coverage now includes major lines: `mezanno`, `soduco`, `ner-historical-docs`, `maptext-competitions`, `mobile-doc-capture`, `brainles-miccai`, `numis-coins`, `irisa-yvelines-archives`.
- Build is healthy after all changes (`npm run build` succeeds).

## Remaining Tasks

### Human-only (needs assets, private links, or policy decisions)

1. **Provide real personal URLs** in `src/_data/site.json`
   - Set `cvUrl` (public PDF URL)
   - Set `scheduleUrl` (booking/calendar URL)
2. **Provide/choose visual assets**
   - Project and publication thumbnails under `src/assets/images/`
   - Decide which projects/publications should get `image`/`thumb`
3. **Final curation decision**
   - Decide if national conferences/workshops/invited talks remain in `publications.bib`
   - Or move some to `news` / activity pages
4. **Publication long-tail details (delegated to human by request)**
   - Remaining fine-grained bibliographic polish for unresolved records

### Agent-doable (no extra private data needed)

1. **Wire assets once provided**
   - Update JSON/BibTeX fields (`image`, `thumb`) and verify rendering
2. **Consistency cleanup pass**
   - Normalize venue naming patterns in `publications.bib` (`booktitle`, `journal` style consistency)
   - Optional author-name accent harmonization
3. **News/activity restructuring (if requested)**
   - Move selected bibliography-like non-paper items into `news` or separate data files
4. **Verification**
   - Run `npm run build` and fix parse/render issues after each batch

## Important Knowledge For Next Agent

### Build + environment

- Stack: Eleventy 3.
- Build command: `npm run build`.
- If `npm` not found, run: `source ~/.nvm/nvm.sh`.

### Publication data pipeline

- Bibliographic parsing: `src/_data/publications.js` + Citation.js.
- Extra fields parser: `src/_data/bibEntryExtras.cjs`.
- Extra supported fields in `publications.bib`:
  - `projects`, `pdf`, `slides`, `poster`, `code`, `model`, `thumb`/`image`, `core`, `scimago`
- `publications.js` only keeps supported CSL types; unsupported BibTeX entry types are filtered out.

### Cross-linking contract

- Project IDs are the shared namespace across files.
- `publications.bib`: `projects = {id}` or `{id1 and id2}`
- Resource JSON files: `projectIds: []`
- Project enrichment is done in `src/projects/projects.11tydata.js`.

### Asset serving rules

- `src/assets/**` is copied to `_site/assets/**`.
- Use web paths like `/assets/images/...` in JSON/BibTeX.

### Source files used

- `../cv/docs-latex/cv-joseph-chazalon-en.tex`
- `../cv/docs-latex/parts-en/10-general.tex`
- `../cv/docs-latex/parts-en/20-research-activities.tex`
- `../cv/docs-latex/parts-en/30-responsibilities.tex`
- `../cv/docs-latex/parts-en/40-supervision.tex`
- `../cv/docs-latex/parts-en/50-sci-activities.tex`
- `../cv/docs-latex/joseph.bib`

## Files Most Relevant For Ongoing Work

- `src/_data/site.json` (pending real URLs)
- `src/_data/projects.json` (project cards and IDs)
- `src/_data/news.json` (activity/news curation)
- `src/_data/software.json`
- `src/_data/datasets.json`
- `src/_data/models.json`
- `publications.bib`
- `src/publications/index.njk`
- `src/projects/index.njk`

## Notes

- Publication-detail continuation is intentionally **human-owned by default** (per latest user direction), but agents can resume if explicitly requested.
- Detailed per-step execution history was intentionally condensed here to keep handoff practical.
