# AI Code Reviewer

AI Code Reviewer is a responsive web application that allows developers to paste or write code and instantly receive AI-powered code reviews. It highlights potential improvements in **security, performance, readability, and style**, giving actionable insights directly in the browser.

---

## 🚀 Features

- **Live Code Editor**
  - Built with `react-simple-code-editor` and Prism.js for syntax highlighting.
  - Supports horizontal scroll for long lines.
- **AI-Powered Code Review**
  - Connects to a backend API (`/ai/get-review`) for AI-generated code feedback.
  - Outputs in Markdown with highlighted sections and suggestions.
- **Responsive Two-Panel Layout**
  - Left: Editor panel for writing/pasting code.
  - Right: Review panel showing AI suggestions with scrollable output.
- **Copy & Download**
  - Copy entire review or download as a `.md` file.
  - Per-code-block "Copy" button inside the review panel.
- **Mobile-Friendly**
  - Toggle between Editor, Review, or Both views on small screens.
- **Dark Themed UI**
  - Modern, accessible, and optimized for readability.

---

## 🛠️ Tech Stack

- **Frontend:**
  - React (functional components, hooks)
  - Prism.js (syntax highlighting)
  - React-Markdown + rehype-highlight (rendering AI review)
  - CSS (custom responsive design)

- **Backend (expected):**
  - Node.js + Express.js
  - AI endpoint `/ai/get-review`

---

## 📂 Project Structure

```
/src
 ├── App.jsx        # Main React component (editor + review UI)
 ├── App.css        # Custom styling for layout & responsiveness
 ├── index.js       # React entry point
/public
 └── index.html
README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm start
```

### 4. Backend Setup
- Ensure you have a backend running at:
  ```
  POST http://localhost:3000/ai/get-review
  ```
- The backend should accept JSON input:
  ```json
  { "code": "your code here" }
  ```
- And return a **Markdown string** with AI review feedback.

---

## 📖 Usage

1. Paste or write your code in the **Editor** panel.
2. Click **Request Review** to get instant AI suggestions.
3. View structured results in the **Review** panel:
   - Code blocks (with copy buttons).
   - Highlighted recommendations.
   - Actionable improvements.
4. Copy or Download the review for later use.

---

## 📱 Responsive Design

- **Desktop:** Side-by-side Editor + Review panels (equal width).
- **Tablet:** Responsive adjustments, panels adapt fluidly.
- **Mobile:** Toggle between Editor / Review / Both views.

---

## 🔮 Future Improvements

- Add language selector (JS, Python, Java, etc.)
- Inline annotations in editor.
- AI-powered code scoring.
- Save/share reviews.
