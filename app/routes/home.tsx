import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Nora — студентський AI-асистент" }];
}

export function loader() {
  return { service: "Nora", status: "foundation" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.service}</h1>
      <p>PoC: PWA, Moodle та AI.</p>
      <p>Серверний каркас готовий для підключення Moodle.</p>
    </main>
  );
}
