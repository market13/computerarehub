@echo off
title Upload Computer Care to GitHub
set "PATH=C:\Users\Hp\AppData\Local\hermes\tools\git-2.53.0+3-win32-x64\cmd;C:\Users\Hp\AppData\Local\hermes\tools\git-2.53.0+3-win32-x64\bin;C:\Users\Hp\AppData\Local\hermes\tools\git-2.53.0+3-win32-x64\mingw64\bin;%PATH%"
cd /d "C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder"

echo ========================================================
echo   Pushing Computer Care Custom PC Builder to GitHub...
echo   Repository: https://github.com/market13/computerarehub.git
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! All code has been uploaded to GitHub!
    echo   Check it out at: https://github.com/market13/computerarehub
    echo ========================================================
) else (
    echo ========================================================
    echo   Something went wrong during push. See message above.
    echo ========================================================
)
echo.
pause
