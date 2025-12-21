@echo off
echo Fixing npm installation issues...
echo.

echo Clearing npm cache...
npm cache clean --force

echo Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Installing dependencies...
npm install

echo.
echo Installation complete! You can now run:
echo npm run dev
pause