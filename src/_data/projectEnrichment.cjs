function enrichProjects(data) {
  const { projects, publications, resourceCatalog } = data;
  const software = resourceCatalog?.software || [];
  const datasets = resourceCatalog?.datasets || [];
  const models = resourceCatalog?.models || [];
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

/** Ongoing, or ended within the last `windowYears` full calendar years (inclusive). */
function isRecentProject(project, currentYear, windowYears = 3) {
  if (isOngoingProject(project)) return true;
  const end = Number(project.endYear);
  if (Number.isNaN(end)) return false;
  return end >= currentYear - windowYears;
}

module.exports = { enrichProjects, isOngoingProject, isRecentProject };
