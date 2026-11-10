const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const app = require("../server");
const students = require("../students");

const originalStudents = students.map((student) => ({ ...student }));
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  students.splice(0, students.length, ...originalStudents.map((student) => ({ ...student })));
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

async function request(path, method = "GET", body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

test("GET /students returns the seeded student list", async () => {
  const response = await request("/students");
  assert.equal(response.status, 200);
  assert.deepEqual(response.data, originalStudents);
});

test("GET /students/:id returns the matching student", async () => {
  const response = await request("/students/2");
  assert.equal(response.status, 200);
  assert.deepEqual(response.data, originalStudents[1]);
});

test("GET /students/:id returns 404 for an unknown or invalid ID", async () => {
  for (const id of ["999", "invalid"]) {
    const response = await request(`/students/${id}`);
    assert.equal(response.status, 404);
    assert.deepEqual(response.data, { message: "Student not found" });
  }
});

test("POST /students creates a student with default attendance", async () => {
  const response = await request("/students", "POST", { name: "New student" });
  assert.equal(response.status, 201);
  assert.deepEqual(response.data, { id: 4, name: "New student", attendance: false });
  assert.equal(students.length, originalStudents.length + 1);
});

test("DELETE /students/:id removes an existing student", async () => {
  const response = await request("/students/2", "DELETE");
  assert.equal(response.status, 200);
  assert.deepEqual(response.data, { message: "Student deleted" });
  assert.equal(students.some((student) => student.id === 2), false);
});

test("DELETE /students/:id returns 404 for an unknown ID", async () => {
  const response = await request("/students/999", "DELETE");
  assert.equal(response.status, 404);
  assert.deepEqual(response.data, { message: "Student not found" });
});

test("POST /students rejects a missing or blank name", async () => {
  for (const payload of [{}, { name: "" }, { name: "   " }]) {
    const response = await request("/students", "POST", payload);
    assert.equal(response.status, 400, `expected 400 for ${JSON.stringify(payload)}`);
  }
});

test("POST /students never reuses an existing ID after deletion", async () => {
  await request("/students/2", "DELETE");
  const response = await request("/students", "POST", { name: "New student" });
  assert.equal(response.status, 201);
  assert.equal(new Set(students.map((student) => student.id)).size, students.length);
});
