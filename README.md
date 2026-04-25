# AURA-AI

A production-grade LLM chat application with a premium UI built with FastAPI and Next.js.

## Features
- **Real-time Streaming**: Token-by-token response streaming using SSE.
- **Premium UI**: Glassmorphism, aura-themed gradients, and smooth animations with Framer Motion.
- **Markdown Support**: Full markdown rendering with syntax highlighting for code blocks.
- **Conversation History**: Persistent chat history with auto-renaming and management.
- **Modular Architecture**: Clean separation of concerns between backend and frontend.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Create a `.env` file in the root (if not present) and add your API keys:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Run the FastAPI server:
   ```bash
   export PYTHONPATH=$PYTHONPATH:$(pwd)/backend
   python3 backend/main.py
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used
- **Frontend**: Next.js 16+, Zustand, Framer Motion, Lucide React, React Markdown.
- **Backend**: FastAPI, Google Generative AI SDK, Uvicorn, Pydantic.
- **Styling**: Tailwind CSS 4 (with Vanilla CSS tokens).
