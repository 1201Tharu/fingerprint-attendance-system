// create_user.js
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

async function addUser(username, password, name="") {
  const hash = await bcrypt.hash(password, 10);
  let users = {};
  if(fs.existsSync(USERS_FILE)) users = JSON.parse(fs.readFileSync(USERS_FILE,'utf8'));
  users[username] = { hash, name };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log(`User ${username} created.`);
}

const [,, username, password, name] = process.argv;
if(!username || !password) {
  console.log('Usage: node create_user.js <username> <password> [Full Name]');
  process.exit(1);
}
addUser(username, password, name).catch(console.error);
