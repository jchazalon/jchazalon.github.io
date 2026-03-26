const { enrichProjects, isOngoingProject } = require("../_data/projectEnrichment.cjs");

module.exports = {
  eleventyComputed: {
    projectsWithArtifacts: (data) => enrichProjects(data),
    projectsOngoing: (data) =>
      (data.projectsWithArtifacts || []).filter((p) => isOngoingProject(p)),
    projectsPast: (data) =>
      (data.projectsWithArtifacts || []).filter((p) => !isOngoingProject(p)),
  },
};
