import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Riverside Youth Soccer")).toBe("riverside-youth-soccer");
  });

  it("collapses non-alphanumeric runs into a single hyphen", () => {
    expect(slugify("A.C. Milan!!  Fan Club")).toBe("a-c-milan-fan-club");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Wildcats--  ")).toBe("wildcats");
  });

  it("caps length at 60 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long)).toHaveLength(60);
  });
});
