const express = require("express");
const students = require("./students");

const app = express();
app.use(express.json());
app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    attendance: false
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(index, 1);
  res.json({ message: "Student deleted" });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

