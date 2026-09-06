Write-Host "Starting GeoCadastre 3D (SIH 26011)..." -ForegroundColor Cyan

# Check if node modules exist, if not, install
if (!(Test-Path -Path ".\frontend\node_modules")) {
    Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

# Check if python dependencies are needed (we assume they are installed or user runs pip)
Write-Host "Ensuring Backend Dependencies..." -ForegroundColor Yellow
cd backend
python -m pip install fastapi uvicorn pydantic shapely
cd ..

# Start Backend
Write-Host "Starting Backend on Port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8000"

# Start Frontend
Write-Host "Starting Frontend on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Services are launching in new windows."
Write-Host "Backend API: http://localhost:8000"
Write-Host "Frontend UI: http://localhost:5173"
Write-Host "=========================================" -ForegroundColor Cyan
