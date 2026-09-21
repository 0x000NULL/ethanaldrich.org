import { describe, it, expect } from "vitest";
import { buildBreadcrumbJsonLd, buildStationJsonLd } from "./jsonLd";
import { PROFILE } from "@/data/profile";
import { getStation } from "@/data/subway";

describe("buildBreadcrumbJsonLd", () => {
  it("numbers crumbs from 1 and absolutises paths", () => {
    const ld = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/blog" },
      { name: "A Post" },
    ]);

    expect(ld["@type"]).toBe("BreadcrumbList");
    const items = ld.itemListElement as Record<string, unknown>[];
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[0].item).toBe(`${PROFILE.site}/`);
    expect(items[1].item).toBe(`${PROFILE.site}/blog`);
  });

  it("leaves the current page without an item", () => {
    const ld = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Here" }]);
    const items = ld.itemListElement as Record<string, unknown>[];
    expect(items[1]).not.toHaveProperty("item");
    expect(items[1].name).toBe("Here");
  });

  it("handles an empty list", () => {
    expect(buildBreadcrumbJsonLd([]).itemListElement).toEqual([]);
  });
});

describe("buildStationJsonLd", () => {
  it("describes a station as an Article pointing at its own URL", () => {
    const station = getStation("C-01")!;
    const ld = buildStationJsonLd(station);

    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(station.name);
    expect(ld.description).toBe(station.summary);
    expect(ld.url).toBe(`${PROFILE.site}/station/C-01`);
    expect((ld.mainEntityOfPage as Record<string, unknown>)["@id"]).toBe(ld.url);
    expect((ld.author as Record<string, unknown>).name).toBe(PROFILE.name);
  });

  it("carries the stack as keywords when there is one", () => {
    expect(buildStationJsonLd(getStation("C-01")!).keywords).toContain(
      "Kubernetes"
    );
  });

  it("omits keywords rather than emitting an empty string", () => {
    // W-02 has no stack.
    expect(buildStationJsonLd(getStation("W-02")!)).not.toHaveProperty(
      "keywords"
    );
  });

  it("claims no date, because a station has no reliable published date", () => {
    const ld = buildStationJsonLd(getStation("C-01")!);
    expect(ld).not.toHaveProperty("datePublished");
    expect(ld).not.toHaveProperty("dateModified");
  });
});
