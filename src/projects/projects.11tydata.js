function enrichProjects(data) {
  const { projects, publications, software, datasets, models } = data;
  if (!projects) return [];
  return projects.map((project) => ({
    ...project,
    linkedPublications: (publications || []).filter((p) =>
      (p.projectIds || []).includes(project.id)
    ),
    linkedSoftware: (software || []).filter((s) =>
      (s.projectIds || []).includes(project.id)
    ),
    linkedDatasets: (datasets || []).filter((d) =>
      (d.projectIds || []).includes(project.id)
    ),
    linkedModels: (models || []).filter((m) =>
      (m.projectIds || []).includes(project.id)
    ),
  }));
}

function isOngoingProject(project) {
  return project.endYear == null || project.endYear === "";
}

module.exports = {
  eleventyComputed: {
    projectsWithArtifacts: (data) => enrichProjects(data),
    projectsOngoing: (data) =>
      (data.projectsWithArtifacts || []).filter((p) => isOngoingProject(p)),
    projectsPast: (data) =>
      (data.projectsWithArtifacts || []).filter((p) => !isOngoingProject(p)),
  },
};
