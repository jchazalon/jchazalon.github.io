const fs = require("fs");
const path = require("path");
const { Cite } = require("@citation-js/core");
require("@citation-js/plugin-bibtex");
const { parsePublicationExtrasByCitationKey } = require("./bibEntryExtras.cjs");

const PUBLICATION_TYPES = new Set([
  "article",
  "article-journal",
  "paper-conference",
  "book",
  "thesis",
  "chapter",
  "report",
  "manuscript",
]);

module.exports = async function () {
  const root = path.join(__dirname, "..", "..");
  const bibPath = path.join(root, "publications.bib");
  const bib = fs.readFileSync(bibPath, "utf8");
  const cite = await Cite.async(bib);
  const extrasMap = parsePublicationExtrasByCitationKey(bib);

  const entries = cite.data
    .filter((item) => PUBLICATION_TYPES.has(item.type))
    .map((item) => {
      const key = item["citation-key"] || item.id;
      const extra = extrasMap[key] || extrasMap[item.id] || {
        projectIds: [],
        bibLinks: { pdf: [], slides: [], poster: [], code: [], model: [] },
        thumb: null,
        core: null,
        scimago: null,
      };
      const { _graph, ...rest } = item;
      return {
        ...rest,
        projectIds: extra.projectIds || [],
        bibLinks: extra.bibLinks || {
          pdf: [],
          slides: [],
          poster: [],
          code: [],
          model: [],
        },
        thumb: extra.thumb || null,
        core: extra.core || null,
        scimago: extra.scimago || null,
      };
    });

  entries.sort((a, b) => {
    const ya = Number(a.issued?.["date-parts"]?.[0]?.[0]) || 0;
    const yb = Number(b.issued?.["date-parts"]?.[0]?.[0]) || 0;
    return yb - ya;
  });

  return entries;
};
