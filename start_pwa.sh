#!/bin/bash
# Install dependencies if missing (basic check)
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "Installing backend dependencies..."
    python3 -m pip install fastapi uvicorn pydantic
fi

# Build frontend if dist doesn't exist
if [ ! -d "web/dist" ]; then
    echo "Building frontend..."
    cd web && npm install && npm run build && cd ..
fi

echo "Starting Server on http://localhost:8000"
echo "Press Ctrl+C to stop"
python3 -m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
