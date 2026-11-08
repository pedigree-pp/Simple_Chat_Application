// Connects to the same host/port the page was loaded from
const socket = io();

let currentUser = null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatDashboard = document.getElementById('chat-dashboard');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const loginError = document.getElementById('login-error');
const userListEl = document.getElementById('user-list');
const userCountEl = document.getElementById('user-count');
const myUsernameEl = document.getElementById('my-username');
const myAvatarEl = document.getElementById('my-avatar');
const logoutBtn = document.getElementById('logout-btn');

// --- 1. HANDLE LOGIN SUBMISSION ---
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  loginError.textContent = '';

  const name = usernameInput.value.trim();
  if (!name) {
    showError('Username cannot be blank.');
    return;
  }

  // R3: Send registration event with ACK callback
  socket.emit('register_username', name, (response) => {
    if (response.success) {
      currentUser = name;
      showDashboard();
    } else {
      showError(response.message);
    }
  });
});

function showError(msg) {
  loginError.textContent = msg;
  loginError.classList.remove('hidden');
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  chatDashboard.classList.remove('hidden');
  myUsernameEl.textContent = currentUser;
  myAvatarEl.textContent = currentUser.slice(0, 2).toUpperCase();
}

// --- 2. R4: HANDLE REAL-TIME USER DIRECTORY BROADCAST ---
socket.on('user_list_update', (users) => {
  renderUserList(users);
});

function renderUserList(users) {
  userCountEl.textContent = `${users.length} online`;
  userListEl.innerHTML = '';

  users.forEach((username) => {
    const isMe = username === currentUser;
    const li = document.createElement('li');
    li.className = `user-item ${isMe ? 'is-me' : ''}`;

    li.innerHTML = `
      <div class="avatar">${username.slice(0, 2).toUpperCase()}</div>
      <span>${username} ${isMe ? '<strong>(You)</strong>' : ''}</span>
    `;

    userListEl.appendChild(li);
  });
}

// --- 3. HANDLE LOGOUT ---
logoutBtn.addEventListener('click', () => {
  socket.disconnect();
  socket.connect(); // Fresh socket ready for next login

  currentUser = null;
  usernameInput.value = '';
  loginError.classList.add('hidden');

  chatDashboard.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});