@echo off
mkdir legacy-vanilla
move app.js legacy-vanilla\
move img legacy-vanilla\
move index.html legacy-vanilla\
move product.html legacy-vanilla\
move stadee.png legacy-vanilla\
move styles.css legacy-vanilla\
move styles.scss legacy-vanilla\
call npx --yes create-vite@latest temp-vite-app --template react
xcopy temp-vite-app . /E /H /C /I /Y
rmdir /S /Q temp-vite-app
call npm install
call npm install react-router-dom sass
