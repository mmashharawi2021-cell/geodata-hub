import { describe, expect, it } from "vitest";
import { parseGeoJsonFile } from "@/services/layers/parseGeoJson";

describe("parseGeoJsonFile", () => {
  it("extracts a feature count and geometry type", async () => {
    const file = new File(
      [
        '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[34.4,31.5]},"properties":{"name":"موقع"}}]}',
      ],
      "points.geojson",
      { type: "application/geo+json" },
    );

    const result = await parseGeoJsonFile(file);

    expect(result.recordsCount).toBe(1);
    expect(result.geometryType).toBe("point");
  });
});
