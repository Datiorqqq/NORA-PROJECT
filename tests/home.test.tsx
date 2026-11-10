import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home, { loader, meta } from "../app/routes/home";

describe("Moodle login page", () => {
  it("declares the Nora title and foundation status", () => {
    expect(meta()).toEqual([{ title: "Вхід у Moodle — Nora" }]);
    expect(loader()).toEqual({ service: "Nora", status: "foundation" });
  });

  it("links to the official Moodle sign-in without claiming a Nora session", () => {
    const html = renderToStaticMarkup(
      createElement(Home, { loaderData: loader() } as React.ComponentProps<typeof Home>),
    );

    expect(html).toContain('action="https://e-learning.lnu.edu.ua/login/index.php"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain("OpenID Connect");
    expect(html).toContain("Сесію Nora цей крок");
  });
});
