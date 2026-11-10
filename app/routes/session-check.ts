import type { Route } from "./+types/session-check";
import { MissingServerConfigurationError } from "../.server/env";
import { getStudentId } from "../.server/session";

const headers = { "Cache-Control": "no-store" };

// This does not establish identity; issue #7 will provide real Moodle SSO.
export async function action({ request }: Route.ActionArgs) {
  try {
    const studentId = await getStudentId(request);
    if (!studentId) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers });
    }
    return Response.json({ authenticated: true }, { headers });
  } catch (error) {
    if (error instanceof MissingServerConfigurationError) {
      return Response.json(
        { error: "Session configuration unavailable" },
        { status: 503, headers },
      );
    }
    throw error;
  }
}
