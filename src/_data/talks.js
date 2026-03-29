const { loadBibliographyDocument, linkUrls } = require("./bibliographySource.cjs");

module.exports = function () {
  const doc = loadBibliographyDocument();
  return (doc.entries || [])
    .filter((item) => item && item.category === "talk")
    .map((item) => ({
      id: item.id,
      date: item.date || null,
      title: item?.title?.text || "",
      titleHtml: item?.title?.html || null,
      event: item?.venue?.name || null,
      location: item?.venue?.location || null,
      kind: item.subtype || null,
      summary: item.summary || null,
      href: linkUrls(item?.links?.event)[0] || null,
      slides: linkUrls(item?.links?.slides)[0] || null,
      video: linkUrls(item?.links?.video)[0] || null,
      projectIds: item.projectIds || [],
    }))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
};
