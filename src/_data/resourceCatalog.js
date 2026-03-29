const {
  loadResources,
  splitResourcesByType,
  mapResourcesByPublicationId,
  publicationSummariesById,
} = require("./resourcesSource.cjs");

module.exports = function () {
  const all = loadResources();
  const byType = splitResourcesByType(all);
  const pubsById = publicationSummariesById();
  const withLinkedPublications = all.map((resource) => ({
    ...resource,
    linkedPublications: (resource.publicationIds || [])
      .map((id) => pubsById[id])
      .filter(Boolean),
  }));
  const byTypeWithLinkedPubs = splitResourcesByType(withLinkedPublications);

  return {
    all: withLinkedPublications,
    software: byTypeWithLinkedPubs.software,
    datasets: byTypeWithLinkedPubs.datasets,
    models: byTypeWithLinkedPubs.models,
    byPublicationId: mapResourcesByPublicationId(withLinkedPublications),
    counts: {
      all: withLinkedPublications.length,
      software: byType.software.length,
      datasets: byType.datasets.length,
      models: byType.models.length,
    },
  };
};
