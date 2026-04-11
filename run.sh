#!/bin/bash

# Ensure Brew path is included for node/npm
export PATH="/opt/homebrew/bin:$PATH"

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting Generative AI UI..."

# Start Backend
echo "Starting FastAPI Backend..."
.venv/bin/python backend/main.py &

# Start Frontend
echo "Starting React Frontend..."
cd frontend
npm run dev -- --host &

echo "✨ Both servers are running!"
echo "👉 View the UI at: http://localhost:5173"
echo "Press Ctrl+C to stop."

# Wait for background jobs
wait
