let students = [];

function loadStudents() {
  try {
    const saved = localStorage.getItem("students");
    if (saved) {
      students = JSON.parse(saved);
    } else {
      students = studentsData;
      localStorage.setItem("students", JSON.stringify(students));
    }
  } catch (err) {
    console.error("Error loading students", err);
  }
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function calcAverage(subjects) {
  if (!subjects || subjects.length === 0) return 0;
  return (
    subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length
  ).toFixed(2);
}

function calcAttendance(att) {
  if (!att || att.totalAcademicDays === 0) return 0;
  return ((att.presentDays / att.totalAcademicDays) * 100).toFixed(2);
}

function renderTable() {
  const tbody = document.querySelector("#student-record tbody");
  tbody.innerHTML = "";

  students.forEach(st => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${st.id}</td>
      <td>${st.personal.name}</td>
      <td>${st.personal.age}</td>
      <td>${st.personal.gender}</td>
      <td>${st.personal.contact.email}</td>
      <td>${st.personal.contact.phone}</td>
      <td>${st.personal.address.city}</td>
      <td>${calcAverage(st.academics.subjects)}%</td>
      <td>${calcAttendance(st.attendance)}%</td>
      <td>
        <button onclick="viewDetails(${st.id})">View</button>
        <button onclick="openForm(${st.id})">Edit</button>
        <button onclick="deleteStudent(${st.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });


}

function openForm(id = null) {
  document.getElementById("formPopup").classList.remove("hidden");
  const form = document.getElementById("studentForm");

  if (id) {
    const st = students.find(s => s.id === id);
    document.getElementById("formTitle").innerText = "Edit Student";
    document.getElementById("studentId").value = st.id;
    document.getElementById("name").value = st.personal.name;
    document.getElementById("age").value = st.personal.age;
    document.getElementById("gender").value = st.personal.gender;
    document.getElementById("email").value = st.personal.contact.email;
    document.getElementById("phone").value = st.personal.contact.phone;
    document.getElementById("city").value = st.personal.address.city;
    document.getElementById("state").value = st.personal.address.state;
    document.getElementById("grades").value = st.academics.subjects.map(s => s.score).join(",");
    document.getElementById("attendance").value = st.attendance.presentDays;
  } else {
    document.getElementById("formTitle").innerText = "Add Student";
    form.reset();
    document.getElementById("studentId").value = "";
  }
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter(s => s.id !== id);
    saveStudents();
    renderTable();
  }
}

function viewDetails(id) {
  const student = students.find(s => s.id === id);

  const modal = document.getElementById("viewPopup");
  const content = document.getElementById("viewContent");

  content.innerHTML = `
    <h2>Student Details</h2>
    <p><strong>ID:</strong> ${student.id}</p>
    <p><strong>Name:</strong> ${student.personal.name}</p>
    <p><strong>Age:</strong> ${student.personal.age}</p>
    <p><strong>Gender:</strong> ${student.personal.gender}</p>
    <p><strong>Email:</strong> ${student.personal.contact.email}</p>
    <p><strong>Phone:</strong> ${student.personal.contact.phone}</p>
    <p><strong>City:</strong> ${student.personal.address.city}</p>
    <p><strong>State:</strong> ${student.personal.address.state}</p>
    <p><strong>Avg Grade:</strong> ${calcAverage(student.academics.subjects)}%</p>
    <p><strong>Attendance:</strong> ${calcAttendance(student.attendance)}%</p>
  `;

  modal.classList.remove("hidden");
}

document.getElementById("closeViewBtn").addEventListener("click", () => {
  document.getElementById("viewPopup").classList.add("hidden");
});



document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("formPopup").classList.add("hidden");
});

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const id = document.getElementById("studentId").value;
  const grades = document.getElementById("grades").value
    .split(",")
    .map(g => ({ score: Number(g.trim()) || 0 }));
  const presentDays = Number(document.getElementById("attendance").value) || 0;

  const newStudent = {
    id: id ? Number(id) : students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
    personal: {
      name: document.getElementById("name").value,
      age: Number(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      contact: {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
      },
      address: {
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
      },
    },
    academics: { subjects: grades },
    attendance: { totalAcademicDays: 120, presentDays },
  };

  if (id) {
    students = students.map(s => s.id == id ? newStudent : s);
  } else {
    students.push(newStudent);
  }

  saveStudents();
  renderTable();
  document.getElementById("formPopup").classList.add("hidden");
});

function validateForm() {
  let valid = true;
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email.value.trim())) {
    showError(email, "Invalid email");
    valid = false;
  } else clearError(email);

  if (!/^[0-9]{10}$/.test(phone.value.trim())) {
    showError(phone, "Phone must be 10 digits");
    valid = false;
  } else clearError(phone);

  return valid;
}

function showError(input, msg) {
  input.classList.add("error");
  let err = input.nextElementSibling;
  if (!err || !err.classList.contains("error-msg")) {
    err = document.createElement("div");
    err.className = "error-msg";
    err.style.color = "red";
    err.innerText = msg;
    input.insertAdjacentElement("afterend", err);
  } else {
    err.innerText = msg;
  }
}

function clearError(input) {
  input.classList.remove("error");
  if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-msg")) {
    input.nextElementSibling.remove();
  }
}

document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("filterAttendance").addEventListener("change", applyFilters);
document.getElementById("filterGrades").addEventListener("change", applyFilters);

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const attendanceFilter = document.getElementById("filterAttendance").value;
  const gradeFilter = document.getElementById("filterGrades").value;

  const rows = document.querySelectorAll("#student-record tbody tr");
  let visibleCount = 0;

  rows.forEach(row => {
    const id = row.children[0].innerText.toLowerCase();
    const name = row.children[1].innerText.toLowerCase();
    const grade = parseFloat(row.children[7].innerText);
    const attendance = parseFloat(row.children[8].innerText);

    const matchSearch = id.includes(query) || name.includes(query);
    const matchGrade =
      gradeFilter === "" ||
      (gradeFilter === "below33" ? grade < 33 : grade >= parseFloat(gradeFilter));
    const matchAttendance =
      attendanceFilter === "" || attendance < parseFloat(attendanceFilter);

    const isVisible = matchSearch && matchGrade && matchAttendance;
    row.style.display = isVisible ? "" : "none";

    if (isVisible) visibleCount++;
  });

  const tbody = document.querySelector("#student-record tbody");

  const existing = document.getElementById("no-data-row");
  if (existing) existing.remove();

  if (visibleCount === 0) {
    const noDataRow = document.createElement("tr");
    noDataRow.id = "no-data-row";
    noDataRow.innerHTML = `
      <td colspan="10" style="text-align:center; color: #999;">No matching student found.</td>
    `;
    tbody.appendChild(noDataRow);
  }
}


loadStudents();
renderTable();
