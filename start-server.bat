@echo off
cd /d "%~dp0"
rem Put your LootRush username after the = to get the admin panel
set ADMIN_USERS=
if not exist node_modules call npm install
node server.js
pause
