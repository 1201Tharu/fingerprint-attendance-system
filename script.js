document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employeeForm");
  const listContainer = document.getElementById("employeeList");
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  function displayEmployees() {
    listContainer.innerHTML = "";
    if (employees.length === 0) {
      listContainer.innerHTML = "<p>No employees registered yet.</p>";
      return;
    }

    employees.forEach((emp, index) => {
      const div = document.createElement("div");
      div.classList.add("list-item");
      div.innerHTML = `
        <strong>${emp.name}</strong><br>
        ${emp.ID} - ${emp.department}- ${emp.position}- ${emp.registeredDate}<br>
        Fingerprint ID: ${emp.fingerprint || "N/A"}<br>
        <button onclick="deleteEmployee(${index})">Delete</button>
      `;
      listContainer.appendChild(div);
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newEmp = {
        name: document.getElementById("empName").value,
        ID: document.getElementById("empID").value,
        department: document.getElementById("empDepartment").value,
        position: document.getElementById("empPosition").value,
        Date: document.getElementById("empRegisteredDate").value,
        fingerprint: document.getElementById("empFingerprint").value,
      };

      employees.push(newEmp);
      localStorage.setItem("employees", JSON.stringify(employees));
      alert("Employee Registered Successfully ✅");
      form.reset();
      displayEmployees();
    });
  }

  // Delete function (global)
  window.deleteEmployee = (index) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      employees.splice(index, 1);
      localStorage.setItem("employees", JSON.stringify(employees));
      displayEmployees();
    }
  };

  displayEmployees();
});
