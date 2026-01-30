# 🚀 SimplifyRepo

**Decode complex codebases in seconds. Turn overwhelming repositories into clear, actionable insights.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/yuv2121/simplifyrepo)


---

## 📖 Overview

**SimplifyRepo** is an advanced repository analysis tool designed to help developers, architects, and technical leads quickly understand unfamiliar codebases. By leveraging AI-driven summarization and interactive visualizations, it bridges the gap between raw source code and architectural comprehension.

Whether you're onboarding to a new project or auditing a legacy system, SimplifyRepo provides a high-level summary, security insights, and a structured "Pro Mode" for deep-dive technical explorations.

## ✨ Key Features

*   **🔍 AI Repository Summarization**: Instantly generate high-level overviews of any GitHub repository.
*   **🤖 Interactive ChatBot**: Ask specific questions about the codebase structure, logic, or dependencies.
*   **🛡️ Security Gate**: Integrated security analysis to identify potential vulnerabilities within the repo.
*   **📊 Pro-Mode Visualizer**: Generate Mermaid diagrams and flowcharts to visualize complex architectural flows.
*   **📝 Wiki Generator**: Automatically draft documentation and wikis based on analyzed source code.
*   **🖥️ Terminal Log Interface**: Real-time feedback and processing logs for a developer-centric experience.
*   **🎨 Glassmorphic UI**: A modern, sleek interface built with Tailwind CSS and Framer Motion for smooth transitions.

## 🛠 Tech Stack

*   **Frontend**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Backend/Database**: [Supabase](https://supabase.com/) (Edge Functions & Auth)
*   **Visualizations**: [Mermaid.js](https://mermaid.js.org/) & [Recharts](https://recharts.org/)
*   **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
*   A [Supabase](https://supabase.com/) account for backend functions/auth.

## 🚀 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yuv2121/simplifyrepo.git
    cd simplifyrepo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR if you prefer Bun
    bun install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (shadcn/ui)
│   ├── pro-mode/        # Advanced analysis features
│   └── ui/              # Base primitive components
├── hooks/               # Custom React hooks (Auth, Chat, Analyze)
├── integrations/        # Supabase client and types
├── pages/               # Main application views (Auth, Dashboard)
├── supabase/            # Edge functions for AI processing
└── lib/                 # Utility functions and formatting
```

## 🛠 Usage Examples

### Analyzing a Repo
1. Sign in via the **Auth** page.
2. Paste a GitHub repository URL into the main input field.
3. Click **Summarize** to get a breakdown of the tech stack and purpose.

### Using Pro Mode
1. Toggle **Pro Mode** from the dashboard.
2. Select **Visualizer** to generate architectural diagrams.
3. Use the **Wiki Generator** to export markdown-ready documentation for your team.



## 📄 License : Built in INDIA with pride. YuvrajJoshi.

Distributed under the MIT License. See `LICENSE` for more information.

---

**SimplifyRepo** — *Complexity, Simplified.*
