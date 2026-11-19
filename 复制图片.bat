@echo off
chcp 65001 >nul
setlocal
set "DST=%~dp0images"
if not exist "%DST%" mkdir "%DST%"

for /d %%D in ("%USERPROFILE%\Desktop\*") do if exist "%%D\T_ActivityRole*.webp" copy /y "%%D\T_ActivityRole*.webp" "%DST%\" >nul
for /d %%D in ("%USERPROFILE%\OneDrive\Desktop\*") do if exist "%%D\T_ActivityRole*.webp" copy /y "%%D\T_ActivityRole*.webp" "%DST%\" >nul

echo.
echo Done. Open the images folder and check that it holds 57 .webp files.
echo If it is still empty, copy the .webp files into images\ by hand.
echo.
pause
