// auth.js
const USERS_KEY = "app_users";
const SESSION_KEY = "session_user";

// Default admin ensure
function ensureDefaultAdmin() {
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (!users.some(u => u.username === "Admin")) {
    users.push({ username: "Admin", password: "Admin123", role: "Admin" });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
ensureDefaultAdmin();

// Session helpers
function currentUser() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  alert("You have been logged out!");
  window.location.href = "login.html";
}

function requireLogin() {
  const user = currentUser();
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
  }
  return user;
}

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
