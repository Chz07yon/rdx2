@echo off
echo Running Setup for RED Studio Assets...
mkdir "assets\logos" 2>nul
mkdir "assets\images" 2>nul
copy "..\assets\ACT.png" "assets\logos\primary-logo.png"
copy "..\assets\ACT.png" "assets\logos\secondary-logo.png"
echo Assets copied successfully! You can now deploy the red-studio folder.
pause
