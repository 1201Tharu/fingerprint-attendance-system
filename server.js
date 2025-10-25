// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// simple JSON file user store (use a proper DB for production)
const USERS_FILE = path.join(__dirname, 'users.json');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  name: 'attend.sid',
  secret: process.env.SESSION_SECRET || 'replace_this_with_env_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set secure: true if using HTTPS
}));

// helper: load users
function loadUsers(){
  if(!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE,'utf8'));
}

// login page
app.get('/login', (req,res) => {
  if(req.session && req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'login.html'));
});

// login handler
app.post('/login', async (req,res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users[username];
  if(!user) return res.status(401).send('Invalid credentials');

  const match = await bcrypt.compare(password, user.hash);
  if(!match) return res.status(401).send('Invalid credentials');

  req.session.user = { username, name: user.name || username };
  res.redirect('/');
});

// logout
app.post('/logout', (req,res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// auth middleware
function requireAuth(req,res,next){
  if(req.session && req.session.user) return next();
  // if AJAX request, return 401
  if(req.xhr || req.headers.accept.indexOf('application/json') > -1) return res.status(401).json({error:'Unauthorized'});
  res.redirect('/login');
}

// serve login-protected static site from "public"
app.use('/', (req,res,next) => {
  // allow login page and assets for login page
  if(req.path === '/login' || req.path === '/create_user' || req.path.startsWith('/static-login-assets')) return next();
  return requireAuth(req,res,next);
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// fallback (optional)
app.get('/', requireAuth, (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'attendance_report.html'));
});

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
