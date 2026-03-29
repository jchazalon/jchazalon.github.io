const fs = require("fs");
const path = require("path");
const { loadBibliographyDocument } = require("./bibliographySource.cjs");

function sourcePath() {
  return path.join(__dirname, "resources.json");
}

function normalizeResource(resource) {
  if (!resource || typeof resource !== "object") return null;
  const authors = Array.isArray(resource.authors)
    ? resource.authors
        .map((a) => {
          if (!a) return null;
          if (typeof a === "string") return a;
          if (typeof a === "object") {
            if (a.literal) return String(a.literal);
            const family = a.family || "";
            const given = a.given || "";
            if (family && given) return `${family}, ${given}`;
            return family || given || null;
          }
          return null;
        })
        .filter(Boolean)
    : [];
  return {
    id: resource.id || null,
    type: resource.type || null,
    name: resource.name || "",
    description: resource.description || "",
    url: resource.url || "",
    image: resource.image || null,
    projectIds: Array.isArray(resource.projectIds) ? resource.projectIds : [],
    publicationIds: Array.isArray(resource.publicationIds)
      ? resource.publicationIds
      : [],
    authors,
  };
}

function loadResources() {
  const raw = fs.readFileSync(sourcePath(), "utf8");
  const doc = JSON.parse(raw);
  const list = Array.isArray(doc?.entries) ? doc.entries : [];
  return Array.isArray(list) ? list.map(normalizeResource).filter(Boolean) : [];
}

function splitResourcesByType(resources) {
  const all = Array.isArray(resources) ? resources : [];
  return {
    software: all.filter((r) => r.type === "software"),
    datasets: all.filter((r) => r.type === "dataset"),
    models: all.filter((r) => r.type === "model"),
  };
}

function mapResourcesByPublicationId(resources) {
  const map = Object.create(null);
  for (const resource of resources || []) {
    for (const pubId of resource.publicationIds || []) {
      if (!map[pubId]) map[pubId] = [];
      map[pubId].push(resource);
    }
  }
  return map;
}

function publicationSummariesById() {
  const bibliography = loadBibliographyDocument();
  const out = Object.create(null);
  for (const entry of bibliography.entries || []) {
    if (entry.category !== "publication") continue;
    const doi = entry?.publication?.doi || null;
    const doiUrl = doi
      ? `https://doi.org/${String(doi).replace(/^https?:\/\/doi\.org\//i, "")}`
      : null;
    out[entry.id] = {
      id: entry.id,
      title: entry?.title?.text || entry.id,
      year: String(entry.date || "").slice(0, 4) || "",
      url: entry?.publication?.url || doiUrl,
    };
  }
  return out;
}

module.exports = {
  loadResources,
  splitResourcesByType,
  mapResourcesByPublicationId,
  publicationSummariesById,
};
