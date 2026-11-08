# ==============================================================================
# Script to create GitHub Issues for Term Project: Simple Chat Application
# Repository: pedigree-pp/Simple_Chat_Application
#
# Prerequisite: Ensure you are logged into GitHub CLI:
#   gh auth login
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\create_issues.ps1
# ==============================================================================

Write-Host "Creating GitHub Issues for Simple Chat Application..." -ForegroundColor Cyan

$issues = @(
    @{
        title = "Part 1 (R1, R2): System Architecture & Protocol Documentation"
        body = @"
## Overview (Score: 1.5 pts)
Implement and document the multi-client network architecture.

### Tasks
- [ ] Ensure server and at least 2 clients can run on separate physical machines (or local Wi-Fi / Cloud).
- [ ] Implement communication exclusively using Socket Programming (Socket.IO over WebSockets).
- [ ] Prepare the required **Implementation Explanation** presentation slide:
  - Transport Layer: TCP (reliable, ordered delivery, 3-way handshake)
  - Application Layer: HTTP/1.1 Upgrade handshake transition to WebSocket framing (RFC 6455).
  - Justification for protocol selection.
"@
        labels = "architecture,documentation"
    },
    @{
        title = "Part 2 (R3, R4): Unique Username Enforcement & Live User Directory"
        body = @"
## Overview (Score: 1.0 pt)
Manage client identity and real-time directory listing.

### Tasks
- [ ] **R3 (0.5 pt):** Enforce unique username upon connection/registration with atomic rejection if duplicate.
- [ ] Display descriptive error message on client if username is taken.
- [ ] **R4 (0.5 pt):** Maintain active connected user directory on the server.
- [ ] Broadcast updated directory on client connect and disconnect.
- [ ] Display list of all connected users on client UI, explicitly highlighting own name `(You)`.
"@
        labels = "part-2,core-feature"
    },
    @{
        title = "Part 2 (R5, R6, R7): Private Direct Messaging & Dedicated Chat Rooms"
        body = @"
## Overview (Score: 2.0 pts)
Implement 1-on-1 private messaging with isolated rooms and split-pane UI.

### Tasks
- [ ] **R5 (0.5 pt):** Ensure every 1-on-1 chat creates/joins a dedicated private room (e.g., `dm_<userA>_<userB>`).
- [ ] **R6 (0.5 pt):** Split-pane UI:
  - Left pane: Online user list & rooms directory.
  - Right pane: Dedicated chat window displaying sent/incoming messages with auto-scroll.
  - Chat input box at the bottom for typing messages.
- [ ] **R7 (1.0 pt):** Route direct messages strictly to the private room. Ensure only the sender and recipient can see the messages.
"@
        labels = "part-2,core-feature"
    },
    @{
        title = "Part 2 (R8, R9): Group Chat Creation & Public Directory"
        body = @"
## Overview (Score: 2.0 pts)
Enable users to create groups and view existing groups with membership info.

### Tasks
- [ ] **R8 (1.0 pt):** Allow any client to create a new group chat.
- [ ] Automatically set the creator as the initial sole member of the group.
- [ ] **R9 (1.0 pt):** Broadcast a live public directory of all existing chat groups to all clients.
- [ ] Include group name and current member list/counts for each group.
"@
        labels = "part-2,group-chat"
    },
    @{
        title = "Part 2 (R10, R11): Opt-in Group Join & Member-Only Group Broadcasts"
        body = @"
## Overview (Score: 2.0 pts)
Implement voluntary group joining and isolated group communications.

### Tasks
- [ ] **R10 (1.0 pt):** Provide an explicit 'Join Group' button for clients.
- [ ] Ensure clients are NOT added automatically by the group creator.
- [ ] Update group member list on the server and broadcast update.
- [ ] **R11 (1.0 pt):** Allow joined members to send messages to the group.
- [ ] Enforce room isolation (`io.to(groupId).emit`): only members who have joined can see the group messages.
"@
        labels = "part-2,group-chat"
    },
    @{
        title = "Part 3 (Special 1): Dual-Mode AI Chat Assistant (@ai Bot & Catch-Up Summary)"
        body = @"
## Overview (Score: 1.0 pt - Mandatory AI Feature)
Integrate Gemini 2.5 Flash API for conversational assistance and room summarization.

### Tasks
- [ ] Configure Gemini 2.5 Flash API securely on the Express server (`@google/genai`).
- [ ] **In-Room Bot Mention:** When a message starts with `@ai <prompt>`, trigger Gemini and broadcast the AI response directly into that room.
- [ ] **Catch-Up / TL;DR Button:** Add a button in active rooms that sends the last 20-30 messages to Gemini and renders a concise summary card of missed conversation.
"@
        labels = "special-point,ai"
    },
    @{
        title = "Part 3 (Special 2): Real-Time Typing Indicators & Ephemeral Presence"
        body = @"
## Overview (Score: 1.0 pt - Creative Feature)
Give the chat real-time conversational feedback.

### Tasks
- [ ] Emit `typing_start` on input change, with a 1.5s debounce before emitting `typing_stop`.
- [ ] Broadcast typing state strictly to the active room.
- [ ] Render animated subtle typing indicator (`Alice is typing...`) in the active chat header.
- [ ] Clear typing indicator immediately upon message send.
"@
        labels = "special-point,ux"
    },
    @{
        title = "Part 3 (Special 3): Inline File & Image Sharing"
        body = @"
## Overview (Score: 1.0 pt - Creative Feature)
Support sending images and documents directly within chat rooms.

### Tasks
- [ ] Add attachment button (`<input type='file'>`) to message input box.
- [ ] Convert selected image/file to Base64 data URL on client (with file size limit check, e.g. < 5MB).
- [ ] Broadcast media payload over socket event (`send_message` with type `image`/`file`).
- [ ] Render inline image preview or download button in chat message feed.
"@
        labels = "special-point,media"
    },
    @{
        title = "Part 3 (Special 4): Production Cloud Deployment (Render + Vercel)"
        body = @"
## Overview (Score: 1.0 pt - Deployment Feature)
Deploy full-stack chat to production cloud with WSS/HTTPS support.

### Tasks
- [ ] Deploy Node.js + Socket.IO backend to Render / Railway over secure WebSockets (`wss://`).
- [ ] Configure server CORS to accept requests from frontend origin.
- [ ] Deploy Vite + React frontend to Vercel.
- [ ] Configure frontend environment variable (`VITE_SERVER_URL`).
- [ ] **Evaluation Demo:** Test across 2 distinct internet connections (e.g. Laptop on Wi-Fi and Phone on 4G/5G Hotspot).
"@
        labels = "special-point,deployment"
    },
    @{
        title = "Presentation & Evaluation Preparation: Implementation Slides & Live Demo"
        body = @"
## Overview (Grading Defense Preparation)
Prepare presentation materials required by the instructor rubric.

### Tasks
- [ ] Prepare 'Implementation Explanation' slides:
  - System architecture diagram showing clients, server, and room isolation.
  - Network protocol breakdown (TCP, HTTP upgrade, WebSocket frames).
  - List of custom Socket events and data contracts.
- [ ] Rehearse live demonstration:
  - Duplicate username rejection (R3).
  - Real-time directory sync (R4).
  - Direct message isolation (R7).
  - Group creation, join flow, and isolated broadcast (R8-R11).
  - AI features, typing indicator, file attachment, and cloud deployment demo.
"@
        labels = "presentation,documentation"
    }
)

foreach ($issue in $issues) {
    Write-Host "Creating: $($issue.title)..." -ForegroundColor Yellow
    gh issue create --title $issue.title --body $issue.body
}

Write-Host "`nAll 10 issues created successfully on GitHub!" -ForegroundColor Green
