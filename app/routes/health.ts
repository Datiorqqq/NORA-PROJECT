// GET /health is a public Node-runtime smoke check.
export function loader() {
  return Response.json(
    { service: "nora", status: "ok" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
