module.exports = class {
  data() {
    return {
      permalink: "/publications.bib",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    return data.publicationsBib || "";
  }
};
