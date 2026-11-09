# 💬 Simple Chat Application

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8-010101?style=flat&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-v5.0-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets-RFC_6455-blue?style=flat)](https://datatracker.ietf.org/doc/html/rfc6455)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> A full-duplex, real-time multi-client chat application built with **Node.js**, **Express**, and **Socket.IO** over **WebSockets**. Developed as a Term Project for **Computer Networks I**.

---

## 📖 Overview

The **Simple Chat Application** demonstrates modern network programming principles by establishing low-latency, bidirectional persistent connections across distributed clients. Moving beyond conventional HTTP request-response polling, this system uses the **WebSocket Protocol (RFC 6455)** initiated via an HTTP/1.1 Upgrade Handshake to guarantee efficient data transfer, dedicated chat room isolation, and instant message delivery.

---

## ✨ Features

### 👤 Identity & Live Presence (Issue #2)
- **Unique Username Enforcement:** Atomic server-side validation rejecting duplicate or empty handles (case-insensitive).
- **Live User Directory:** Real-time synchronization of active peers across all connected clients with a distinct `(You)` tag for the current user.
- **Graceful Session Lifecycle:** Automatic heartbeat/disconnection cleanup preventing ghost sessions upon network drop or window close.

### 💬 1-on-1 Direct Messaging & Private Rooms (Issue #3)
- **Deterministic Room Topologies:** Sorted pairwise room generation (e.g., `dm_alice_bob`) ensuring both participants bind to the identical isolated channel.
- **Split-Pane Workspace:** Responsive sidebar directory with dedicated auto-scrolling message streams.
- **Packet-Level Privacy:** Messages broadcast strictly via `io.to(roomId)` to prevent eavesdropping by unjoined sockets.

### 👥 Public Groups & Membership Control (Issue #4 & #5)
- **Group Creation:** Dynamic group generation with real-time public registry broadcasts.
- **Explicit Opt-in Joining:** Users voluntarily choose to join groups (no unsolicited additions).
- **Member-Restricted Multicast:** Message distribution isolated strictly to verified room members.

### 🤖 Intelligent Chat Assistant & Summaries (Issue #6)
- **In-Room Bot Mention:** Summon Gemini AI with `@ai <prompt>` to receive conversational answers directly in the chat feed.
- **Room Catch-Up (TL;DR):** One-click contextual summarization of the recent conversation history using Gemini Flash.

### ⚡ Enhanced Conversational UX (Issue #7 & #8)
- **Real-Time Typing Indicators:** Debounced presence indicators (`User is typing...`) transmitted selectively to active room participants.
- **Inline Media & File Sharing:** Direct client-side Base64 streaming with thumbnail preview for image attachments (< 5MB).

---

## 🌐 Network & Protocol Architecture

```
+-------------------------------------------------------------------+
|                        Client Application                         |
+-------------------------------------------------------------------+
          |                                               |
  1. HTTP/1.1 GET (Upgrade: websocket)         2. WSS Bidirectional Frames
  [Connection: Upgrade, Sec-WebSocket-Key]      [Opcode 0x1: UTF-8 Text / JSON]
          v                                               v
+-------------------------------------------------------------------+
|                      Node.js / Express Server                     |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |                  Socket.IO Engine (ws)                    |   |
|   +-----------------------------------------------------------+   |
|         |                           |                      |      |
|         v                           v                      v      |
|   [Global Broadcast]         [Private Rooms]        [Group Rooms] |
|   'user_list_update'        'dm_alice_bob'         'room_general' |
+-------------------------------------------------------------------+
```

### 1. Transport & Protocol Stack
- **Transport Layer (L4):** **TCP (Transmission Control Protocol)** provides reliable, ordered, and error-checked delivery of octet streams through a 3-way handshake (`SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK`).
- **Application Layer (L7):**
  - **Handshake:** Standard **HTTP/1.1** request using `Upgrade: websocket` and `Connection: Upgrade` headers.
  - **Full-Duplex Framing:** Seamless transition to **WebSocket Protocol (RFC 6455)** framing over the existing TCP socket, eliminating HTTP header overhead on subsequent frames.

### 2. Core Socket Events & Contracts

| Event Name | Direction | Payload Schema | Description |
| :--- | :--- | :--- | :--- |
| `register_username` | Client $\rightarrow$ Server | `username: string` | Request unique username registration (with ACK callback). |
| `user_list_update` | Server $\rightarrow$ Client | `string[]` | Broadcast updated directory of active usernames. |
| `start_private_chat` | Client $\rightarrow$ Server | `{ targetUsername: string }` | Join / create isolated 1-on-1 private room. |
| `send_private_message` | Client $\rightarrow$ Server | `{ targetUsername, text }` | Send direct message into private room. |
| `receive_private_message`| Server $\rightarrow$ Client | `{ id, sender, text, timestamp }` | Delivered strictly to members of the private room. |
| `typing_status` | Client $\leftrightarrow$ Server | `{ roomId, isTyping }` | Ephemeral typing state indicator. |

---

## 🛠️ Tech Stack

- **Runtime & Server:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Real-Time Communication:** [Socket.IO](https://socket.io/) (WebSockets fallback to HTTP Long-Polling)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
- **Version Control & Management:** Git, GitHub Issues & Project Milestones

---

## 📁 Project Structure

```text
Simple_Chat_Application/
├── client/                     # Frontend client assets
│   ├── index.html              # Core application layout & templates
│   ├── style.css               # Modern UI styling & responsive themes
│   └── app.js                  # Client-side socket listeners & DOM controller
├── server/                     # Backend server logic
│   ├── package.json            # Node.js dependencies & scripts
│   └── server.js               # Express server, Socket.IO handlers & rooms
├── PROJECT_ISSUES_ROADMAP.md   # Task tracking & milestone checklist
├── create_issues.ps1           # Automation script to seed GitHub Issues
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- `npm` (comes bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/pedigree-pp/Simple_Chat_Application.git
cd Simple_Chat_Application
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Setup Environment Variables *(Optional for AI Features)*
Create a `.env` file in the `server` directory:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Application
For development mode with auto-reload:
```bash
npm run dev
```
For standard production start:
```bash
npm start
```

### 5. Access the Client
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Testing Multi-Client Communication

To test multi-client interactions across separate sessions:
1. **Local Multi-Client Testing:** Open `http://localhost:3000` in multiple browser windows (e.g., standard window and Incognito/Private window) with different usernames.
2. **Local Network (LAN / Wi-Fi) Testing:**
   - Find your host computer's local IP address (e.g., `ipconfig` on Windows $\rightarrow$ `192.168.1.X`).
   - Connect another device (laptop, tablet, or smartphone) connected to the same Wi-Fi network by visiting:
     ```
     http://192.168.1.X:3000
     ```

---

## 👨‍💻 Author & Contact

**Pedigree** (pedigree-pp)  
*3rd Year Computer Engineering / Computer Science Student*  
*Course: Computer Networks I (Semester 1)*

[![GitHub](https://img.shields.io/badge/GitHub-pedigree--pp-181717?style=flat&logo=github&logoColor=white)](https://github.com/pedigree-pp)
[![Email](https://img.shields.io/badge/Email-pedigreesawatdeekrub%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:pedigreesawatdeekrub@gmail.com)
<!-- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile) -->

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

