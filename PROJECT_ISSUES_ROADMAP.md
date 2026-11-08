# Project Task Tracking Roadmap

Track your progress for the **Simple Chat Application** project.

---

### Phase 1: Core Networking & Architecture
- [ ] **Issue #1:** [Setup System Architecture & Network Protocol Documentation](https://github.com/pedigree-pp/SimpleChatApplication/issues/1)
  - [ ] Multi-client setup (at least 2 clients on separate physical computers / networks).
  - [ ] All message communication implemented using Socket programming.
  - [ ] Document network protocols: TCP (Transport) and HTTP Upgrade to WebSockets RFC 6455 (Application).

---

### Phase 2: User Identity & Group Messaging
- [ ] **Issue #2:** [Implement Unique Username Registration & Active User Directory](https://github.com/pedigree-pp/SimpleChatApplication/issues/2)
  - [ ] Unique username check with rejection on duplicate.
  - [ ] Live directory of all connected clients (including self `(You)`).
- [ ] **Issue #3:** [Implement 1-on-1 Private Messaging & Dedicated Chat Rooms](https://github.com/pedigree-pp/SimpleChatApplication/issues/3)
  - [ ] Dedicated chat room for 1-on-1 private messaging.
  - [ ] Split-pane UI with active chat box and scrolling message window.
  - [ ] Isolated direct text messages visible only to sender and receiver.
- [ ] **Issue #4:** [Implement Group Chat Creation & Public Room Registry](https://github.com/pedigree-pp/SimpleChatApplication/issues/4)
  - [ ] Create group chat (creator is initially sole member).
  - [ ] Broadcast public group list with member names/counts.
- [ ] **Issue #5:** [Implement Opt-in Group Join & Isolated Member Broadcasts](https://github.com/pedigree-pp/SimpleChatApplication/issues/5)
  - [ ] Manual opt-in join button (never auto-added by creator).
  - [ ] Broadcast messages strictly to group members.

---

### Phase 3: Special Features & Production Deployment
- [ ] **Issue #6:** [Add Dual-Mode AI Assistant (@ai Chatbot & Room Catch-Up Summary)](https://github.com/pedigree-pp/SimpleChatApplication/issues/6)
  - [ ] `@ai <prompt>` in-room chatbot response using Gemini 2.5 Flash.
  - [ ] "Catch-Up" button to summarize recent room conversation into quick bullet points.
- [ ] **Issue #7:** [Add Real-Time Typing Indicators & Online Presence](https://github.com/pedigree-pp/SimpleChatApplication/issues/7)
  - [ ] Debounced `typing_start` / `typing_stop` socket events.
  - [ ] "User is typing..." subtle animated dots in the active chat header.
- [ ] **Issue #8:** [Add Inline File & Image Sharing Support](https://github.com/pedigree-pp/SimpleChatApplication/issues/8)
  - [ ] File attachment picker supporting PNG, JPG, and PDF.
  - [ ] Base64 streaming and inline preview rendering in the message feed.
- [ ] **Issue #9:** [Deploy Full-Stack Application to Cloud (Render & Vercel)](https://github.com/pedigree-pp/SimpleChatApplication/issues/9)
  - [ ] Deploy Express + Socket.IO server on Render / Railway over `wss://`.
  - [ ] Deploy React frontend on Vercel.
  - [ ] Live demo over 2 distinct networks (e.g. Wi-Fi + Mobile Hotspot).

---

### Phase 4: Final Evaluation & Defense
- [ ] **Issue #10:** [Prepare Implementation Presentation Slides & Demo Rehearsal](https://github.com/pedigree-pp/SimpleChatApplication/issues/10)
  - [ ] Create "Implementation Explanation" presentation slides.
  - [ ] Dry-run all rubric criteria before evaluation.
