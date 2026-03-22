/**
 * Reads custom braced fields from each BibTeX entry (by citation key).
 * - projects: site project ids (comma / "and"-separated)
 * - pdf, slides, poster, code, model: URLs (comma / "and"-separated for multiples)
 */

function findMatchingBrace(str, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function extractBracedField(entryInner, fieldName) {
  const safe = String(fieldName).replace(/[^a-z0-9_]/gi, "");
  if (!safe) return null;
  const re = new RegExp("\\b" + safe + "\\s*=\\s*\\{", "i");
  const m = re.exec(entryInner);
  if (!m) return null;
  const open = m.index + m[0].length - 1;
  let depth = 1;
  let j = open + 1;
  let sb = "";
  while (j < entryInner.length && depth) {
    const c = entryInner[j++];
    if (c === "{") {
      depth++;
      sb += c;
    } else if (c === "}") {
      depth--;
      if (depth > 0) sb += c;
    } else {
      sb += c;
    }
  }
  return depth === 0 ? sb.trim() : null;
}

function splitList(raw) {
  if (!raw) return [];
  return raw
    .replace(/\s+and\s+/gi, ",")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstToken(raw) {
  if (!raw) return null;
  const t = String(raw).trim();
  if (!t) return null;
  return t.split(/,/)[0].trim() || null;
}

function extrasForEntryInner(inner) {
  const rawProjects = extractBracedField(inner, "projects");
  const thumbRaw =
    extractBracedField(inner, "thumb") || extractBracedField(inner, "image");
  const coreRaw = extractBracedField(inner, "core");
  const scimagoRaw = extractBracedField(inner, "scimago");
  const bibLinks = {
    pdf: splitList(extractBracedField(inner, "pdf")),
    slides: splitList(extractBracedField(inner, "slides")),
    poster: splitList(extractBracedField(inner, "poster")),
    code: splitList(extractBracedField(inner, "code")),
    model: splitList(extractBracedField(inner, "model")),
  };
  return {
    projectIds: rawProjects ? splitList(rawProjects) : [],
    bibLinks,
    thumb: firstToken(thumbRaw),
    core: coreRaw ? String(coreRaw).trim() : null,
    scimago: scimagoRaw ? String(scimagoRaw).trim() : null,
  };
}

/**
 * @param {string} bib full .bib file contents
 * @returns {Record<string, { projectIds: string[], bibLinks: Record<string, string[]> }>}
 */
function parsePublicationExtrasByCitationKey(bib) {
  const map = Object.create(null);
  let i = 0;
  while (i < bib.length) {
    const at = bib.indexOf("@", i);
    if (at === -1) break;
    const lb = bib.indexOf("{", at);
    if (lb === -1) break;
    const typ = bib
      .slice(at + 1, lb)
      .replace(/\s+/g, "")
      .toLowerCase();
    if (typ === "comment" || typ === "string" || typ === "preamble") {
      const close = findMatchingBrace(bib, lb);
      i = close === -1 ? bib.length : close + 1;
      continue;
    }
    const afterBrace = bib.slice(lb + 1);
    const km = afterBrace.match(/^\s*([^,\s]+)\s*,/);
    if (!km) {
      i = at + 1;
      continue;
    }
    const key = km[1];
    const close = findMatchingBrace(bib, lb);
    if (close === -1) break;
    const inner = bib.slice(lb + 1, close);
    map[key] = extrasForEntryInner(inner);
    i = close + 1;
  }
  return map;
}

module.exports = { parsePublicationExtrasByCitationKey };
