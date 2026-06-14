import { describe, expect, it } from "vitest";
import { BRAND_GRADIENT_CSS, BRAND_GRADIENT_STOPS, NEUTRALS } from "./brand";

describe("brand tokens", () => {
  it("defines the 4-stop primary gradient", () => {
    expect(BRAND_GRADIENT_STOPS).toHaveLength(4);
    expect(BRAND_GRADIENT_STOPS[0]).toBe("#7B2DFF");
    expect(BRAND_GRADIENT_STOPS[3]).toBe("#FFC700");
  });

  it("composes a valid CSS gradient", () => {
    expect(BRAND_GRADIENT_CSS).toContain("linear-gradient(90deg");
    expect(BRAND_GRADIENT_CSS).toContain("#FF2D72");
  });

  it("exposes the darkest neutral (ink) and white", () => {
    expect(NEUTRALS.ink).toBe("#0B0D17");
    expect(NEUTRALS.white).toBe("#FFFFFF");
  });
});
