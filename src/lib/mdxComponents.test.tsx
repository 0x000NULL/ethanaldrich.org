import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { createElement, type ReactElement } from "react";
import { mdxComponents } from "./mdxComponents";

const C = mdxComponents as Record<
  string,
  (props: Record<string, unknown>) => ReactElement
>;

function r(name: string, props: Record<string, unknown> = {}, children: unknown = "x") {
  return render(createElement(C[name], props, children as never));
}

describe("mdxComponents", () => {
  it("renders the basic block and inline elements", () => {
    for (const name of [
      "h1",
      "h2",
      "h3",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "strong",
      "em",
      "hr",
    ]) {
      const { container } = r(name);
      expect(container.firstChild).toBeTruthy();
    }
  });

  it("styles inline code with a pill but leaves highlighted block code raw", () => {
    const inline = r("code", {}, "x").container.querySelector("code")!;
    expect(inline.className).toContain("board-type");

    const block = r("code", { "data-language": "rust" }, "fn").container.querySelector(
      "code"
    )!;
    expect(block.getAttribute("data-language")).toBe("rust");
    expect(block.className).not.toContain("board-type");

    const themed = r("code", { "data-theme": "github-light" }, "y").container.querySelector(
      "code"
    )!;
    expect(themed.getAttribute("data-theme")).toBe("github-light");
  });

  it("renders pre with and without an incoming style", () => {
    const plain = r("pre", {}, "code").container.querySelector("pre")!;
    expect(plain.className).toContain("overflow-x-auto");

    const styled = r("pre", { style: { tabSize: 2 } }, "code").container.querySelector(
      "pre"
    )!;
    expect(styled).toBeTruthy();
  });

  it("renders GFM table cells", () => {
    expect(r("table", {}, "t").container.querySelector("table")).toBeTruthy();
    expect(r("th", {}, "H").container.querySelector("th")).toBeTruthy();
    expect(r("td", {}, "D").container.querySelector("td")).toBeTruthy();
  });

  it("renders images with an alt fallback and merged classes/styles", () => {
    // <img> is a void element — render with no children.
    const withAlt = render(
      createElement(C.img, {
        alt: "A diagram",
        className: "extra",
        style: { opacity: 0.5 },
        src: "/x.png",
      })
    ).container.querySelector("img")!;
    expect(withAlt.getAttribute("alt")).toBe("A diagram");
    expect(withAlt.className).toContain("extra");
    expect(withAlt.className).toContain("rounded");

    const noAlt = render(
      createElement(C.img, { src: "/y.png" })
    ).container.querySelector("img")!;
    expect(noAlt.getAttribute("alt")).toBe("");
  });
});
