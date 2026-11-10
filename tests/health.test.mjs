import assert from "node:assert/strict";
import { test } from "node:test";
import { loader } from "../app/routes/health.ts";

test("health endpoint returns a successful no-cache response", async () => {
  const response = loader();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { service: "nora", status: "ok" });
});
