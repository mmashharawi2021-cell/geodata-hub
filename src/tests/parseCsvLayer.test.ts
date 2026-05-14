import { describe, expect, it } from "vitest";
import { parseCsvLayerFile } from "@/services/layers/parseCsvLayer";

describe("parseCsvLayerFile", () => {
  it("converts lat/lng rows into point features", async () => {
    const file = new File(["name,lat,lng\nsite,31.5,34.4"], "points.csv", {
      type: "text/csv",
    });

    const result = await parseCsvLayerFile(file);

    expect(result.recordsCount).toBe(1);
    expect(result.preview.features[0].geometry?.type).toBe("Point");
  });
});
