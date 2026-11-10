// ==============================================================================
// CLIENT CONTROLLER (client/app.js)
// Real-Time Socket.IO Multi-Client Chat Client
// ==============================================================================

// Establish full-duplex WebSocket connection to the server
const socket = io();

// ------------------------------------------------------------------------------
// GLOBAL APPLICATION STATE
// ------------------------------------------------------------------------------
let currentUser = null;        // Authenticated username of this client session
let activeTargetUser = null;   // Active 1-on-1 chat partner currently opened

// In-Memory Chat History Cache: Map<partnerUsername, Array<MessageObject>>
// Keeps messages persisted across switching between different chat rooms
const chatHistories = new Map();

// ------------------------------------------------------------------------------
// DOM ELEMENT REFERENCES
// ------------------------------------------------------------------------------
// Screen Containers
const loginScreen = document.getElementById('login-screen');
const chatDashboard = document.getElementById('chat-dashboard');

// Issue #2: Registration Elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const loginError = document.getElementById('login-error');

// Issue #2: Directory & Presence Elements
const userListEl = document.getElementById('user-list');
const userCountEl = document.getElementById('user-count');
const myUsernameEl = document.getElementById('my-username');
const myAvatarEl = document.getElementById('my-avatar');
const logoutBtn = document.getElementById('logout-btn');

// Issue #4 & #5: Public Group Directory Elements
const groupListEl = document.getElementById('group-list');
const createGroupBtn = document.getElementById('create-group-btn');

// Issue #3 (R6): Dedicated Chat Pane Elements
const emptyState = document.getElementById('empty-state');
const activeChat = document.getElementById('active-chat');
const chatPartnerName = document.getElementById('chat-partner-name');
const chatPartnerAvatar = document.getElementById('chat-partner-avatar');
const messageFeed = document.getElementById('message-feed');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');


// ==============================================================================
// ISSUE #2 (R3): USERNAME REGISTRATION & ATOMIC VALIDATION
// ==============================================================================
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  loginError.textContent = '';

  const name = usernameInput.value.trim();
  if (!name) {
    showError('Username cannot be blank.');
    return;
  }

  // Send registration request to server with an Acknowledgement (ACK) callback
  socket.emit('register_username', name, (response) => {
    if (response.success) {
      currentUser = name;
      showDashboard();
    } else {
      // Duplicate or invalid username rejected by server
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


// ==============================================================================
// ISSUE #2 (R4): REAL-TIME CONNECTED USER DIRECTORY & SELECTION (R6)
// ==============================================================================
// Listen for server broadcast whenever a client connects or disconnects
socket.on('user_list_update', (users) => {
  renderUserList(users);
});

function renderUserList(users) {
  userCountEl.textContent = `${users.length} online`;
  userListEl.innerHTML = '';

  users.forEach((username) => {
    const isMe = username === currentUser;
    const isCurrentlyActive = username === activeTargetUser;
    const li = document.createElement('li');

    // Apply interactive classes (highlight if active, distinct style if self)
    li.className = `user-item ${isMe ? 'is-me' : ''} ${isCurrentlyActive ? 'active' : ''}`;

    li.innerHTML = `
      <div class="avatar">${username.slice(0, 2).toUpperCase()}</div>
      <span>${username} ${isMe ? '<strong>(You)</strong>' : ''}</span>
    `;

    // ISSUE #3 (R5, R6): Clicking another peer initiates 1-on-1 private messaging
    if (!isMe) {
      li.addEventListener('click', () => {
        openPrivateChat(username);
      });
    }

    userListEl.appendChild(li);
  });
}


// ==============================================================================
// ISSUE #4 (R8): GROUP CHAT CREATION
// ==============================================================================
createGroupBtn.addEventListener('click', () => {
  const groupName = prompt('Enter a unique name for your new group chat:');
  if (!groupName || !groupName.trim()) return;

  // Emit 'start_public_group' event to server
  socket.emit('start_public_group', { groupName: groupName.trim() }, (response) => {
    if (!response.success) {
      alert(`Error creating group: ${response.message}`);
    } else {
      console.log(`[Group Created]: ${response.groupName}`);
    }
  });
});


// ==============================================================================
// ISSUE #4 (R9) & ISSUE #5 (R10): PUBLIC GROUP DIRECTORY & JOIN BUTTON
// ==============================================================================
socket.on('group_list_update', (groups) => {
  renderGroupList(groups);
});

function renderGroupList(groups) {
  groupListEl.innerHTML = '';

  if (!groups || groups.length === 0) {
    groupListEl.innerHTML = '<li class="empty-hint" style="color:#64748b; font-size:0.8rem; padding:0.5rem;">No groups yet</li>';
    return;
  }

  groups.forEach((g) => {
    // Check if the currently logged-in user is already in this group's members
    const isMember = g.members && g.members.some(m => m.toLowerCase() === currentUser?.toLowerCase());

    const li = document.createElement('li');
    li.className = 'group-item';

    li.innerHTML = `
      <div class="group-item-header">
        <span class="group-item-name">👥 ${escapeHtml(g.name)}</span>
        <span class="group-member-count">${g.memberCount} ${g.memberCount === 1 ? 'member' : 'members'}</span>
      </div>
      <div class="group-members-preview" title="${escapeHtml(g.members.join(', '))}">
        Members: ${escapeHtml(g.members.join(', '))}
      </div>
      <div class="group-actions">
        ${
          isMember
            ? '<span class="badge-joined">✓ Joined</span>'
            : `<button class="btn-join-group" data-name="${escapeHtml(g.name)}">+ Join</button>`
        }
      </div>
    `;

    // ISSUE #5 (R10): Voluntary Opt-in Join button handler
    const joinBtn = li.querySelector('.btn-join-group');
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        socket.emit('join_public_group', g.name, (response) => {
          if (response.success) {
            console.log(`[Group Joined successfully]: ${g.name}`);
          } else {
            alert(`Could not join group: ${response.message}`);
          }
        });
      });
    }

    groupListEl.appendChild(li);
  });
}


// ==============================================================================
// ISSUE #3 (R5, R6): JOIN DEDICATED PRIVATE ROOM & SWITCH WORKSPACE
// ==============================================================================
function openPrivateChat(targetUsername) {
  activeTargetUser = targetUsername;

  // R6: Switch right-hand pane from Empty Placeholder to Active Chat Room
  emptyState.classList.add('hidden');
  activeChat.classList.remove('hidden');

  // Update header with partner's details
  chatPartnerName.textContent = targetUsername;
  chatPartnerAvatar.textContent = targetUsername.slice(0, 2).toUpperCase();

  // Highlight the active user in the sidebar directory
  document.querySelectorAll('.user-item').forEach((el) => {
    const isPartner = el.querySelector('span')?.textContent?.startsWith(targetUsername);
    el.classList.toggle('active', !!isPartner);
  });

  // Render previous conversation history from cache (if any exists)
  renderMessagesForActiveChat();

  // Focus message input box ready for typing
  messageInput.focus();

  // R5: Inform server to join both sockets into the dedicated 1-on-1 room (e.g. 'dm_alice_bob')
  socket.emit('start_private_group', { targetUsername }, (response) => {
    console.log('[Room Joined Response]:', response);
  });
}


// ==============================================================================
// ISSUE #3 (R6, R7): SEND DIRECT MESSAGE WITH ROOM ROUTING
// ==============================================================================
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text || !activeTargetUser) return;

  // R7: Emit message to server for isolated room-based delivery
  socket.emit('send_private_message', {
    targetUsername: activeTargetUser,
    message: text
  }, (ack) => {
    if (ack?.success) {
      console.log(`[Message Delivered to Server for ${activeTargetUser}]`);
    }
  });

  // Clear input box and maintain focus
  messageInput.value = '';
  messageInput.focus();
});


// ==============================================================================
// ISSUE #3 (R7): RECEIVE MESSAGE & ISOLATED CHAT BUBBLE RENDERING
// ==============================================================================
// Server emits 'receive_private_message' strictly to the dedicated room
socket.on('receive_private_message', (payload) => {
  const { sender, receiver, data, timestamp } = payload;
  const messageText = data; // Payload from server carries message in .data

  // Determine which peer this conversation belongs to
  const conversationPartner = (sender === currentUser) ? receiver : sender;

  // 1. Persist message in local in-memory history cache
  if (!chatHistories.has(conversationPartner)) {
    chatHistories.set(conversationPartner, []);
  }
  chatHistories.get(conversationPartner).push({
    sender,
    text: messageText,
    timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // 2. If the user currently has this conversation open, append bubble immediately
  if (conversationPartner === activeTargetUser) {
    appendMessageBubble(sender, messageText, timestamp);
  }
});

// Render all cached messages when switching to a room
function renderMessagesForActiveChat() {
  messageFeed.innerHTML = '';
  const history = chatHistories.get(activeTargetUser) || [];
  history.forEach((msg) => {
    appendMessageBubble(msg.sender, msg.text, msg.timestamp);
  });
}

// Helper: Injects a styled message bubble into the scrolling feed
function appendMessageBubble(sender, text, timestamp) {
  const isMe = sender === currentUser;
  const msgEl = document.createElement('div');

  // R6: 'my-message' aligns right (Indigo), 'other-message' aligns left (Slate)
  msgEl.className = `message ${isMe ? 'my-message' : 'other-message'}`;

  msgEl.innerHTML = `
    <div class="bubble">${escapeHtml(text)}</div>
    <span class="message-meta">${timestamp}</span>
  `;

  messageFeed.appendChild(msgEl);

  // Auto-scroll to latest message at the bottom
  messageFeed.scrollTop = messageFeed.scrollHeight;
}

// XSS Protection Helper: Sanitize text before rendering into innerHTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// ==============================================================================
// SESSION LOGOUT & CLEANUP
// ==============================================================================
logoutBtn.addEventListener('click', () => {
  // Disconnect socket from server
  socket.disconnect();
  socket.connect(); // Establish fresh socket ready for next connection

  // Reset all application state
  currentUser = null;
  activeTargetUser = null;
  chatHistories.clear();
  usernameInput.value = '';
  loginError.classList.add('hidden');

  // Reset UI back to login screen
  activeChat.classList.add('hidden');
  emptyState.classList.remove('hidden');
  messageFeed.innerHTML = '';
  groupListEl.innerHTML = '';
  chatDashboard.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});
