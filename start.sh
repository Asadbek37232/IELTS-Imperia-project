#!/bin/bash
# Start script for IELTS Platform

echo "Starting Application..."

# Function to kill background processes on exit
cleanup() {
    echo "Shutting down..."
    kill $(jobs -p)
    exit
}
trap cleanup SIGINT SIGTERM

# Start backend
cd backend
npm run dev &
cd ..

# Start frontend
cd frontend
npm run dev &
cd ..

echo "Application started! Backend and Frontend are running in background."
wait
