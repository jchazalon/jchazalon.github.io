const {
  enrichProjects,
  isRecentProject,
} = require("./_data/projectEnrichment.cjs");

module.exports = {
  eleventyComputed: {
    projectsRecentHome: (data) => {
      const year = new Date().getFullYear();
      return enrichProjects(data).filter((p) => isRecentProject(p, year));
    },
  },
};
