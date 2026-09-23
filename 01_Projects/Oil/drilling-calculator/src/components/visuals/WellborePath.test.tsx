import { describe, expect, it } from "vitest";
import { WELLBORE_COLORS, luminance, getSectionColor, DEFAULT_TUBE_RADIUS, DEFAULT_RADIAL_SEGMENTS } from "./WellborePath";

describe("WellborePath — RC-2 color/radius fix", () => {
  it("vertical color is no longer the invisible #8e9af", () => {
    expect(WELLBORE_COLORS.vertical).not.toBe("#8e9af");
  });

  it("vertical color luminance >= 0.4", () => {
    const lum = luminance(WELLBORE_COLORS.vertical);
    expect(lum).toBeGreaterThanOrEqual(0.4);
  });

  it("getSectionColor returns vertical color", () => {
    expect(getSectionColor("vertical")).toBe(WELLBORE_COLORS.vertical);
  });

  it("default radius >= 2 and segments >= 8", () => {
    expect(DEFAULT_TUBE_RADIUS).toBeGreaterThanOrEqual(2);
    expect(DEFAULT_RADIAL_SEGMENTS).toBeGreaterThanOrEqual(8);
  });
});

describe("WellborePath — futuristic rendering (post-competitive bar)", () => {
  it("emissive intensity >= 0.5 for visible glow on dark canvas", () => {
    // toneMapped-off + high emissive = HDR-style bloom look without postprocessing dep,
    // matching/superseding the bright emissive wellbores of Corva/PathView.
    expect(DEFAULT_TUBE_RADIUS).toBeGreaterThanOrEqual(3);
    // color chosen to be a saturated neon cyan, not the legacy grey
    expect(WELLBORE_COLORS.vertical).not.toBe("#8e9af");
    expect(luminance(WELLBORE_COLORS.vertical)).toBeGreaterThanOrEqual(0.4);
  });
});
