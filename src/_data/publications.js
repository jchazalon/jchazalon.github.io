const {
  loadBibliographyDocument,
  datePartsFromIsoLike,
  mapAuthorsForPublication,
  linkUrls,
  bibtexEntryString,
} = require("./bibliographySource.cjs");
const {
  loadResources,
  splitResourcesByType,
  mapResourcesByPublicationId,
} = require("./resourcesSource.cjs");

module.exports = function () {
  const doc = loadBibliographyDocument();
  const resources = loadResources();
  const resourcesByPubId = mapResourcesByPublicationId(resources);
  const entries = (doc.entries || [])
    .filter((item) => item && item.category === "publication")
    .map((item) => {
      const dateParts = datePartsFromIsoLike(item.date);
      const linked = resourcesByPubId[item.id] || [];
      const grouped = splitResourcesByType(linked);
      return {
        id: item.id,
        "citation-key": item.id,
        type: item.subtype || "manuscript",
        title: item?.title?.text || "",
        titleHtml: item?.title?.html || null,
        author: mapAuthorsForPublication(item.authors),
        issued: dateParts ? { "date-parts": dateParts } : null,
        URL: item?.publication?.url || linkUrls(item?.links?.event)[0] || null,
        DOI: item?.publication?.doi || null,
        "container-title": item?.venue?.name || "",
        volume: item?.publication?.volume || null,
        issue: item?.publication?.issue || null,
        page: item?.publication?.pages || null,
        publisher: item?.publication?.publisher || null,
        projectIds: item.projectIds || [],
        bibLinks: {
          pdf: linkUrls(item?.links?.pdf),
          slides: linkUrls(item?.links?.slides),
          poster: linkUrls(item?.links?.poster),
        },
        linkedResources: grouped,
        thumb: item.image || null,
        core: item?.ranking?.core || null,
        scimago: item?.ranking?.scimago || null,
        bibtex: bibtexEntryString(item),
      };
    });

  entries.sort((a, b) => {
    const ya = Number(a.issued?.["date-parts"]?.[0]?.[0]) || 0;
    const yb = Number(b.issued?.["date-parts"]?.[0]?.[0]) || 0;
    return yb - ya;
  });
  return entries;
};
