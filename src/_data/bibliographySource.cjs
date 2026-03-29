const fs = require("fs");
const path = require("path");

function sourcePath() {
  return path.join(__dirname, "bibliography.json");
}

function loadBibliographyDocument() {
  const raw = fs.readFileSync(sourcePath(), "utf8");
  const doc = JSON.parse(raw);
  const entries = Array.isArray(doc?.entries) ? doc.entries : [];
  return { ...doc, entries };
}

function datePartsFromIsoLike(dateValue) {
  if (!dateValue) return null;
  const s = String(dateValue).trim();
  const m = s.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return null;
  const parts = [Number(m[1])];
  if (m[2]) parts.push(Number(m[2]));
  if (m[3]) parts.push(Number(m[3]));
  return [parts];
}

function mapAuthorsForPublication(authors) {
  if (!Array.isArray(authors)) return [];
  return authors
    .map((a) => {
      if (!a || typeof a !== "object") return null;
      if (a.literal) return String(a.literal);
      if (a.family || a.given) {
        return {
          family: a.family || "",
          given: a.given || "",
        };
      }
      return null;
    })
    .filter(Boolean);
}

function linkUrls(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((x) => (x && typeof x === "object" ? x.url : null))
    .filter(Boolean);
}

function bibtexEscape(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

function authorToBibtex(author) {
  if (!author || typeof author !== "object") return "";
  if (author.literal) return String(author.literal);
  const family = author.family ? String(author.family) : "";
  const given = author.given ? String(author.given) : "";
  if (family && given) return `${family}, ${given}`;
  return family || given;
}

function toBibtexFieldValue(field, entry) {
  if (field === "title") return entry?.title?.text || "";
  if (field === "year") return String(entry.date || "").slice(0, 4);
  if (field === "author") {
    return (entry.authors || []).map(authorToBibtex).filter(Boolean).join(" and ");
  }
  if (field === "booktitle" || field === "journal")
    return entry?.venue?.name || "";
  if (field === "doi") return entry?.publication?.doi || "";
  if (field === "url") return entry?.publication?.url || "";
  if (field === "volume") return entry?.publication?.volume || "";
  if (field === "number") return entry?.publication?.issue || "";
  if (field === "pages") return entry?.publication?.pages || "";
  if (field === "publisher") return entry?.publication?.publisher || "";
  if (field === "projects") return (entry.projectIds || []).join(" and ");
  if (field === "pdf")
    return linkUrls(entry?.links?.pdf).join(", ");
  if (field === "slides")
    return linkUrls(entry?.links?.slides).join(", ");
  if (field === "poster")
    return linkUrls(entry?.links?.poster).join(", ");
  if (field === "thumb") return entry?.image || "";
  if (field === "core") return entry?.ranking?.core || "";
  if (field === "scimago") return entry?.ranking?.scimago || "";
  return "";
}

function bibtexFieldsForEntry(entry) {
  const fields = [];
  const push = (name, value) => {
    const v = String(value || "").trim();
    if (v) fields.push([name, v]);
  };
  push("title", toBibtexFieldValue("title", entry));
  push("author", toBibtexFieldValue("author", entry));
  push("year", toBibtexFieldValue("year", entry));

  const type = String(entry?.bibtex?.type || "misc").toLowerCase();
  if (type === "inproceedings" || type === "conference") {
    push("booktitle", toBibtexFieldValue("booktitle", entry));
  } else if (type === "article") {
    push("journal", toBibtexFieldValue("journal", entry));
  } else {
    push("publisher", toBibtexFieldValue("publisher", entry));
  }

  push("doi", toBibtexFieldValue("doi", entry));
  push("url", toBibtexFieldValue("url", entry));
  push("volume", toBibtexFieldValue("volume", entry));
  push("number", toBibtexFieldValue("number", entry));
  push("pages", toBibtexFieldValue("pages", entry));

  push("projects", toBibtexFieldValue("projects", entry));
  push("pdf", toBibtexFieldValue("pdf", entry));
  push("slides", toBibtexFieldValue("slides", entry));
  push("poster", toBibtexFieldValue("poster", entry));
  push("thumb", toBibtexFieldValue("thumb", entry));
  push("core", toBibtexFieldValue("core", entry));
  push("scimago", toBibtexFieldValue("scimago", entry));

  const overrideFields = entry?.bibtex?.fields;
  if (overrideFields && typeof overrideFields === "object") {
    Object.entries(overrideFields).forEach(([k, v]) => {
      const idx = fields.findIndex(([name]) => name === k);
      const strV = String(v || "").trim();
      if (!strV) return;
      if (idx >= 0) fields[idx] = [k, strV];
      else fields.push([k, strV]);
    });
  }

  return fields;
}

function bibtexEntryString(entry) {
  const type = String(entry?.bibtex?.type || "misc").toLowerCase();
  const key = String(entry?.bibtex?.key || entry?.id || "").trim();
  if (!key) return "";
  const fields = bibtexFieldsForEntry(entry);
  const body = fields
    .map(([name, value]) => `  ${name} = {${bibtexEscape(value)}}`)
    .join(",\n");
  return `@${type}{${key},\n${body}\n}`;
}

function bibtexDocument(entries) {
  return (entries || [])
    .filter((entry) => entry?.bibtex?.includeInDownload !== false)
    .map(bibtexEntryString)
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}

module.exports = {
  loadBibliographyDocument,
  datePartsFromIsoLike,
  mapAuthorsForPublication,
  linkUrls,
  bibtexEntryString,
  bibtexDocument,
};
