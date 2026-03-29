# Resources Data Guide

Canonical source: `src/_data/resources.json`

This file contains all artifact types shown on `/resources/`:
- software
- datasets
- models

It also powers automatic cross-links with publications through `publicationIds`.

## Schema

```json
{
  "version": 1,
  "entries": [
    {
    "id": "resource-id",
    "type": "software",
    "name": "Resource name",
    "description": "Short description.",
    "url": "https://example.org",
    "image": null,
    "projectIds": ["project-id"],
    "publicationIds": ["publication-id"],
      "authors": ["Surname, Given", "Consortium Name"]
    }
  ]
}
```

## Required fields

- `id`: stable slug.
- `type`: one of `software`, `dataset`, `model`.
- `name`, `description`, `url`.

## Optional fields

- `image`: `/assets/...` path or absolute URL.
- `projectIds`: project cross-linking.
- `publicationIds`: publication cross-linking.
- `authors`: artifact-specific author list (may differ from publication authors).

## Notes

- Keep `publicationIds` aligned with `src/_data/bibliography.json` entry IDs.
- Publication pages surface related resources automatically using `publicationIds`.
- Resources page surfaces related publications automatically using `publicationIds`.
