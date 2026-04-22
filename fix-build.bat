@echo off
echo Fixing AI Studio project build...
if exist postcss.config.js (
	del postcss.config.js
	echo Removed conflicting postcss.config.js
)
echo Running npm install...
call npm install
echo Building project...
call npm run build
echo Done!