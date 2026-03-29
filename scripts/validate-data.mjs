import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "src", "_data");

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function pushWarning(warnings, message) {
  warnings.push(message);
}

function duplicateValues(values) {
  const seen = new Set();
  const dup = new Set();
  for (const value of values) {
    if (seen.has(value)) dup.add(value);
    else seen.add(value);
  }
  return [...dup];
}

function entryLabel(entry) {
  return entry?.id ? `id="${entry.id}"` : "entry with missing id";
}

function validate() {
  const warnings = [];

  const projects = readJson("projects.json");
  const resourcesDoc = readJson("resources.json");
  const resources = Array.isArray(resourcesDoc?.entries) ? resourcesDoc.entries : [];
  const bibliography = readJson("bibliography.json");
  const bibEntries = Array.isArray(bibliography?.entries) ? bibliography.entries : [];

  if (!Number.isInteger(resourcesDoc?.version) || resourcesDoc.version < 1) {
    pushWarning(
      warnings,
      `resources.json has invalid or missing version "${resourcesDoc?.version}" (expected integer >= 1)`
    );
  }
  if (!Array.isArray(resourcesDoc?.entries)) {
    pushWarning(warnings, "resources.json must define an entries array");
  }

  const projectIds = new Set((projects || []).map((p) => p.id).filter(Boolean));
  const publicationIds = new Set(
    bibEntries
      .filter((entry) => entry?.category === "publication")
      .map((entry) => entry.id)
      .filter(Boolean)
  );

  for (const duplicatedId of duplicateValues((resources || []).map((r) => r.id).filter(Boolean))) {
    pushWarning(warnings, `Duplicate resource id: "${duplicatedId}"`);
  }
  for (const duplicatedId of duplicateValues(bibEntries.map((entry) => entry?.id).filter(Boolean))) {
    pushWarning(warnings, `Duplicate bibliography entry id: "${duplicatedId}"`);
  }

  const validResourceTypes = new Set(["software", "dataset", "model"]);
  for (const resource of resources || []) {
    if (!resource?.id) {
      pushWarning(warnings, "Resource entry is missing required field: id");
      continue;
    }
    if (!validResourceTypes.has(resource.type)) {
      pushWarning(
        warnings,
        `Resource ${entryLabel(resource)} has invalid type "${resource.type}" (expected software|dataset|model)`
      );
    }
    for (const pid of resource.projectIds || []) {
      if (!projectIds.has(pid)) {
        pushWarning(
          warnings,
          `Resource ${entryLabel(resource)} references unknown project id "${pid}"`
        );
      }
    }
    for (const pubId of resource.publicationIds || []) {
      if (!publicationIds.has(pubId)) {
        pushWarning(
          warnings,
          `Resource ${entryLabel(resource)} references unknown publication id "${pubId}"`
        );
      }
    }
    if ((resource.publicationIds || []).length > 0 && (!resource.authors || !resource.authors.length)) {
      pushWarning(
        warnings,
        `Resource ${entryLabel(resource)} has publicationIds but no authors`
      );
    }
  }

  for (const entry of bibEntries) {
    if (!entry?.id) {
      pushWarning(warnings, "Bibliography entry is missing required field: id");
      continue;
    }
    for (const pid of entry.projectIds || []) {
      if (!projectIds.has(pid)) {
        pushWarning(
          warnings,
          `Bibliography ${entryLabel(entry)} references unknown project id "${pid}"`
        );
      }
    }
    for (const relatedPubId of entry?.related?.publicationIds || []) {
      if (!publicationIds.has(relatedPubId)) {
        pushWarning(
          warnings,
          `Bibliography ${entryLabel(entry)} references unknown related publication id "${relatedPubId}"`
        );
      }
    }
  }

  return warnings;
}

function report(warnings) {
  if (!warnings.length) {
    console.log("[data-check] OK: no warnings");
    return;
  }
  console.warn(`[data-check] ${warnings.length} warning(s):`);
  warnings.forEach((warning, index) => {
    console.warn(`[data-check] ${index + 1}. ${warning}`);
  });
}

try {
  const warnings = validate();
  report(warnings);
} catch (error) {
  console.error("[data-check] Validation failed:", error.message);
  process.exit(1);
}
