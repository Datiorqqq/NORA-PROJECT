let name1 = "Marysia";
function greet(person) {
    console.log("Greet " + person);
}
greet(name1);

const student = {
    name: "Kateruna",
    age: 19,
    group:"PMA-22"
}
console.log(student.name);
console.log(student.group);

const lessons = ["C#", "Diferentional equesions", "Matematic statistic", "ONS", "Computer arhitecture", "English", "Progect", "Team practics"];
console.log(lessons[0]);
console.log(lessons.length);

const students = require("./students");
console.log(students[0].name);
console.log(students[1].name);
console.log(students.length);
console.log(JSON.stringify(students));

const one = students.find(s => s.id === 1);
console.log(one.name);

const att = students.filter(s => s.attendance === true);
console.log(att.length);



