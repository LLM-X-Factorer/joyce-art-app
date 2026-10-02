import { describe, expect, it } from "vitest";
import type { WorkDto } from "@common-room/shared";
import { essayWordTotal, scoreEssayResponse } from "./essay";

const olympia = {
  slug: "olympia-collection",
  category: "painting",
  culture: "Paris modern life",
  title: "奥林匹亚"
} as WorkDto;

describe("essayWordTotal", () => {
  it("英文按词计，中文每两个字计一个", () => {
    expect(essayWordTotal("The gaze is direct.")).toBe(4);
    expect(essayWordTotal("凝视直接面对观看者")).toBe(5);
    expect(essayWordTotal("   ")).toBe(0);
  });
});

describe("scoreEssayResponse", () => {
  it("很短的描述得到低分并提示补充", () => {
    const result = scoreEssayResponse(olympia, ["奥林匹亚", "Olympia"], "现代性", "visual", "", "A woman on a bed.");
    expect(result.score).toBeLessThan(4);
    expect(result.feedback).toEqual(expect.arrayContaining(["length", "visual", "thesis"]));
  });

  it("中文写作提到中文标题也能获得具体性分数", () => {
    const body =
      "《奥林匹亚》的光线平而直接，身体的轮廓清楚，凝视直接对着观看者。色彩和构图让空间变浅，因此这件作品揭示了现代城市中观看与交易的关系，这很重要。";
    const withTitle = scoreEssayResponse(olympia, ["奥林匹亚", "Olympia"], "现代性", "visual", "它之所以现代，是因为拒绝神话", body);
    const withoutTitle = scoreEssayResponse(olympia, ["Olympia"], "现代性", "visual", "它之所以现代，是因为拒绝神话", body);
    expect(withTitle.score).toBeGreaterThan(withoutTitle.score);
    expect(withTitle.feedback).not.toContain("visual");
  });

  it("论述模式要求历史语境", () => {
    const result = scoreEssayResponse(olympia, ["Olympia"], "Modernity", "essay", "Olympia matters because", "Line and color and light.");
    expect(result.feedback).toContain("context");
  });
});
