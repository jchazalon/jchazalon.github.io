const { loadBibliographyDocument, bibtexDocument } = require("./bibliographySource.cjs");

module.exports = function () {
  const doc = loadBibliographyDocument();
  return bibtexDocument(doc.entries || []);
};
