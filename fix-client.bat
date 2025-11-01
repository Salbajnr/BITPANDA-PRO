@echo off
echo Cleaning up client directory...
cd /d "%~dp0client"

if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo Installing dependencies...
call npm install

if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
    echo You can now try running the client with: npm run dev
) else (
    echo Failed to install dependencies. Please check the error messages above.
)

pause
