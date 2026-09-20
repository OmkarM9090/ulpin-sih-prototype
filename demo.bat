@echo off
echo ===================================================
echo     Starting GeoCadastre 3D (BHU-3D) Prototype
echo ===================================================
echo.

cd frontend

echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing npm packages...
    call npm install
)

echo.
echo Starting Vite Development Server...
echo The application will open in your default browser shortly.
echo.

start http://localhost:5173
call npm run dev

pause
