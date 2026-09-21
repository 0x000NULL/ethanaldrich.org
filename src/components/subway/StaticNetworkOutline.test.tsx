import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StaticNetworkOutline from "./StaticNetworkOutline";
import { STATIONS, LINES } from "@/data/subway";
import { PROFILE } from "@/data/profile";

/**
 * This component is the homepage's server-rendered payload: the content crawlers,
 * link-preview scrapers and no-JS visitors actually receive. These assertions are
 * the regression guard against it silently reverting to a loading placeholder.
 */
describe("StaticNetworkOutline", () => {
  it("names Ethan in the page's h1, not the transit brand", () => {
    const { container } = render(<StaticNetworkOutline />);
    const h1 = container.querySelector("h1")!;
    expect(h1.textContent).toBe(PROFILE.name);
  });

  it("renders the plain-language blurb for readers who skip the metaphor", () => {
    const { getByText } = render(<StaticNetworkOutline />);
    expect(getByText(PROFILE.blurb)).toBeTruthy();
  });

  it("exposes résumé, GitHub, LinkedIn and email without requiring JS", () => {
    const { container } = render(<StaticNetworkOutline />);
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) =>
      a.getAttribute("href")
    );
    expect(hrefs).toContain("/resume.pdf");
    expect(hrefs).toContain("https://github.com/0x000NULL");
    expect(hrefs).toContain("https://www.linkedin.com/in/ethan-aldrich");
    expect(hrefs).toContain(`mailto:${PROFILE.email}`);
  });

  it("links every station to its own crawlable page", () => {
    const { container } = render(<StaticNetworkOutline />);
    const hrefs = new Set(
      Array.from(container.querySelectorAll("a"))
        .map((a) => a.getAttribute("href"))
        .filter((h): h is string => !!h?.startsWith("/station/"))
    );
    expect(hrefs.size).toBe(STATIONS.length);
    for (const s of STATIONS) expect(hrefs.has(`/station/${s.code}`)).toBe(true);
  });

  it("renders a section per line with its stations listed", () => {
    const { container, getByText } = render(<StaticNetworkOutline />);
    expect(container.querySelectorAll("section").length).toBe(LINES.length);
    for (const line of LINES) expect(getByText(line.name)).toBeTruthy();
  });

  it("marks external links so they open safely", () => {
    const { container } = render(<StaticNetworkOutline />);
    const gh = container.querySelector('a[href="https://github.com/0x000NULL"]')!;
    expect(gh.getAttribute("target")).toBe("_blank");
    expect(gh.getAttribute("rel")).toContain("noopener");
  });
});
