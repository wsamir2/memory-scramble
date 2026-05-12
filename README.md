# 🧠 Memory Scramble

A card-matching memory game built with **HTML, CSS, and JavaScript** using the **MVC (Model-View-Controller)** architecture pattern.

![Game Screenshot](docs/screenshot.png)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [How to Build & Run](#how-to-build--run)
- [How to Play](#how-to-play)
- [Project Structure](#project-structure)
- [Git Workflow](#git-workflow)
- [Team Members](#team-members)

---

## 🎯 Overview

**Memory Scramble** is a single-player card game where the player flips face-down cards to find matching pairs. The player must match all pairs before the countdown timer reaches zero. The game supports configurable board sizes and time limits.

---

## ✨ Features

- **Configurable Board Size** — Set rows and columns (total cells must be even).
- **Configurable Time Limit** — Choose between 10 and 600 seconds.
- **Countdown Timer** — Live timer displayed on screen during gameplay.
- **Game Over** — Displays a message when the timer reaches zero before all cards are matched.
- **Win Condition** — Congratulations modal when all pairs are matched.
- **Card Flip Animation** — Smooth 3D flip animations with CSS transforms.
- **Match/Mismatch Feedback** — Visual glow for matches, shake animation for mismatches.
- **Responsive Design** — Works on desktop and mobile screens.
- **MVC Architecture** — Clean separation of concerns.

---

## 🏗️ Architecture

The project follows the **MVC (Model-View-Controller)** design pattern:

| Layer          | File                 | Responsibility                                    |
| -------------- | -------------------- | ------------------------------------------------- |
| **Model**      | `js/model.js`        | Game state, card data, validation, business logic  |
| **View**       | `js/view.js`         | DOM rendering, UI updates, modals                  |
| **Controller** | `js/controller.js`   | Event handling, game loop, orchestration           |
| **Entry**      | `js/app.js`          | Bootstraps and wires MVC components                |

### Data Flow

```
User Action → Controller → Model (update state) → Controller → View (update DOM)
```

---

## 🛠️ Technologies Used

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| HTML5          | Page structure and semantics     |
| CSS3           | Styling, animations, responsive  |
| JavaScript ES6 | Game logic and DOM manipulation  |
| Google Fonts   | Typography (Outfit font family)  |
| Git & GitHub   | Version control and collaboration|

---

## 🚀 How to Build & Run

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- No build tools, package managers, or servers required.

### Option 1: Open Directly

1. Clone the repository:
   ```bash
   git clone https://github.com/wsami/memory-scramble.git
   cd memory-scramble
   ```
2. Open `index.html` in your browser:
   ```bash
   # Windows
   start index.html

   # macOS
   open index.html

   # Linux
   xdg-open index.html
   ```

### Option 2: Use a Local Server (recommended)

Using VS Code Live Server, Python, or Node:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## 🎮 How to Play

1. **Configure** — Set the number of rows, columns, and time limit.
2. **Start** — Click "Start Game".
3. **Flip** — Click any face-down card to reveal it.
4. **Match** — Click a second card. If both icons match, they stay face-up.
5. **Mismatch** — If the icons don't match, both cards flip back face-down.
6. **Win** — Match all pairs before the timer runs out!
7. **Lose** — If the timer reaches zero, the game is over.

---

## 📁 Project Structure

```
memory-scramble/
├── index.html          # Main HTML page
├── css/
│   └── style.css       # All styles and animations
├── js/
│   ├── model.js        # Model — game state & logic
│   ├── view.js         # View — DOM rendering
│   ├── controller.js   # Controller — event handling
│   └── app.js          # Entry point
└── README.md           # This file
```

---

## 🔀 Git Workflow

This project was developed using a **feature-branch workflow**:

1. Each team member worked on dedicated feature branches.
2. Branches were merged into `main` via `--no-ff` merges to preserve history.
3. Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) convention.

### Branch Summary

| Branch                     | Owner   | Purpose                          |
| -------------------------- | ------- | -------------------------------- |
| `feature/project-setup`   | Duaa    | Initial scaffold and .gitignore  |
| `feature/html-structure`  | Walid   | HTML shell                       |
| `feature/ui-base-styles`  | Walid   | CSS design system                |
| `feature/card-model`      | Monica  | Card class and enums             |
| `feature/game-logic`      | Monica  | GameModel, shuffle, matching     |
| `feature/config-view`     | Walid   | Config screen UI                 |
| `feature/board-view`      | Walid   | Game board rendering             |
| `feature/controller-core` | Duaa    | Controller + event binding       |
| `feature/timer-system`    | Duaa    | Countdown timer                  |
| `feature/card-animations` | Walid   | CSS flip/shake animations        |
| `feature/modal-views`     | Walid   | Win/Lose modals                  |
| `feature/hud-updates`     | Duaa    | MVC wiring + integration         |
| `feature/responsive-design`| Walid  | Mobile breakpoints               |
| `feature/documentation`   | Duaa    | README and docs                  |

---

## 👥 Team Members

| Name                    | Role                        | GitHub                                                |
| ----------------------- | --------------------------- | ----------------------------------------------------- |
| Walid Samir Sayed       | UI / Views / Styling        | [@wsami](https://github.com/wsami)                    |
| Monica Alkess Beshara   | Models / Game Logic          | [@monica-alkess](https://github.com/monica-alkess)    |
| Duaa Hisham El Zain     | Controller / Timer / Docs    | [@duaa-hisham](https://github.com/duaa-hisham)        |

---

## 📸 Screenshots

### Configuration Screen
![Config Screen](docs/config-screen.png)

### Game Board
![Game Board](docs/game-board.png)

### Win Modal
![Win Modal](docs/win-modal.png)

### Game Over
![Game Over](docs/game-over.png)

---

## 📄 License

This project is developed for educational purposes.
