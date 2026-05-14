import { describe, expect, it } from "vitest";
import { searchPreviewFeatures } from "@/features/map/searchPreviewFeatures";

describe("searchPreviewFeatures", () => {
  it("matches a feature by its Arabic name property", () => {
    const result = searchPreviewFeatures(
      [
        { id: "1", properties: { name: "حي الزيتون" } },
        { id: "2", properties: { name: "حي الرمال" } },
      ],
      "الزيتون",
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
