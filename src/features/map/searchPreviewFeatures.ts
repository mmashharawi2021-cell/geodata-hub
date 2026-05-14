export interface SearchablePreviewFeature {
  id: string;
  properties?: Record<string, unknown>;
}

export function searchPreviewFeatures(
  features: SearchablePreviewFeature[],
  query: string,
) {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return [];
  }

  return features.filter((feature) =>
    Object.values(feature.properties ?? {}).some((value) =>
      String(value).toLowerCase().includes(needle),
    ),
  );
}
